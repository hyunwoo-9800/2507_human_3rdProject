package fs.human.yk2hyeong.common.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * ReactController
 *
 * React의 SPA(Single Page Application) 라우팅을 위해 필요한 컨트롤러입니다.
 * Spring Boot는 기본적으로 정적 파일이 존재하지 않으면 404를 반환하지만,
 * React 라우터는 클라이언트 측에서 경로를 처리하므로, 모든 경로를 index.html로 포워딩해야 합니다.
 *
 * 이 컨트롤러는 다음과 같은 경로 요청을 index.html로 포워딩합니다:
 * - "/" (루트 경로)
 * - "/something"
 * - "/some/path"
 *
 * 이를 통해 새로고침 시에도 React 라우터가 정상 작동하도록 보장합니다.
 *
 * @author 조현우
 * @since 2025-07-04
 */

@Controller
public class ReactController {

    @RequestMapping(value = { "/", "/{x:[\\w\\-]+}", "/**/{x:[\\w\\-]+}" })
    public String index() {
        return "forward:/index.html";
    }

}
