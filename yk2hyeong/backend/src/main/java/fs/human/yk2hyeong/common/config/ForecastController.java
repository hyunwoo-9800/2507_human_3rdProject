package fs.human.yk2hyeong.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
public class ForecastController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @GetMapping("/api/forecast")
    public Mono<String> getForecastData() {
        // WebClient를 직접 빌드하고 get() 메소드 호출
        WebClient webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000/forecast").build();  // FastAPI 서버 주소
        return webClient.get()  // GET 요청을 보냄
                .retrieve()  // 요청 실행
                .bodyToMono(String.class);  // 응답을 String으로 받기
    }
}

