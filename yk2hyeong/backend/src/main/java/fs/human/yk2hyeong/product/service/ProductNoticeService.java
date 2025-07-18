package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.vo.ProductNoticeVO;

import java.util.List;

public interface ProductNoticeService { 
    void createNotice(ProductNoticeVO notice); // 공지사항 등록
    void updateNotice(ProductNoticeVO notice); // 공지사항 수정
    void deleteNotice(String productNoticeId, String memberId); // 공지사항 삭제
    List<ProductNoticeVO> getNotices(String productId); // 상품별 공지사항 조회
}
