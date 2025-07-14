package fs.human.yk2hyeong.product.controller;

import fs.human.yk2hyeong.product.service.ProductService;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


// 상품관련 컨트롤러
@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

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

}
