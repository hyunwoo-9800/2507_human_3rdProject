package fs.human.yk2hyeong.index.controller;

import fs.human.yk2hyeong.index.service.IndexService;
import fs.human.yk2hyeong.index.vo.IndexVO;
import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 메인 화면 컨트롤러
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main")
public class IndexController {

    private final IndexService indexService;

    // 메인화면 공지사항 표출용
    @GetMapping("/notice")
    public List<NoticeVO> getRecentNotice() throws Exception {

        return indexService.getRecentNotice(2);

    }

    // 메인화면 공지사항 표출용
    @GetMapping("/bestSell")
    public List<IndexVO> bestSell() throws Exception {

        return indexService.bestSell();

    }

}
