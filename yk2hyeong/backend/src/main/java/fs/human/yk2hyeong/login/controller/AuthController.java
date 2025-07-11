package fs.human.yk2hyeong.login.controller;

import fs.human.yk2hyeong.common.config.JwtUtil;
import fs.human.yk2hyeong.login.service.LoginService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AuthController 클래스
 *
 * 이 클래스는 인증 관련 API를 처리하는 컨트롤러로, 사용자의 로그인 상태 확인과 로그아웃 기능을 제공합니다.
 * - /me: 현재 로그인된 사용자의 정보를 반환합니다.
 * - /logout: 사용자를 로그아웃시키고 토큰을 삭제합니다.
 *
 * 작성자: 조현우
 * 작성일: 2025-07-11
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LoginService loginService;
    private final JwtUtil jwtUtil;

    /**
     * 로그인된 사용자 정보를 가져오는 메서드
     *
     * @param token 클라이언트에서 전달된 JWT 토큰
     * @return 로그인된 사용자 정보 또는 로그인되지 않은 상태에 대한 오류 메시지
     * @throws Exception 예외 발생 시
     */
    @GetMapping("/me")
    public ResponseEntity<?> getLoginMember(@CookieValue(name = "token", required = false) String token) throws Exception {
        // 토큰이 없거나 유효하지 않은 경우, 로그인되지 않았다고 응답
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인되지 않았습니다."));
        }

        // 토큰에서 이메일을 추출하여 사용자 정보를 조회
        String email = jwtUtil.getEmailFromToken(token);
        MemberVO member = loginService.selectByEmail(email);

        // 사용자가 없으면, 사용자 정보 없음 오류 응답
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "사용자 정보 없음"));
        }

        // 사용자 정보 반환
        return ResponseEntity.ok(member);
    }

    /**
     * 로그아웃 기능을 수행하는 메서드
     *
     * @param response 클라이언트로 응답을 전송하는 HttpServletResponse 객체
     * @return 로그아웃 성공 메시지
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // 쿠키 삭제 (maxAge=0)
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false) // HTTPS 환경에서는 true
                .path("/")
                .maxAge(0)  // 바로 삭제됨
                .sameSite("Lax")
                .build();

        // 응답 헤더에 Set-Cookie 추가
        response.addHeader("Set-Cookie", cookie.toString());

        // 로그아웃 성공 메시지 반환
        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

}
