package fs.human.yk2hyeong.mypage.controller;

import fs.human.yk2hyeong.mypage.service.MypageService;
import fs.human.yk2hyeong.mypage.vo.MypageVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mypage")
public class MypageController {

    @Autowired
    private MypageService mypageService;

    @GetMapping("/purchased")
    public List<MypageVO> getPurchasedProducts(@RequestParam("memberId") String memberId) {
        return mypageService.getPurchasedProducts(memberId);
    }
}
