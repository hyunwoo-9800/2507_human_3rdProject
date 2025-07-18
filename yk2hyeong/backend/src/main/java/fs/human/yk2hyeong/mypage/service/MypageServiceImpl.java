package fs.human.yk2hyeong.mypage.service;
import fs.human.yk2hyeong.mypage.dao.MypageDAO;
import fs.human.yk2hyeong.mypage.vo.MypageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MypageServiceImpl implements MypageService {

    @Autowired
    private MypageDAO mypageDAO;

    @Override
    public List<MypageVO> getPurchasedProducts(String memberId){
        return mypageDAO.selectPurchasedProducts(memberId);
    }
}
