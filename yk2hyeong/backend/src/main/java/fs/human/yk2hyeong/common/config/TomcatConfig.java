//package fs.human.yk2hyeong.common.config;
//
//import org.apache.tomcat.util.http.fileupload.FileUploadBase;
//import org.apache.tomcat.util.http.fileupload.impl.FileItemIteratorImpl;
//import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
//import org.springframework.boot.web.server.WebServerFactoryCustomizer;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class TomcatConfig {
//
//    @Bean
//    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
//        return (factory) -> factory.addContextCustomizers(context -> {
//            context.setAttribute("maxFileCount", 50);  // 최대 part 개수 제한 설정
//        });
//    }
//}
