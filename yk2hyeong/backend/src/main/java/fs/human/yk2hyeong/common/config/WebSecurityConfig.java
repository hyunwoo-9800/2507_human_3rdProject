package fs.human.yk2hyeong.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 웹 보안 설정 클래스.
 * - CSRF, 기본 로그인/인증 기능 비활성화
 * - 정해진 경로는 인증 없이 접근 허용
 * - 그 외 경로는 인증 필요
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Configuration
public class WebSecurityConfig {

    /**
     * 보안 필터 체인 설정
     *
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())                         // CSRF 보호 비활성화
                .formLogin(form -> form.disable())              // 스프링 기본 로그인 폼 비활성화
                .httpBasic(basic -> basic.disable())            // HTTP Basic 인증 비활성화
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/",            // 홈
                                "/index.html",          // 루트 HTML
                                "/static/**",           // 정적 리소스
                                "/images/**",           // 이미지
                                "/favicon.ico",         // 파비콘
                                "/api/member/**",       // 회원가입 관련 API
                                "/api/login",           // 로그인 API
                                "/member/**",           // 회원 관련 페이지
                                "/member/join/**",      // 회원가입 폼
                                "/product/**"           // 상품 관련 페이지

                        ).permitAll() // 위 경로는 인증 없이 접근 허용

                        .anyRequest().authenticated() // 나머지는 인증 필요
                );

        return http.build();

    }

}