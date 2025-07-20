package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.vo.ProductNoticeVO;

import java.util.List;

/* 상품 공지사항 서비스 인터페이스 */
public interface ProductNoticeService {

    // 공지사항 등록
    void createNotice(ProductNoticeVO notice);

    // 공지사항 수정
    void updateNotice(ProductNoticeVO notice);

    // 공지사항 삭제
    void deleteNotice(String productNoticeId, String memberId);

    // 상품별 공지사항 조회
    List<ProductNoticeVO> getNotices(String productId);
    
}
