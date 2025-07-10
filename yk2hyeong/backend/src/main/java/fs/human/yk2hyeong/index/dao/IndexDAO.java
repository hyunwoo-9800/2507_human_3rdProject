package fs.human.yk2hyeong.index.dao;

import fs.human.yk2hyeong.notice.vo.NoticeVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

// 메인화면 매퍼
@Mapper
public interface IndexDAO {
    List<NoticeVO> getRecentNotice(int count);
}
