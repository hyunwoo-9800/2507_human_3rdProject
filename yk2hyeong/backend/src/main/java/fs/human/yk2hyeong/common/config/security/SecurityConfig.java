package fs.human.yk2hyeong.common.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 비밀번호 암호화를 위한 설정 클래스.
 * BCrypt 방식으로 비밀번호를 안전하게 인코딩한다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Configuration
public class SecurityConfig {

    /**
     * 비밀번호 암호화에 사용할 PasswordEncoder Bean 등록
     * - BCrypt 알고리즘 사용
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }

}
