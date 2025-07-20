package fs.human.yk2hyeong.notice.vo;

import lombok.Data;
import java.sql.Date;

// 공지사항 데이터 저장 객체 VO
@Data
public class NoticeVO {

    // 기본 공지사항 정보
    private String noticeId;            // 공지 ID
    private String noticeTitle;         // 공지 제목
    private String noticeContent;       // 공지 내용
    private String writerId;            // 글쓴이

    private String bno;                 // 화면에 보여줄 번호

    // 생성, 수정 정보
    private String createdId;           // 작성자 ID
    private Date createdDate;           // 작성 일자
    private String updatedId;           // 수정자 ID
    private Date updatedDate;           // 수정 일자

}
