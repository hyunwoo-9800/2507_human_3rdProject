package fs.human.yk2hyeong.index.dao;

import fs.human.yk2hyeong.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

import java.util.List;

// 메인화면 매퍼
@Mapper
public interface IndexDAO {

    // 메인화면 공지사항 표출용
    List<NoticeVO> getRecentNotice(int count) throws DataAccessException;

}
