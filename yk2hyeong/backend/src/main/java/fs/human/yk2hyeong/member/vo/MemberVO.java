package fs.human.yk2hyeong.member.vo;

import lombok.Data;
import java.sql.Date;

/**
 * 회원 정보 VO (Value Object)
 *
 * 이 클래스는 회원 정보를 담는 VO(Value Object) 클래스입니다.
 * 해당 클래스는 데이터베이스 테이블 `TB_MEMBER`와 매핑됩니다.
 * 회원의 기본 정보, 권한, 상태, 생성/수정 정보 등을 포함합니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Data
public class MemberVO {

    // 기본 회원 정보
    private String memberId;                // 회원 ID (UUID)
    private String memberEmail;             // 이메일 (로그인 ID)
    private String memberPwd;               // 비밀번호 (암호화 저장)
    private String memberName;              // 이름
    private String memberBname;             // 사업자명
    private String memberBnum;              // 사업자 등록번호
    private String memberShipperName;       // 출하자 명
    private String memberTel;               // 전화번호
    private String memberAddr;              // 주소
    private String memberDetailAddr;        // 상세 주소
    private String memberBankCode;          // 은행명
    private String memberAccountNum;        // 계좌번호

    // 권한 및 상태
    private String memberRole;              // 회원 역할 (SELLER / BUYER 등)
    private String memberStatus;            // 회원 상태 (정상 / 탈퇴 등)

    // 생성 및 수정 정보
    private String createdId;               // 생성자 ID
    private Date createdDate;               // 생성 일자
    private String updatedId;               // 수정자 ID
    private Date updatedDate;               // 수정 일자

}
