package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.vo.ProductVO;

import java.util.List;

// 상품관련 서비스 인터페이스
public interface ProductService {

    // 상품 전체 목록 조회
    List<ProductVO> getAllProducts();

    // 즐겨찾기 등록
    void insertFavorite(String memberId, String productId);

    // 즐겨찾기 삭제
    void deleteFavorite(String memberId, String productId);

    // 즐겨찾기된 상품 ID 리스트 조회
    List<String> getFavoriteProductIds(String memberId);
}
