package fs.human.yk2hyeong.admin.dao;

import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

// 관리자 매퍼
@Mapper
public interface AdminDAO {

    List<ProductVO> selectPendingProduct();
    List<ProductImageVO> getProductImages(String productId);

    List<AdminVO> selectPendingMember();

    List<AdminVO> selectReport();
    List<AdminVO> selectMember();
}
