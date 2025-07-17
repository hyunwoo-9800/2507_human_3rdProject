package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductDAO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.ProductRegisterDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;

    @Value("${upload.path.thumbnail}")
    private String thumbnailDir;

    @Value("${upload.path.detailImages}")
    private String detailImageDir;

    @Autowired
    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    /**
     * 모든 상품 목록 조회
     */
    @Override
    public List<ProductVO> getAllProducts() {
        return productDAO.getAllProducts();
    }

    /**
     * 즐겨찾기 등록
     */
    @Override
    public void insertFavorite(String memberId, String productId) {
        productDAO.insertFavorite(memberId, productId);
    }

    /**
     * 즐겨찾기 삭제
     */
    @Override
    public void deleteFavorite(String memberId, String productId) {
        productDAO.deleteFavorite(memberId, productId);
    }

    /**
     * 회원별 즐겨찾기된 상품 ID 목록 조회
     */
    @Override
    public List<String> getFavoriteProductIds(String memberId) {
        return productDAO.selectFavoriteProductIds(memberId);
    }

    /**
     * 카테고리 계층 정보 조회
     * DB에서 중위 및 하위 카테고리 정보를 평면 리스트로 가져와
     * 중위코드를 기준으로 하위 카테고리 그룹핑하여 반환
     */
    @Override
    public List<CategoryVO> getCategoryHierarchy() {
        List<CategoryDetailVO> flatList = productDAO.selectCategoryDetails();

        Map<String, CategoryVO> categoryMap = new LinkedHashMap<>();

        for (CategoryDetailVO item : flatList) {
            String midCode = item.getMidCodeValue();

            categoryMap.computeIfAbsent(midCode, k -> {
                CategoryVO category = new CategoryVO();
                category.setMidCodeValue(item.getMidCodeValue());
                category.setMidCodeName(item.getMidCodeName());
                category.setSubCategories(new ArrayList<>());
                return category;
            });

            categoryMap.get(midCode).getSubCategories().add(item);
        }

        return new ArrayList<>(categoryMap.values());
    }

    /**
     * 상품 등록 처리 (트랜잭션 처리)
     * - 신규 상품 UUID 생성
     * - 상품 기본 정보 DB 등록
     * - 썸네일 및 상세 이미지 저장 및 DB 등록
     */
    @Override
    @Transactional
    public void registerProduct(ProductRegisterDTO dto) {
        // 상품 UUID 생성
        String productId = UUID.randomUUID().toString();

        // ProductVO에 값 세팅
        ProductVO product = new ProductVO();
        product.setProductId(productId);
        product.setProductCode(dto.getProductCode());
        product.setProductName(dto.getProductName());
        product.setProductDescription(dto.getProductDescription());
        product.setProductStockQty(dto.getProductStockQty());
        product.setProductUnitPrice(dto.getProductUnitPrice());
        product.setSellMemberId(dto.getSellMemberId());
        product.setProductType(dto.getProductType());
        product.setProductMinQtr(dto.getProductMinQtr());
        product.setProductRevStart(dto.getProductRevStart());
        product.setProductRevEnd(dto.getProductRevEnd());
        product.setProductDisplayFlag("C64A2EE83FBB4B0B9681227F31401EE0"); // 비표시 기본값
        product.setProductStatus("BE710CAB879F48DCB15CD44FC2FD1C50");       // 미승인 기본값
        product.setCreatedId(dto.getSellMemberId());
        product.setUpdatedId(dto.getSellMemberId());

        // DB에 상품 등록
        productDAO.insertProduct(product);

        // 썸네일 이미지 저장 (270x270 중앙 크롭 + 리사이징)
        MultipartFile thumbnail = dto.getThumbnail();
        if (thumbnail != null && !thumbnail.isEmpty()) {
            saveThumbnailFile(thumbnail, productId, "thumbnail", thumbnailDir, dto.getSellMemberId());
        }

        // 상세 이미지 저장 (최대 3장, 가로 최대 800px 비율 유지 리사이징)
        if (dto.getDetailImages() != null) {
            for (MultipartFile detailImage : dto.getDetailImages()) {
                if (detailImage != null && !detailImage.isEmpty()) {
                    saveDetailImageFile(detailImage, productId, "detail", detailImageDir, dto.getSellMemberId());
                }
            }
        }
    }

    /**
     * 썸네일 이미지 저장 (270x270 중앙 크롭 + 리사이징)
     */
    private void saveThumbnailFile(MultipartFile file, String productId, String imageType, String uploadDir, String memberId) {
        try {
            String originalFilename = file.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";

            String imageId = UUID.randomUUID().toString();
            String newFileName = imageId + ext;

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File destFile = new File(dir, newFileName);

            // 270x270 정사각형 중앙 크롭 후 리사이징
            Thumbnails.of(file.getInputStream())
                    .size(270, 270)
                    .crop(net.coobird.thumbnailator.geometry.Positions.CENTER)
                    .toFile(destFile);

            // DB에 이미지 정보 저장
            productDAO.insertImage(imageId, uploadDir, newFileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("썸네일 이미지 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 상세 이미지 저장 (가로 최대 800px, 세로 비율 유지)
     */
    private void saveDetailImageFile(MultipartFile file, String productId, String imageType, String uploadDir, String memberId) {
        try {
            String originalFilename = file.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";

            String imageId = UUID.randomUUID().toString();
            String newFileName = imageId + ext;

            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File destFile = new File(dir, newFileName);

            // 최대 가로 800px, 비율 유지하며 리사이징
            Thumbnails.of(file.getInputStream())
                    .size(600, 600)
                    .keepAspectRatio(true)
                    .toFile(destFile);

            // DB에 이미지 정보 저장
            productDAO.insertImage(imageId, uploadDir, newFileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("상세 이미지 저장 실패: " + e.getMessage(), e);
        }
    }
}
