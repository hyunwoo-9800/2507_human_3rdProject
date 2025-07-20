package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.common.code.dao.CodeDAO;
import fs.human.yk2hyeong.common.code.vo.CodeVO;
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

/* 상품 서비스 구현 */
@Service
public class ProductServiceImpl implements ProductService {

    // 의존성 주입
    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private CodeDAO codeDAO;

    // 이미지 크기
    private static final int THUMBNAIL_CROP_SIZE = 270;
    private static final int DETAIL_IMAGE_MAX_WIDTH = 600;

    // 상품 상태
    // private static final String PRODUCT_STATUS_PENDING = "BE710CAB879F48DCB15CD44FC2FD1C50";
    // private static final String DISPLAY_FLAG_HIDDEN = "C64A2EE83FBB4B0B9681227F31401EE0";

    // application.properties 에는 상대경로만 넣음
    @Value("${upload.path.thumbnail}")
    private String thumbnailRelativePath;

    @Value("${upload.path.detailImages}")
    private String detailImagesRelativePath;

    // 절대경로로 변환된 값들
    private String thumbnailDir;
    private String detailImageDir;

//    @Autowired
//    public ProductServiceImpl(ProductDAO productDAO) {
//        this.productDAO = productDAO;
//    }

    // 최초 실행
    @PostConstruct
    public void init() {

        String userDir = System.getProperty("user.dir");
        thumbnailDir = Paths.get(userDir, thumbnailRelativePath).toAbsolutePath().normalize().toString();
        detailImageDir = Paths.get(userDir, detailImagesRelativePath).toAbsolutePath().normalize().toString();

        // System.out.println("✅[DEBUG] 현재 작업 디렉토리: " + userDir);
        // System.out.println("✅[DEBUG] 썸네일 절대경로: " + thumbnailDir);
        // System.out.println("✅[DEBUG] 상세이미지 절대경로: " + detailImageDir);

    }

    // 전체 상품 조회
    @Override
    public List<ProductVO> getAllProducts() {

        return productDAO.getAllProducts();

    }

    // 즐겨찾기 등록
    @Override
    public void insertFavorite(String memberId, String productId) {
        
        productDAO.insertFavorite(memberId, productId);
        
    }

    // 즐겨찾기 삭제
    @Override
    public void deleteFavorite(String memberId, String productId) {
        
        productDAO.deleteFavorite(memberId, productId);
        
    }

    // 즐겨찾기 목록
    @Override
    public List<String> getFavoriteProductIds(String memberId) {
        
        return productDAO.selectFavoriteProductIds(memberId);
        
    }

    // 하위 코드 목록 조회
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
    
    // 상품 등록
    @Override
    @Transactional
    public void registerProduct(ProductRegisterDTO dto) {

        String productId = UUID.randomUUID().toString();

        ProductVO product = new ProductVO();

        // product.setProductId(productId);                          // 상품 고유 ID(오라클에서 처리함)
        product.setProductCode(dto.getDetailCodeId());               // 코드 상세 고유 ID
        product.setProductName(dto.getProductName());                // 상품 명

        if (dto.getDescriptionText() == null || dto.getDescriptionText() == "") {

            product.setProductDescription(" ");

        } else {

            product.setProductDescription(dto.getDescriptionText());    // 상품 설명

        }

        product.setProductStockQty(dto.getSaleQuantity());          // 재고 수량
        product.setProductUnitPrice(dto.getProductPrice());         // 판매 가격
        product.setSellMemberId(dto.getMemberId());                 // 판매자 ID
        String dbProductType;                                       // 상품 타입

        String productStatusPending = codeDAO.getDisProduct();          // 상품 미승인
        String displayFlagHidden = codeDAO.getNotDisplayProduct();      // 상품 비표시

        // 상품 타입 결정
        switch (dto.getOrderType()) {

            case "immediate/reservation":
                dbProductType = codeDAO.getProductCode1();
                break;

            case "immediate":
                dbProductType = codeDAO.getProductCode2();
                break;

            case "reservation":
                dbProductType = codeDAO.getProductCode3();
                break;

            default:
                throw new IllegalArgumentException("Unknown orderType: " + dto.getOrderType());

        }
        
        product.setProductType(dbProductType);                  // 상품 타입

        product.setProductMinQtr(dto.getMinSaleUnit());         // 최소 구매 수량

        product.setProductRevStart(dto.getStartDate() != null ? Date.valueOf(dto.getStartDate()) : null);   // 예약 시작일
        product.setProductRevEnd(dto.getEndDate() != null ? Date.valueOf(dto.getEndDate()) : null);         // 예약 마감일

        product.setProductDisplayFlag(displayFlagHidden);     // 상품 노출 상태
        product.setProductStatus(productStatusPending);       // 상품 미승인

        product.setCreatedId(dto.getMemberId());                // 작성자
        product.setUpdatedId(dto.getMemberId());                // 수정자

        // 상품 저장
        productDAO.insertProduct(product);

        // 섬네일
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