package fs.human.yk2hyeong.mypage.controller;

import fs.human.yk2hyeong.member.vo.MemberVO;
import fs.human.yk2hyeong.mypage.service.MypageService;
import fs.human.yk2hyeong.mypage.vo.MypageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mypage")
public class MypageController {

    @Autowired
    private MypageService mypageService;

    @GetMapping("/purchased")
    public List<MypageVO> getPurchasedProducts(@RequestParam("memberId") String memberId) {
        return mypageService.getPurchasedProducts(memberId);
    }

    @GetMapping("/notification")
    public ResponseEntity<List<MypageVO>> getNotification(Authentication authentication) {

        MemberVO loginMember = (MemberVO) authentication.getPrincipal();
        List<MypageVO> notification = mypageService.selectNotification(loginMember.getMemberId());
        return ResponseEntity.ok(notification);

    }
    @GetMapping("/sold-notification")
    public ResponseEntity<List<MypageVO>> getSoldNotification(@RequestParam("memberId") String memberId) {
        List<MypageVO> list = mypageService.selectSoldNotification(memberId);
        return ResponseEntity.ok(list);
    }

//    알림탭 읽음 처리 이벤트
    @PutMapping("/notification/read/{alarmId}")
    public ResponseEntity<String> updateIsRead(@PathVariable String alarmId){
        try {
            mypageService.updateIsRead(alarmId);
            return ResponseEntity.ok("읽음 처리 완료");
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알림 읽음");
        }
    }

    //    알림탭 알림삭제 이벤트
    @DeleteMapping("/notification/{alarmId}")
    public ResponseEntity<?> deleteNotification(@PathVariable String alarmId) {
        mypageService.deleteNotification(alarmId);
        return ResponseEntity.ok().build();
    }

}
