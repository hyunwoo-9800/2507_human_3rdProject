package fs.human.yk2hyeong.notice.dao;

import fs.human.yk2hyeong.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

import java.util.List;

// 공지사항 매퍼
@Mapper
public interface NoticeDAO {
    // 전체 공지사항 목록


    List<NoticeVO> getAllNotices() throws DataAccessException;

    NoticeVO getNoticeById(String noticeId) throws DataAccessException;

    void insertNotice(NoticeVO vo) throws DataAccessException;

    void updateNotice(NoticeVO vo) throws DataAccessException;

    void deleteNotice(String noticeId) throws DataAccessException;

}
