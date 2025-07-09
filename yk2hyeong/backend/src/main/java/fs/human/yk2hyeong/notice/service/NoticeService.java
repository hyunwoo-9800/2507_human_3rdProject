package fs.human.yk2hyeong.notice.service;

import fs.human.yk2hyeong.notice.vo.NoticeVO;

import java.util.List;

// 공지사항 서비스 인터페이스
public interface NoticeService {


    List<NoticeVO> getAllNotices() throws Exception;

    NoticeVO getNoticeById(String noticeId) throws Exception;

    void insertNotice(NoticeVO vo) throws Exception;

    void updateNotice(NoticeVO vo) throws Exception;

    void deleteNotice(String noticeId) throws Exception;
}


