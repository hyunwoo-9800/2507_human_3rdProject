package fs.human.yk2hyeong.member.controller;

import fs.human.yk2hyeong.member.service.MemberService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 회원 관련 API 컨트롤러
 * - 회원가입 처리 담당
 *
 * @author 조현우
 * @since 2025-07-06
 */
@RestController
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private MemberService memberService;

    /**
     * 회원가입 처리 API
     *
     * @param member 클라이언트에서 전달받은 회원 정보
     * @return 성공 시 200 OK, 실패 시 400 Bad Request
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody MemberVO member) {

        try {

            memberService.registerMember(member);
            return ResponseEntity.ok().body("회원가입 성공");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패: " + e.getMessage());

        }

    }

}
