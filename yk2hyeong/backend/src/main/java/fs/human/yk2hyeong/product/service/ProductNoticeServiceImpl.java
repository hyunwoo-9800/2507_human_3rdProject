package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductNoticeDAO;
import fs.human.yk2hyeong.product.vo.ProductNoticeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductNoticeServiceImpl implements ProductNoticeService {

    // 의존성 주입
    @Autowired
    private ProductNoticeDAO productNoticeDAO;

    // 공지사항 등록
    @Override
    public void createNotice(ProductNoticeVO notice) {
        notice.setProductNoticeId(UUID.randomUUID().toString());
        productNoticeDAO.insertProductNotice(notice);
    }

    // 공지사항 수정
    @Override
    public void updateNotice(ProductNoticeVO notice) {
        productNoticeDAO.updateProductNotice(notice);
    }

    // 공지사항 삭제
    @Override
    public void deleteNotice(String productNoticeId, String memberId) {
        productNoticeDAO.deleteProductNotice(productNoticeId, memberId);
    }

    // 상품별 공지사항 조회
    @Override
    public List<ProductNoticeVO> getNotices(String productId) {
        return productNoticeDAO.selectProductNotices(productId);
    }
}
