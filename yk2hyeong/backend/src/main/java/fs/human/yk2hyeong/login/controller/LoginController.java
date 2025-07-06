package fs.human.yk2hyeong.login.controller;

import fs.human.yk2hyeong.login.service.LoginService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 로그인 컨트롤러
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    // 세션 유지 확인용 API (React 새로고침 시 로컬스토리지 초기화 방지)
    @GetMapping("/session-check")
    public ResponseEntity<?> checkSession(HttpSession session) {

        MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");

        if (loginMember != null) {

            return ResponseEntity.ok(loginMember);                   // 로그인 정보 그대로 반환

        } else {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 없음 또는 만료");

        }

    }

    // 로그인 요청 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberVO input, HttpSession session) {

        try {

            MemberVO loginMember = loginService.login(input.getMemberEmail(), input.getMemberPwd());

            if (loginMember == null) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 올바르지 않습니다.");

            }

            // 로그인 성공: 세션에 저장
            session.setAttribute("loginMember", loginMember);
            loginMember.setMemberPwd(null);                         // 비밀번호는 응답에서 제거
            return ResponseEntity.ok(loginMember);

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());

        }

    }

    // 로그아웃 요청 처리
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();
        return ResponseEntity.ok("로그아웃 완료");

    }

}
