package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

// 상품관련 매퍼
@Mapper
public interface ProductDAO {

    List<ProductVO> getAllProducts();

    void insertFavorite(String memberId, String productId);

    void deleteFavorite(String memberId, String productId);

    List<String> selectFavoriteProductIds(String memberId);
}
