package fs.human.yk2hyeong.index.service;

import fs.human.yk2hyeong.notice.vo.NoticeVO;

import java.util.List;

// 메인화면 서비스 인터페이스
public interface IndexService {
    List<NoticeVO> getRecentNotice(int count);
}
