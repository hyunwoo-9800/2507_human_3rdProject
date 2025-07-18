package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductDAO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.ProductRegisterDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import jakarta.annotation.PostConstruct;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductDAO productDAO;

    private static final int THUMBNAIL_CROP_SIZE = 270;
    private static final int DETAIL_IMAGE_MAX_WIDTH = 600;

    private static final String PRODUCT_STATUS_PENDING = "BE710CAB879F48DCB15CD44FC2FD1C50";
    private static final String DISPLAY_FLAG_HIDDEN = "C64A2EE83FBB4B0B9681227F31401EE0";

    // application.properties 에는 상대경로만 넣음
    @Value("${upload.path.thumbnail}")
    private String thumbnailRelativePath;

    @Value("${upload.path.detailImages}")
    private String detailImagesRelativePath;

    // 절대경로로 변환된 값들
    private String thumbnailDir;
    private String detailImageDir;

    @Autowired
    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    @PostConstruct
    public void init() {
        String userDir = System.getProperty("user.dir");
        thumbnailDir = Paths.get(userDir, thumbnailRelativePath).toAbsolutePath().normalize().toString();
        detailImageDir = Paths.get(userDir, detailImagesRelativePath).toAbsolutePath().normalize().toString();

        System.out.println("✅[DEBUG] 현재 작업 디렉토리: " + userDir);
        System.out.println("✅[DEBUG] 썸네일 절대경로: " + thumbnailDir);
        System.out.println("✅[DEBUG] 상세이미지 절대경로: " + detailImageDir);
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

        product.setProductCode(dto.getDetailCodeId());
        product.setProductName(dto.getProductName());
        product.setProductDescription(dto.getDescriptionText());
        product.setProductStockQty(dto.getSaleQuantity());
        product.setProductUnitPrice(dto.getProductPrice());
        product.setSellMemberId(dto.getMemberId());

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

        product.setProductMinQtr(dto.getMinSaleUnit());

        product.setProductRevStart(dto.getStartDate() != null ? Date.valueOf(dto.getStartDate()) : null);
        product.setProductRevEnd(dto.getEndDate() != null ? Date.valueOf(dto.getEndDate()) : null);

        product.setProductDisplayFlag(DISPLAY_FLAG_HIDDEN);
        product.setProductStatus(PRODUCT_STATUS_PENDING);

        product.setCreatedId(dto.getMemberId());
        product.setUpdatedId(dto.getMemberId());

        productDAO.insertProduct(product);

        MultipartFile thumbnail = dto.getThumbnail();
        if (thumbnail != null && !thumbnail.isEmpty()) {
            // 썸네일 270x270 (imageType 200)
            String thumb270Name = productId + "_200.jpg";
            String thumb270Id = UUID.randomUUID().toString();
            saveImageFile(thumbnail, thumb270Name, thumb270Id, "200", thumbnailDir, dto.getMemberId(), 270, 270, productId);

            // 썸네일 600x510 (imageType 400)
            String thumb610Name = productId + "_400.jpg";
            String thumb610Id = UUID.randomUUID().toString();
            saveImageFile(thumbnail, thumb610Name, thumb610Id, "400", thumbnailDir, dto.getMemberId(), 600, 510, productId);
        }

        if (dto.getDetailImages() != null) {
            for (int i = 0; i < dto.getDetailImages().size(); i++) {
                MultipartFile detailImage = dto.getDetailImages().get(i);
                if (detailImage != null && !detailImage.isEmpty()) {
                    String orderStr = String.format("%03d", i + 1);
                    String detailName = productId + "_" + orderStr + "_300.jpg";
                    String detailId = UUID.randomUUID().toString();
                    saveDetailImageFile(detailImage, detailName, detailId, "300", detailImageDir, dto.getMemberId(), productId);
                }
            }
        }
    }

    private void saveImageFile(MultipartFile file, String fileName, String imageId, String imageType, String uploadDir, String memberId, int width, int height, String productId) {
        try {
            // [로컬에 실제 파일 저장]
            // 1. 저장할 디렉토리 없으면 생성
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // 2. 저장할 파일 객체 생성
            File destFile = new File(dir, fileName);

            // 3. 이미지 리사이즈/크롭 후 파일로 저장 (ex: 썸네일 270x270, 600x510)
            Thumbnails.of(file.getInputStream())
                    .size(width, height)
                    .crop(Positions.CENTER)
                    .outputFormat("jpg")
                    .toFile(destFile);

            // 4. DB에는 상대경로만 저장 (images/thumbnail)
            String dbImagePath = "images/thumbnail";
            productDAO.insertImage(imageId, dbImagePath, fileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패: " + e.getMessage(), e);
        }
    }

    private void saveDetailImageFile(MultipartFile file, String fileName, String imageId, String imageType, String uploadDir, String memberId, String productId) {
        try {
            // [로컬에 실제 파일 저장]
            // 1. 저장할 디렉토리 없으면 생성
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            // 2. 저장할 파일 객체 생성
            File destFile = new File(dir, fileName);

            // 3. 이미지 리사이즈(가로 1125px, 세로 비율유지) 후 파일로 저장
            Thumbnails.of(file.getInputStream())
                    .size(1125, 9999)
                    .keepAspectRatio(true)
                    .outputFormat("jpg")
                    .toFile(destFile);

            // 4. DB에는 상대경로만 저장 (images/detailimages)
            String dbImagePath = "images/detailimages";
            productDAO.insertImage(imageId, dbImagePath, fileName, imageType, memberId, productId);
        } catch (IOException e) {
            throw new RuntimeException("상세 이미지 저장 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ProductVO> getProductsByMemberId(String memberId) {
        return productDAO.selectProductsByMemberId(memberId);
    }
}