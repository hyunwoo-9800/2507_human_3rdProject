package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductDAO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.ProductRegisterDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.sql.Date;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;

    private static final int THUMBNAIL_CROP_SIZE = 270;   // 썸네일 크롭 사이즈 (270x270)
    private static final int DETAIL_IMAGE_MAX_WIDTH = 600; // 상세 이미지 최대 가로

    private static final String PRODUCT_STATUS_PENDING = "BE710CAB879F48DCB15CD44FC2FD1C50";
    private static final String DISPLAY_FLAG_HIDDEN = "C64A2EE83FBB4B0B9681227F31401EE0";

    @Value("${upload.path.thumbnail}")
    private String thumbnailDir;

    @Value("${upload.path.detailImages}")
    private String detailImageDir;

    @Autowired
    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    @Override
    public List<ProductVO> getAllProducts() {
        return productDAO.getAllProducts();
    }

    @Override
    public void insertFavorite(String memberId, String productId) {
        productDAO.insertFavorite(memberId, productId);
    }

    @Override
    public void deleteFavorite(String memberId, String productId) {
        productDAO.deleteFavorite(memberId, productId);
    }

    @Override
    public List<String> getFavoriteProductIds(String memberId) {
        return productDAO.selectFavoriteProductIds(memberId);
    }

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

    @Override
    @Transactional
    public void registerProduct(ProductRegisterDTO dto) {
        String productId = UUID.randomUUID().toString();

        ProductVO product = new ProductVO();
        product.setProductId(productId);

        // DTO 필드명에 맞게 수정
        product.setProductCode(dto.getDetailCodeId());         // detailCodeId → productCode
        product.setProductName(dto.getProductName());
        product.setProductDescription(dto.getDescriptionText()); // descriptionText → productDescription
        product.setProductStockQty(dto.getSaleQuantity());     // saleQuantity → productStockQty
        product.setProductUnitPrice(dto.getProductPrice());    // productPrice 그대로
        product.setSellMemberId(dto.getMemberId());            // memberId → sellMemberId

        // orderType 문자열을 DB UUID 값으로 변환
        String dbProductType;
        switch (dto.getOrderType()) {
            case "immediate/reservation":
                dbProductType = "1DD01EB499174DF0877EC8DB1B6D57AE";
                break;
            case "immediate":
                dbProductType = "1E5886B66A524DC599E1DAEB866D40C8";
                break;
            case "reservation":
                dbProductType = "511B5B40E03F4B6C95083D9E16FF6D31";
                break;
            default:
                throw new IllegalArgumentException("Unknown orderType: " + dto.getOrderType());
        }
        product.setProductType(dbProductType);

        product.setProductMinQtr(dto.getMinSaleUnit());       // minSaleUnit → productMinQtr

        product.setProductRevStart(dto.getStartDate() != null ? Date.valueOf(dto.getStartDate()) : null);
        product.setProductRevEnd(dto.getEndDate() != null ? Date.valueOf(dto.getEndDate()) : null);

        product.setProductDisplayFlag(DISPLAY_FLAG_HIDDEN);
        product.setProductStatus(PRODUCT_STATUS_PENDING);

        product.setCreatedId(dto.getMemberId());
        product.setUpdatedId(dto.getMemberId());

        productDAO.insertProduct(product);

        MultipartFile thumbnail = dto.getThumbnail();
        if (thumbnail != null && !thumbnail.isEmpty()) {
            saveThumbnailImageFile(
                    thumbnail,
                    productId,
                    "200",
                    thumbnailDir,
                    dto.getMemberId()
            );
        }

        if (dto.getDetailImages() != null) {
            for (MultipartFile detailImage : dto.getDetailImages()) {
                if (detailImage != null && !detailImage.isEmpty()) {
                    saveDetailImageFile(
                            detailImage,
                            productId,
                            "300",
                            detailImageDir,
                            dto.getMemberId()
                    );
                }
            }
        }
    }


    /**
     * 썸네일 이미지 저장
     * - 비율 유지하며 가장 작은 면이 270px 이상이 되도록 리사이징
     * - 이후 270x270 중앙 크롭
     */
    private void saveThumbnailImageFile(MultipartFile file, String productId, String imageType, String uploadDir, String memberId) {
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

            // 이미지 읽어서 가로/세로 비율 계산
            // 썸네일은 가장 작은 면이 270 이상이 되도록 비율 유지 리사이징 후 270x270 중앙 크롭
            Thumbnails.Builder<?> builder = Thumbnails.of(file.getInputStream());

            // 먼저 이미지 원본 크기 가져오기 위해 임시 사이즈 지정 후 toBufferedImage() 호출
            // BufferedImage로 크기 직접 확인 후 처리할 수 있지만 Thumbnailator API에서는 직접 BufferedImage를 얻기 어렵기 때문에
            // 여기서는 우회하여 size 지정 후 toFile 대신 toBufferedImage를 써서 크기를 확인하고 처리하는 로직을 따로 구현해야 하지만,
            // 간단히 아래와 같이 가장 작은 면을 270 이상으로 설정한 후 crop을 적용

            // 비율 유지하며 가장 작은 면이 270이 되도록 사이즈 지정
            builder.size(THUMBNAIL_CROP_SIZE * 2, THUMBNAIL_CROP_SIZE * 2)
                    .keepAspectRatio(true)
                    .crop(Positions.CENTER)
                    .size(THUMBNAIL_CROP_SIZE, THUMBNAIL_CROP_SIZE)
                    .toFile(destFile);

            productDAO.insertImage(imageId, uploadDir, newFileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("썸네일 이미지 저장 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 상세 이미지 저장
     * - 최대 가로 600px, 비율 유지
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

            Thumbnails.of(file.getInputStream())
                    .size(DETAIL_IMAGE_MAX_WIDTH, DETAIL_IMAGE_MAX_WIDTH) // 최대 600px
                    .keepAspectRatio(true)
                    .toFile(destFile);

            productDAO.insertImage(imageId, uploadDir, newFileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("상세 이미지 저장 실패: " + e.getMessage(), e);
        }
    }
}
