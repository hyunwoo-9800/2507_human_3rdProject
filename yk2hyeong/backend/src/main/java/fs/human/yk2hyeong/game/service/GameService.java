package fs.human.yk2hyeong.game.service;

// 관리자 서비스 인터페이스
public interface GameService {

    // 크레딧 조회
    int getCredit(String memberId) throws Exception;

    int updateCreditByAmount(String memberId, int amount) throws Exception;

    int updateCreditToExact(String memberId, int credit) throws Exception;

    // 크레딧 차감
    int updateCredit(String memberId) throws Exception;

    // 게임 스코어 저장
    void mergeScore(String memberId, String gameName, int currentScore) throws Exception;

}
