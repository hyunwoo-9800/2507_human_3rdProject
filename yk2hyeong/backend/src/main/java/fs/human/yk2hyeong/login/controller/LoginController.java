package fs.human.yk2hyeong.login.controller;

import fs.human.yk2hyeong.common.config.util.AESUtil;
import fs.human.yk2hyeong.common.config.util.JwtUtil;
import fs.human.yk2hyeong.login.service.LoginService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 로그인 컨트롤러
@RestController
@RequestMapping("/go")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {


    private final LoginService loginService;
    private final JwtUtil jwtUtil; // JwtUtil 주입

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest,
                                   HttpServletResponse response) throws Exception {

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // 사용자 조회
        MemberVO member = loginService.selectByEmail(email);
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "이메일 또는 비밀번호 오류"));
        }

        // 비밀번호 AES 암호화 후 비교
        String encryptedInputPwd = AESUtil.encrypt(password);
        if (!encryptedInputPwd.equals(member.getMemberPwd())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "이메일 또는 비밀번호 오류"));
        }

        // JWT 토큰 생성
        String token = jwtUtil.createToken(email);

        // HttpOnly 쿠키 설정
        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false) // HTTPS 환경에서는 true로 설정
                .path("/")
                .maxAge(60 * 60 * 24) // 1일
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        // 로그인 성공 응답
        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공",
                "memberId", member.getMemberId(),
                "memberName", member.getMemberName(),
                "memberRole", member.getMemberRole()
        ));
    }

}
