package fs.human.yk2hyeong.notice.service;

import fs.human.yk2hyeong.notice.vo.NoticeVO;

import java.util.List;

/*
    공지사항 서비스 인터페이스
    실제 구현체는 NoticeServiceImpl
    컨트롤러와 DAO 사이에서 역할을 나누기 위한 인터페이스
 */
public interface NoticeService {

    // 전체 공지사항 목록 조회
    List<NoticeVO> getAllNotices() throws Exception;

    // 공지사항 단건 조회
    NoticeVO getNoticeById(String noticeId) throws Exception;

    // 공지사항 등록
    void insertNotice(NoticeVO vo) throws Exception;

    // 공지사항 수정
    void updateNotice(NoticeVO vo) throws Exception;

    // 공지사항 삭제
    void deleteNotice(String noticeId) throws Exception;

}


