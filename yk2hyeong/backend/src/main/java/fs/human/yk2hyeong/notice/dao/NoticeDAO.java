package fs.human.yk2hyeong.notice.dao;

import fs.human.yk2hyeong.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

import java.util.List;

// 공지사항 매퍼 인터페이스: 공지사항 관련 데이터베이스 접근 기능 정의
@Mapper
public interface NoticeDAO {

    // 전체 공지사항 목록 조회
    List<NoticeVO> getAllNotices() throws DataAccessException;

    // 공지사항 단건 조회
    NoticeVO getNoticeById(String noticeId) throws DataAccessException;

    // 공지사항 등록
    void insertNotice(NoticeVO vo) throws DataAccessException;

    // 공지사항 수정
    void updateNotice(NoticeVO vo) throws DataAccessException;

    // 공지사항 삭제
    void deleteNotice(String noticeId) throws DataAccessException;

}
