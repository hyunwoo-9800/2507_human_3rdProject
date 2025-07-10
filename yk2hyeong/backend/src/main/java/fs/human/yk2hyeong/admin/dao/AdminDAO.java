package fs.human.yk2hyeong.admin.dao;

import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

// 관리자 매퍼
@Mapper
public interface AdminDAO {
    List<ProductVO> selectPendingProduct();
}
