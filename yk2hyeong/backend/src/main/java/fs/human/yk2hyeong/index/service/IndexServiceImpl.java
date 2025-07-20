package fs.human.yk2hyeong.index.service;

import fs.human.yk2hyeong.index.dao.IndexDAO;
import fs.human.yk2hyeong.notice.service.NoticeService;
import fs.human.yk2hyeong.notice.vo.NoticeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

// 메인화면 서비스 구현
@Service
@RequiredArgsConstructor
public class IndexServiceImpl implements IndexService {

    private final IndexDAO indexDAO;

    @Override
    public List<NoticeVO> getRecentNotice(int count) throws Exception {

        return indexDAO.getRecentNotice(count);

    }

}
