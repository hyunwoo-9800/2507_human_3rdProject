package fs.human.yk2hyeong.game.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

// 관리자 매퍼
@Mapper
public interface GameDAO {

    // 크레딧 조회
    int getCredit(String memberId) throws DataAccessException;

    int updateCreditByAmount(String memberId, int amount) throws DataAccessException;

    int updateCreditToExact(String memberId, int credit) throws DataAccessException;

    // 크레딧 차감
    int updateCredit(String memberId) throws DataAccessException;

    // 게임 스코어 저장
    void mergeScore(String memberId, String gameName, int currentScore) throws DataAccessException;

}
