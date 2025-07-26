package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.PaymentCompleteDTO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import java.util.List;

// 상품관련 매퍼
@Mapper
public interface ProductDAO {

    // 상품 목록 조회
    List<ProductVO> getAllProducts();

    //memberId로 상품 목록 조회
    List<ProductVO> selectProductsByMemberId(String memberId) throws DataAccessException;

    //productId로 상품 목록 조회
    List<ProductVO> getProductsByIds(@Param("productIds") List<String> productIds);

    // 즐겨찾기 등록/삭제/조회
    void insertFavorite(String memberId, String productId) throws DataAccessException;
    void deleteFavorite(String memberId, String productId) throws DataAccessException;
    List<String> selectFavoriteProductIds(String memberId) throws DataAccessException;

    // 카테고리 상세 목록 (중위/하위코드 모두 포함)
    List<CategoryDetailVO> selectCategoryDetails() throws DataAccessException;

    // 상품 등록
    void insertProduct(ProductVO product) throws DataAccessException;

    // 상품 이미지 등록
    void insertImage(String imageId, String imagePath, String imageName, String imageType, String memberId, String productId) throws DataAccessException;

    // 마지막에 삽입된 상품 ID 조회
    String getLastInsertedProductId(@Param("memberId") String memberId, @Param("productName") String productName) throws DataAccessException;

    // 금일 결제 건수 조회
    int selectTodayBuyCount() throws DataAccessException;

    // 상품 결제(즉시 구매)
    void callPurchaseProcedure(PaymentCompleteDTO dto) throws DataAccessException;

}
