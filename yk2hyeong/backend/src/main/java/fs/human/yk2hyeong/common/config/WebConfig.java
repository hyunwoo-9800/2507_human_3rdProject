package fs.human.yk2hyeong.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
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

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 정적 리소스(images) 서빙
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
    }

    // React 라우터를 위한 포워딩 설정(이미지를 로딩이 되지 않아 주석처리)
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("/{spring:\\w+}")
//                .setViewName("forward:/");
//        registry.addViewController("/**/{spring:\\w+}")
//                .setViewName("forward:/");
//        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
//                .setViewName("forward:/");
    }
    
} // class 끝
