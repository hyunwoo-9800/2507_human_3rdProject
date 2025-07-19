package fs.human.yk2hyeong.common.config.util;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;

import java.util.Date;

/**
 * JwtUtil 클래스는 JSON Web Token (JWT)을 생성, 파싱 및 검증하는 유틸리티 클래스입니다.
 * 이 클래스는 JWT를 사용하여 사용자 인증 정보를 안전하게 처리하는 기능을 제공합니다.
 * <p>
 * - JWT 생성: 이메일을 기반으로 JWT를 생성합니다.
 * - JWT 검증: 제공된 JWT의 유효성을 확인합니다.
 * - JWT에서 이메일 추출: JWT에서 사용자 이메일을 추출합니다.
 * </p>
 *
 * * @author 조현우
 * * @since 2025-07-11
 *
 */
@Component
public class JwtUtil {

    // 비밀 키 (실제 운영 환경에서는 환경 변수 등을 통해 보안을 강화해야 함)
    private final String SECRET_KEY = KeyGenerator.generateSecretKey();

    /**
     * 주어진 JWT에서 이메일을 추출하는 메서드
     *
     * @param token JWT 토큰
     * @return JWT에서 추출한 이메일
     * @throws JwtException JWT 파싱 오류가 발생한 경우
     */
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())  // 비밀 키 설정
                .parseClaimsJws(token)  // JWT 파싱
                .getBody()  // JWT 본문 (Claims)
                .getSubject();  // 이메일 추출 (Subject)
    }

    /**
     * 주어진 JWT가 유효한지 검증하는 메서드
     *
     * @param token JWT 토큰
     * @return JWT가 유효하면 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            // JWT 파싱을 시도하여 유효성을 검증
            Jwts.parser()
                    .setSigningKey(SECRET_KEY.getBytes())
                    .parseClaimsJws(token);
            return true;  // 검증 성공
        } catch (Exception e) {
            return false;  // 검증 실패
        }
    }

    /**
     * 이메일을 기반으로 JWT를 생성하는 메서드
     *
     * @param email 사용자의 이메일
     * @return 생성된 JWT 토큰
     */
    public String createToken(String email) {
        Date now = new Date();  // 현재 시간
        Date expiry = new Date(now.getTime() + 1000 * 60 * 60 * 24);  // 24시간 후 만료 시간

        // JWT 생성
        return Jwts.builder()
                .setSubject(email)  // 이메일을 Subject로 설정
                .setIssuedAt(now)  // 발급 시간 설정
                .setExpiration(expiry)  // 만료 시간 설정
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())  // HS256 알고리즘으로 서명
                .compact();  // JWT 토큰 반환
    }
}
