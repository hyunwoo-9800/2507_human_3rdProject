package fs.human.yk2hyeong.mypage.service;

import fs.human.yk2hyeong.mypage.vo.MypageVO;

import java.util.List;

public interface MypageService {
    List<MypageVO> getPurchasedProducts(String memberId);

    List<MypageVO> selectNotification(String receiverId);

    List<MypageVO> selectSoldNotification(String receiverId);

//    알림탭 카드 읽음
    void updateIsRead(String alarmId);

    void deleteNotification(String alarmId);
}
