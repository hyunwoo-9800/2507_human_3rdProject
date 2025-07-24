package fs.human.yk2hyeong.game.vo;

import lombok.Data;

import java.util.Date;

// 관리자 VO
@Data
public class GameVO {

    private String memberId;                // 회원 고유 ID (UUID)
    private int credit;                     // 보유 크레딧

    private String gameId;                  // 게임 ID
    private int bestScore;                  // 최고 점수
    private int currentScore;               // 현재 점수

    private String gameName;                // 게임명

    private String createdId;               // 등록자 ID
    private Date createdDate;               // 등록일시 (기본값 SYSDATE)
    private String updatedId;               // 수정자 ID
    private Date updatedDate;               // 수정일시 (기본값 SYSDATE)

}
