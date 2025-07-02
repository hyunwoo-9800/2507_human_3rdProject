package com.yh.backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 *
 * Spring MVC의 Web 설정을 담당하는 클래스입니다.
 * CORS 설정을 통해 프론트엔드(React)에서 오는 요청을 허용합니다.
 *
 * @author 조현우
 * @version 1.0
 * @since 2025-07-02
 *
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        registry.addMapping("/**")                  // 모든 요청 경로에 대해
                .allowedOrigins("http://localhost:3000")      // 프론트 엔드 개발 서버 주소 허용
                .allowedMethods("*");                         // 모든 HTTP 메서드 허용
    }
    
} // class 끝
