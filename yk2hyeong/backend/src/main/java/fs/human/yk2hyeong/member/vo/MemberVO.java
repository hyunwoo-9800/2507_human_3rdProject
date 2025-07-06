package fs.human.yk2hyeong.member.vo;

import lombok.Data;

import java.sql.Date;

/**
 * 회원 정보 VO (Value Object)
 * DB 테이블: TB_MEMBER
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Data
public class MemberVO {

    // 기본 회원 정보
    private String memberId;        // 회원 ID (UUID)
    private String memberEmail;     // 이메일 (로그인 ID)
    private String memberPwd;       // 비밀번호 (암호화 저장)
    private String memberName;      // 이름
    private String memberTel;       // 전화번호
    private String memberAddr;      // 주소

    // 판매자 추가 정보
    private String memberBname;         // 사업자명
    private String memberBnum;          // 사업자 등록번호
    private String memberShipperName;   // 출하자 명
    private String memberBankname;      // 은행명
    private String memberAccnum;        // 계좌번호

    // 권한 및 상태
    private String memberRole;          // 회원 역할 (SELLER / BUYER 등)
    private String memberStatus;        // 회원 상태 (정상 / 탈퇴 등)

    // 생성 및 수정 정보
    private String createdBy;
    private Date createdAt;
    private String updatedBy;
    private Date updatedAt;

}
