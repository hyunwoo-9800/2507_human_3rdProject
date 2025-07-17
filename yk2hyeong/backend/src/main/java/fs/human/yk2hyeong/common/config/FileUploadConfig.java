//package fs.human.yk2hyeong.common.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.multipart.commons.CommonsMultipartResolver;
//
//@Configuration
//public class FileUploadConfig {
//    @Bean(name = "multipartResolver")
//    public CommonsMultipartResolver multipartResolver() {
//        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
//        resolver.setMaxUploadSizePerFile(10 * 1024 * 1024); // 10MB
//        resolver.setMaxUploadSize(50 * 1024 * 1024);        // 50MB
//        resolver.setMaxInMemorySize(10240);                  // 메모리 임시 저장 용량
//        resolver.setDefaultEncoding("UTF-8");
//        resolver.setFileCountMax(-1);  // 파일 개수 제한 해제
//        return resolver;
//    }
//}
//