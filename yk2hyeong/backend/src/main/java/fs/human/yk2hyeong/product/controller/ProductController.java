package fs.human.yk2hyeong.product.controller;

import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import fs.human.yk2hyeong.product.service.ProductService;
import fs.human.yk2hyeong.product.service.ProductNoticeService;
import fs.human.yk2hyeong.product.vo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

// 상품관련 컨트롤러
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ProductController {

    private final ProductService productService;
    private final AdminService adminService;
    private final ProductNoticeService productNoticeService;

    // 상품 목록 조회(전체 상품 목록)
    @GetMapping("/products")
    public List<ProductVO> getAllProducts() throws Exception {

        return productService.getAllProducts();

    }
    
    // 상품 목록 조회(본인이 등록한 상품 목록)
    @GetMapping("/products/myPage")
    public List<ProductVO> getMyProducts(Authentication authentication) throws Exception {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        String memberId = loginMember.getMemberId();
        return productService.selectProductsByMemberId(memberId);

    }

    //상품목록 ID로 조회
    @PostMapping("/products/by-ids")
    public List<ProductVO> getProductsByIds(@RequestBody Map<String, List<String>> request) {

        List<String> productIds = request.get("productIds");
        return productService.getProductsByIds(productIds);

    }

    // 즐겨찾기 등록
    @PostMapping("/favorites")
    public ResponseEntity<String> insertFavorite(
            @RequestBody Map<String, String> payload,
            Authentication authentication) throws Exception {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        String memberId = loginMember.getMemberId();
        String productId = payload.get("productId");

        productService.insertFavorite(memberId, productId);

        // System.out.println("[즐겨찾기 등록 완료] memberId=" + memberId + ", productId=" + productId);

        // 현재 즐겨찾기 목록 출력
        List<String> currentFavorites = productService.getFavoriteProductIds(memberId);
        // System.out.println("[현재 즐겨찾기 목록] " + currentFavorites);

        return ResponseEntity.ok("즐겨찾기 등록 완료");

    }

    // 즐겨찾기 삭제
    @DeleteMapping("/favorites")
    public ResponseEntity<String> deleteFavorite(
            @RequestBody Map<String, String> payload,
            Authentication authentication) throws Exception {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();

        String memberId = loginMember.getMemberId();
        String productId = payload.get("productId");
        productService.deleteFavorite(memberId, productId);

        // System.out.println("[즐겨찾기 삭제 완료] memberId=" + memberId + ", productId=" + productId);

        // 현재 즐겨찾기 목록 출력
        List<String> currentFavorites = productService.getFavoriteProductIds(memberId);
        // System.out.println("[현재 즐겨찾기 목록] " + currentFavorites);

        return ResponseEntity.ok("즐겨찾기 삭제 완료");

    }

    // 즐겨찾기된 productId 목록 반환
    @GetMapping("/favorites")
    public ResponseEntity<List<String>> getFavorites(Authentication authentication) throws Exception {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();

        String memberId = loginMember.getMemberId();

        List<String> favorites = productService.getFavoriteProductIds(memberId);
        return ResponseEntity.ok(favorites);

    }

    // 카테고리 리스트 조회
    @GetMapping("/category")
    public ResponseEntity<List<CategoryVO>> getCategoryHierarchy() throws Exception {

        return ResponseEntity.ok(productService.getCategoryHierarchy());

    }

    @PostMapping("/products/register")
    public ResponseEntity<?> registerProduct(
            @RequestParam String productName,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam BigDecimal productPrice,
            @RequestParam String detailCodeId,
            @RequestParam String orderType,
            @RequestParam int saleQuantity,
            @RequestParam int minSaleUnit,
            @RequestParam String descriptionText,
            @RequestParam String memberId,
            @RequestPart MultipartFile thumbnail,
            @RequestPart(required = false) List<MultipartFile> detailImages,
            Authentication authentication
    ) throws Exception {
        // 현재 실행 경로 및 저장 경로 출력
        String basePath = System.getProperty("user.dir");
        String thumbnailDir = java.nio.file.Paths.get(basePath, "frontend", "public", "static", "images", "thumbnail").toString();
        String detailImageDir = java.nio.file.Paths.get(basePath, "frontend", "public", "static", "images", "detailimages").toString();

        // System.out.println("🗂 현재 작업 디렉토리: " + basePath);
        // System.out.println("🖼 썸네일 저장 경로: " + thumbnailDir);
        // System.out.println("📸 상세이미지 저장 경로: " + detailImageDir);
        // System.out.println("✅ productName: " + productName);
        // System.out.println("✅ startDate: " + startDate);
        // System.out.println("✅ endDate: " + endDate);
        // System.out.println("✅ productPrice: " + productPrice);
        // System.out.println("✅ detailCodeId: " + detailCodeId);
        // System.out.println("✅ orderType: " + orderType);
        // System.out.println("✅ saleQuantity: " + saleQuantity);
        // System.out.println("✅ minSaleUnit: " + minSaleUnit);
        // System.out.println("✅ descriptionText: " + descriptionText);
        // System.out.println("✅ memberId: " + memberId);
        // System.out.println("✅ thumbnail file name: " + thumbnail.getOriginalFilename());

        if (detailImages != null) {
            for (MultipartFile file : detailImages) {
                System.out.println("📷 detail image: " + file.getOriginalFilename());
            }
        }

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        ProductRegisterDTO dto = new ProductRegisterDTO();
        dto.setProductName(productName);
        dto.setStartDate(LocalDate.parse(startDate));
        dto.setEndDate(LocalDate.parse(endDate));
        dto.setProductPrice(productPrice);
        dto.setDetailCodeId(detailCodeId);
        dto.setOrderType(orderType);
        dto.setSaleQuantity(saleQuantity);
        dto.setMinSaleUnit(minSaleUnit);
        if (descriptionText.equals("") || descriptionText == null) {

            dto.setDescriptionText(" ");

        } else {

            dto.setDescriptionText(descriptionText);

        }

        dto.setMemberId(loginMember.getMemberId());
        // dto.setMemberId(memberId);
        dto.setThumbnail(thumbnail);
        dto.setDetailImages(detailImages);


        productService.registerProduct(dto);

        return ResponseEntity.ok("상품 등록 성공");

    }

    // 상품별 공지사항 목록 조회
    @GetMapping("/products/{productId}/notices")
    public List<ProductNoticeVO> getProductNotices(@PathVariable String productId) {

        return productNoticeService.getNotices(productId);

    }

    // 상품 공지사항 등록
    @PostMapping("/products/{productId}/notices")
    public ResponseEntity<?> createProductNotice(
            @PathVariable String productId,
            @RequestBody Map<String, String> body,
            // @RequestHeader("memberid") String memberId,
            Authentication authentication
    ) {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        String memberId = loginMember.getMemberId();

        ProductNoticeVO notice = new ProductNoticeVO();
        notice.setProductId(productId);
        notice.setProductTitle(body.get("title"));
        notice.setProductNoticeContent(body.get("content"));
        notice.setProductNoticeType(body.get("type"));
        notice.setMemberId(memberId);

        productNoticeService.createNotice(notice);

        return ResponseEntity.ok().build();

    }

    // 상품 공지사항 수정
    @PutMapping("/products/{productId}/notices/{noticeId}")
    public ResponseEntity<?> updateProductNotice(
            @PathVariable String productId,
            @PathVariable String noticeId,
            @RequestBody Map<String, String> body,
            // @RequestHeader("memberid") String memberId,
            Authentication authentication
    ) {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        String memberId = loginMember.getMemberId();

        ProductNoticeVO notice = new ProductNoticeVO();

        notice.setProductNoticeId(noticeId);
        notice.setProductId(productId);
        notice.setProductTitle(body.get("title"));
        notice.setProductNoticeContent(body.get("content"));
        notice.setProductNoticeType(body.get("type"));
        notice.setMemberId(memberId);

        productNoticeService.updateNotice(notice);

        return ResponseEntity.ok().build();

    }

    // 상품 공지사항 삭제
    @DeleteMapping("/products/{productId}/notices/{noticeId}")
    public ResponseEntity<?> deleteProductNotice(
            @PathVariable String productId,
            @PathVariable String noticeId,
            Authentication authentication
            // @RequestHeader("memberid") String memberId
    ) {
        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        String memberId = loginMember.getMemberId();
        productNoticeService.deleteNotice(noticeId, memberId);

        return ResponseEntity.ok().build();

    }

    // 상품 결제(즉시 구매)
    @PostMapping("/payment/complete")
    public ResponseEntity<?> completePayment(@RequestBody PaymentCompleteDTO dto) throws Exception {

        try {
            
            
            String orderNum = generateOrderNumber();    // 주문번호 생성
            
            dto.setOrderType(dto.getOrderType());       // 결제 타입
            dto.setOrderNumber(orderNum);               // 주문번호
            dto.setCreatedId(dto.getMemberId());        // created_id에도 memberId 사용

            productService.callPurchaseProcedure(dto);  // 프로시저 호출

            return ResponseEntity.ok().body("결제 완료");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("결제 처리 실패");

        }

    }

    public String generateOrderNumber() throws Exception {
        LocalDate today = LocalDate.now();
        String datePart = today.format(DateTimeFormatter.BASIC_ISO_DATE); // 예: 20250721

        // 오늘 날짜 주문 수 조회
        int todayOrderCount = productService.selectTodayBuyCount();

        // 주문번호 조립
        String orderNum = "ORD" + datePart + "-" + String.format("%04d", todayOrderCount + 1);

        return orderNum;
    }

}

