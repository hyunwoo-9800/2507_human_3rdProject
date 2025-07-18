package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.ProductNoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ProductNoticeDAO {
    void insertProductNotice(ProductNoticeVO notice); // 공지사항 등록
    void updateProductNotice(ProductNoticeVO notice); // 공지사항 수정
    void deleteProductNotice(@Param("productNoticeId") String productNoticeId, @Param("memberId") String memberId); // 공지사항 삭제
    List<ProductNoticeVO> selectProductNotices(@Param("productId") String productId); // 상품별 공지사항 조회
}
