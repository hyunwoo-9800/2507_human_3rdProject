package fs.human.yk2hyeong.mypage.service;

import fs.human.yk2hyeong.mypage.vo.MypageVO;

import java.util.List;

public interface MypageService {
    List<MypageVO> getPurchasedProducts(String memberId);
}
