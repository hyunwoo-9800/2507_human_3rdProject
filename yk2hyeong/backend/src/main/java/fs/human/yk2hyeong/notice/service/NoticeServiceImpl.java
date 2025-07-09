package fs.human.yk2hyeong.notice.service;

import fs.human.yk2hyeong.notice.dao.NoticeDAO;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// 회원관련 서비스 구현

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeDAO noticeDAO;

    @Override
    public List<NoticeVO> getAllNotices() {
        return noticeDAO.getAllNotices();
    }

    @Override
    public NoticeVO getNoticeById(String noticeId) {
        return noticeDAO.getNoticeById(noticeId);
    }

    @Override
    public void insertNotice(NoticeVO vo) {
        noticeDAO.insertNotice(vo);
    }

    @Override
    public void updateNotice(NoticeVO vo) {
        noticeDAO.updateNotice(vo);
    }

    @Override
    public void deleteNotice(String noticeId) {
        noticeDAO.deleteNotice(noticeId);
    }
}



