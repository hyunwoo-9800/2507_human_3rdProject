package fs.human.yk2hyeong.index.service;

import fs.human.yk2hyeong.index.vo.IndexVO;
import fs.human.yk2hyeong.notice.vo.NoticeVO;

import java.util.List;

// 메인화면 서비스 인터페이스
public interface IndexService {

    // 메인화면 공지사항 표출용
    List<NoticeVO> getRecentNotice(int count) throws Exception;

    // 메인화면 일일 최다판매품목
    List<IndexVO> bestSell() throws Exception;

}
