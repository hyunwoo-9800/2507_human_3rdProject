package fs.human.yk2hyeong.admin.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

// 관리자 VO
@Data
public class AdminVO {

    // 유저관리, 회원등록승인
    private String memberId;                // 회원 고유 ID (UUID)
    private String memberEmail;             // 회원 이메일 (로그인 ID로 사용)
    private String memberPwd;               // 회원 비밀번호 (암호화 저장)
    private String memberName;              // 회원 이름
    private String memberBname;             // 사업자명 (또는 상호명)
    private String memberBnum;              // 사업자등록번호
    private String memberShipperName;       // 출하자명(미사용이므로 추후 테이블에서 삭제 예정)
    private String memberTel;               // 회원 연락처
    private String memberAddr;              // 회원 주소
    private String memberDetailAddr;        // 회원 상세 주소
    private String memberBankCode;          // 은행 코드
    private String memberAccountNum;        // 계좌번호
    private String memberRole;              // 회원 권한
    private String memberStatus;            // 회원 상태
    private String createdId;               // 등록자 ID
    private Date createdDate;               // 등록일시 (기본값 SYSDATE)
    private String memberBankCodeName;      // 수정자 ID
    private List<String> memberFileUrls;    // 수정일시 (기본값 SYSDATE)

    private String reportId;                // 신고 고유 ID
    private String reporterId;              // 신고자 ID
    private String reporterName;            // 신고자 이름
    private String productId;               // 신고 대상 상품 ID
    private String productName;             // 상품명
    private String reasonCode;              // 신고 사유 코드
    private String reasonName;              // 신고 사유 상태명
    private String reportContent;           // 신고 상세 내용
    private String updatedId;               // 수정자 ID
    private Date updatedDate;               // 수정일시

    private String memberRoleName;          // 역할 한글명
    private String memberStatusName;        // 상태 한글명

    // 회원가입승인 tb_alarm
    private String alarmId;                 // 알림 고유 ID
    private String alarmType;               // 알림 타입
    private String alarmContent;            // 알림 내용
    private String receiverId;              // 관리자 ID: 고정

    private List<String> productIdList;    //상품등록승인 복수 처리

}
