package fs.human.yk2hyeong.game.service;

import fs.human.yk2hyeong.game.dao.GameDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


// 관리자 서비스 구현
@Service
public class GameServiceImpl implements GameService {

    @Autowired
    GameDAO gameDAO;

    /**
     * @param memberId
     * @return
     * @throws Exception
     */
    @Override
    public int getCredit(String memberId) throws Exception {

        return gameDAO.getCredit(memberId);

    }

    /**
     * @return
     * @throws Exception
     */
    @Override
    public int updateCredit(String memberId) throws Exception {

       return gameDAO.updateCredit(memberId);

    }

    /**
     * @param memberId
     * @param gameName
     * @param currentScore
     * @throws Exception
     */
    @Override
    public void mergeScore(String memberId, String gameName, int currentScore) throws Exception {

        gameDAO.mergeScore(memberId, gameName, currentScore);

    }

    /**
     * @param memberId
     * @return
     * @throws Exception
     */
    @Override
    public int updateCreditByAmount(String memberId, int amount) throws Exception {

        return gameDAO.updateCreditByAmount(memberId, amount);

    }

    /**
     * @param memberId
     * @param credit
     * @return
     * @throws Exception
     */
    @Override
    public int updateCreditToExact(String memberId, int credit) throws Exception {
        return gameDAO.updateCreditToExact(memberId, credit);
    }
}
