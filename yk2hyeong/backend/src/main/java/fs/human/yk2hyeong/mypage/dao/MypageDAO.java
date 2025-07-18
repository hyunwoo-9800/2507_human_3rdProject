package fs.human.yk2hyeong.mypage.dao;

import fs.human.yk2hyeong.mypage.vo.MypageVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MypageDAO {
    List<MypageVO> selectPurchasedProducts(String memberId);
}
