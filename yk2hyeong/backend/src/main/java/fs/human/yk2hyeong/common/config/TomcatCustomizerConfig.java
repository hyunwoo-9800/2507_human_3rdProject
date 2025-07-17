package fs.human.yk2hyeong.common.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatCustomizerConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
        return factory -> factory.addConnectorCustomizers((Connector connector) -> {
            connector.setMaxParameterCount(10000);
            connector.setProperty("maxSwallowSize", "-1");
            connector.setProperty("fileCountMax", "200"); // 파일 개수 제한
        });
    }
}
