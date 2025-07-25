package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.PaymentCompleteDTO;
import fs.human.yk2hyeong.product.vo.ProductRegisterDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;

import java.util.List;

// 상품관련 서비스 인터페이스
public interface ProductService {

    // 상품 전체 목록 조회
    List<ProductVO> getAllProducts() throws Exception;

    // memberId로 상품 목록 조회
    List<ProductVO> getProductsByMemberId(String memberId) throws Exception;

    //productId로 상품 목록 조회
    List<ProductVO> getProductsByIds(List<String> productIds);

    // 즐겨찾기 등록
    void insertFavorite(String memberId, String productId) throws Exception;

    // 즐겨찾기 삭제
    void deleteFavorite(String memberId, String productId) throws Exception;

    // 즐겨찾기된 상품 ID 리스트 조회
    List<String> getFavoriteProductIds(String memberId) throws Exception;

    // 카테고리 리스트 조회
    List<CategoryVO> getCategoryHierarchy() throws Exception;

    // 상품 등록
    void registerProduct(ProductRegisterDTO dto) throws Exception;

    // 금일 결제 건수 조회
    int selectTodayBuyCount() throws Exception;

    // 상품 결제(즉시 구매)
    void callPurchaseProcedure(PaymentCompleteDTO dto) throws Exception;

}
