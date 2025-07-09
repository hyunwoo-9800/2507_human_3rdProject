package fs.human.yk2hyeong.notice.vo;

import lombok.Data;
import java.sql.Date;

// 공지사항 데이터 저장 객체 VO
@Data
public class NoticeVO {

    // 기본 공지사항 정보
    private String noticeId;
    private String noticeTitle;
    private String noticeContent;
    private String writerId;

    // 생성/수정 정보
    private String createdId;
    private Date createdDate;
    private String updatedId;
    private Date updatedDate;

}
