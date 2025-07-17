package fs.human.yk2hyeong.product.controller;

import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.product.service.ProductService;
import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.ProductRegisterDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// 상품관련 컨트롤러
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final AdminService adminService;

    // 상품 목록 조회
    @GetMapping("/products")
    public List<ProductVO> getAllProducts() {
        return productService.getAllProducts();
    }

    // 즐겨찾기 등록
    @PostMapping("/favorites")
    public ResponseEntity<String> insertFavorite(@RequestBody Map<String, String> payload) {
        String memberId = payload.get("memberId");
        String productId = payload.get("productId");
        productService.insertFavorite(memberId, productId);
        System.out.println("[즐겨찾기 등록 완료] memberId=" + memberId + ", productId=" + productId);

        // 현재 즐겨찾기 목록 출력
        List<String> currentFavorites = productService.getFavoriteProductIds(memberId);
        System.out.println("[현재 즐겨찾기 목록] " + currentFavorites);

        return ResponseEntity.ok("즐겨찾기 등록 완료");
    }

    // 즐겨찾기 삭제
    @DeleteMapping("/favorites")
    public ResponseEntity<String> deleteFavorite(@RequestBody Map<String, String> payload) {
        String memberId = payload.get("memberId");
        String productId = payload.get("productId");
        productService.deleteFavorite(memberId, productId);
        System.out.println("[즐겨찾기 삭제 완료] memberId=" + memberId + ", productId=" + productId);

        // 현재 즐겨찾기 목록 출력
        List<String> currentFavorites = productService.getFavoriteProductIds(memberId);
        System.out.println("[현재 즐겨찾기 목록] " + currentFavorites);

        return ResponseEntity.ok("즐겨찾기 삭제 완료");
    }

    // 즐겨찾기된 productId 목록 반환
    @GetMapping("/favorites")
    public ResponseEntity<List<String>> getFavorites(@RequestParam String memberId) {
        List<String> favorites = productService.getFavoriteProductIds(memberId);
        return ResponseEntity.ok(favorites);
    }

    // 카테고리 리스트 조회
    @GetMapping("/category")
    public ResponseEntity<List<CategoryVO>> getCategoryHierarchy() {
        return ResponseEntity.ok(productService.getCategoryHierarchy());
    }

    // 상품 등록 - multipart/form-data 요청 처리
    @PostMapping("/products/register")
    public ResponseEntity<String> registerProduct(@ModelAttribute ProductRegisterDTO dto) {
        System.out.println("thumbnail: " + dto.getThumbnail());
        System.out.println("detailImages: " + dto.getDetailImages());
        try {
            productService.registerProduct(dto);
            return ResponseEntity.ok("상품 등록 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("상품 등록 실패: " + e.getMessage());
        }
    }
}
