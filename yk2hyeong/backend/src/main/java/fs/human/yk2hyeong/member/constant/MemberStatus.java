package fs.human.yk2hyeong.member.constant;

/**
 * 회원 상태 상수 클래스
 * - 회원의 상태를 의미하는 고정 문자열들을 모아둔 클래스입니다.
 * - Enum 대신 문자열 상수를 사용할 때 활용합니다.
 *
 *
 * @author 조현우
 * @since 2025-07-06
 */
public class MemberStatus {

    /** 정상 회원 (활동 가능) */
    public static final String NORMAL = "정상";

    /** 미승인 회원 (관리자 승인 전) */
    public static final String PENDING = "미승인";

    /** 정지된 회원 (이용 제한) */
    public static final String BLOCKED = "정지";

    /** 탈퇴 회원 (사용자 요청으로 탈퇴 처리됨) */
    public static final String DELETE = "탈퇴";

    /** 장기 미접속으로 휴면 전환된 회원 */
    public static final String SLEEP = "휴먼";

}
