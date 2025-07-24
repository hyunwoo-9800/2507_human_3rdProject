package fs.human.yk2hyeong.game.controller;

import fs.human.yk2hyeong.game.dao.GameDAO;
import fs.human.yk2hyeong.game.vo.GameVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


// 관리자 페이지 컨트롤러
@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class GameController {

    // 관리자 서비스, 공통코드 서비스
    private final GameDAO gameDAO;

    @PostMapping("/start")
    public ResponseEntity<?> startGame(@RequestBody Map<String, String> data) {
        String memberId = data.get("memberId");
        String gameName = data.get("gameName");

        int result = gameDAO.updateCredit(memberId);

        if (result == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "크레딧이 부족합니다."));
        }

        // 최신 크레딧 다시 조회
        int updatedCredit = gameDAO.getCredit(memberId);

        return ResponseEntity.ok(Map.of(
                "message", "게임 시작 가능!",
                "updatedCredit", updatedCredit
        ));
    }

    @PostMapping("/record")
    public ResponseEntity<String> recordScore(@RequestBody GameVO vo) {

        gameDAO.mergeScore(vo.getMemberId(), vo.getGameName(), vo.getCurrentScore());

        return ResponseEntity.ok("점수 저장 완료");

    }

    @PostMapping("/updateCredit")
    public ResponseEntity<?> updateCredit(@RequestBody Map<String, Object> body) {

        String memberId = (String) body.get("memberId");
        int amount = (int) body.get("amount"); // 음수면 차감, 양수면 보상

        int result = gameDAO.updateCreditByAmount(memberId, amount);

        if (result == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("크레딧 업데이트 실패");
        }

        int updatedCredit = gameDAO.getCredit(memberId);

        return ResponseEntity.ok(Map.of(
                "updatedCredit", updatedCredit
        ));
    }
    @PostMapping("/syncCredit")
    public ResponseEntity<String> syncCredit(@RequestBody Map<String, Object> data) {
        String memberId = (String) data.get("memberId");
        int credit = (int) data.get("credit");

        int result = gameDAO.updateCreditToExact(memberId, credit);

        if (result > 0) {
            return ResponseEntity.ok("크레딧 업데이트 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("업데이트 실패");
        }
    }
    
}
