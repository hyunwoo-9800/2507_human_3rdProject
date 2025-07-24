package fs.human.yk2hyeong.notice.service;

import fs.human.yk2hyeong.index.vo.IndexVO;
import fs.human.yk2hyeong.notice.dao.NoticeDAO;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 공지사항 서비스 구현체
 DAO를 호출해서 실제 DB 작업을 수행합니다.
 */

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    // 의존성 주입: 공지사항 DAO
    private final NoticeDAO noticeDAO;

    // 전체 공지사항 목록 조회
    @Override
    public List<NoticeVO> getAllNotices() {

        return noticeDAO.getAllNotices();

    }

    // 공지사항 단건 조회
    @Override
    public NoticeVO getNoticeById(String noticeId) {

        return noticeDAO.getNoticeById(noticeId);

    }

    // 공지사항 등록
    @Override
    public void insertNotice(NoticeVO vo) {

        noticeDAO.insertNotice(vo);

    }

    // 공지사항 수정
    @Override
    public void updateNotice(NoticeVO vo) {

        noticeDAO.updateNotice(vo);

    }

    // 공지사항 삭제
    @Override
    public void deleteNotice(String noticeId) {

        noticeDAO.deleteNotice(noticeId);

    }
    //footer 공지사항
    @Override
    public NoticeVO getLatestNotice() {
        List<NoticeVO> noticeList = noticeDAO.selectLatestNotice(); // List로 받아오더라도
        return noticeList.isEmpty() ? null : noticeList.get(0);
    }
}



