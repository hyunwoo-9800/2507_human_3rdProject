package fs.human.yk2hyeong.index.controller;

import fs.human.yk2hyeong.index.service.IndexService;
import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 메인 화면 컨트롤러
@RestController
@RequiredArgsConstructor
public class IndexController {

    private final IndexService indexService;

    // 메인화면 공지사항 표출용
    @GetMapping("/api/main/notice")
    public List<NoticeVO> getRecentNotice() throws Exception {

        return indexService.getRecentNotice(2);

    }

}
