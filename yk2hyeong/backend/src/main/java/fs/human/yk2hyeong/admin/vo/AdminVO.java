package fs.human.yk2hyeong.admin.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

// 관리자 VO
@Data
@Getter
@Setter
public class AdminVO {


    //유저관리/회원등록승인
    private String memberId;
    private String memberEmail;
    private String memberPwd;
    private String memberName;
    private String memberBname;
    private String memberBnum;
    private String memberShipperName;
    private String memberTel;
    private String memberAddr;
    private String memberDetailAddr;
    private String memberBankCode;
    private String memberAccountNum;
    private String memberRole;
    private String memberStatus;
    private String createdId;
    private Date createdDate;

    private String reportId;         // 신고 고유 ID
    private String reporterId;       // 신고자 ID
    private String reporterName;     // 신고자 이름
    private String productId;        // 신고 대상 상품 ID
    private String productName;      // 상품명
    private String reasonCode;       // 신고 사유 코드
    private String reasonName;       // 신고 사유 상태명
    private String reportContent;    // 신고 상세 내용
    private String updatedId;        // 수정자 ID
    private Date updatedDate;        // 수정일시

    private String memberRoleName;    // 역할 한글명
    private String memberStatusName;  // 상태 한글명
}
