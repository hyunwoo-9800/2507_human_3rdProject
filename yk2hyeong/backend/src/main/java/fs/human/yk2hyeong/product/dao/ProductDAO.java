package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.ProductVO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

// 상품관련 매퍼
@Mapper
public interface ProductDAO {

    // 상품 목록 조회
    List<ProductVO> getAllProducts();

    //memberId로 상품 목록 조회
    List<ProductVO> selectProductsByMemberId(@Param("memberId")String memberId);

    // 즐겨찾기 등록/삭제/조회
    void insertFavorite(String memberId, String productId);
    void deleteFavorite(String memberId, String productId);
    List<String> selectFavoriteProductIds(String memberId);

    // 카테고리 상세 목록 (중위/하위코드 모두 포함)
    List<CategoryDetailVO> selectCategoryDetails();

    // 상품 등록
    void insertProduct(ProductVO product);

    // 상품 이미지 등록
    void insertImage(String imageId, String imagePath, String imageName, String imageType, String memberId, String productId);

}
