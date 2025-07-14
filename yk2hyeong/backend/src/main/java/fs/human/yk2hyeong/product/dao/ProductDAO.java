package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

// 상품관련 매퍼
@Mapper
public interface ProductDAO {

//    @Select("SELECT * FROM TB_PRODUCT")
    List<ProductVO> getAllProducts();


}
