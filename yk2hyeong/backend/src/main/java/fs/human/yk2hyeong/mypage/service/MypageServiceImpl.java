package fs.human.yk2hyeong.mypage.service;
import fs.human.yk2hyeong.mypage.dao.MypageDAO;
import fs.human.yk2hyeong.mypage.vo.MypageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MypageServiceImpl implements MypageService {

    @Autowired
    private MypageDAO mypageDAO;

    @Override
    public List<MypageVO> getPurchasedProducts(String memberId){
        return mypageDAO.selectPurchasedProducts(memberId);
    }

    @Override
    public List<MypageVO> selectNotification(String receiverId) {
        return mypageDAO.selectNotification(receiverId);
    }

    @Override
    public List<MypageVO> selectSoldNotification(String receiverId) {
        return mypageDAO.selectSoldNotification(receiverId);
    }

//    카드 읽음 처리
    @Override
    public void updateIsRead(String alarmId){
        mypageDAO.updateIsRead(alarmId);
    }

//    마이페이지 알림 삭제
    @Transactional
    @Override
    public void deleteNotification(String alarmId){
        mypageDAO.deleteNotification(alarmId);
    }
}
