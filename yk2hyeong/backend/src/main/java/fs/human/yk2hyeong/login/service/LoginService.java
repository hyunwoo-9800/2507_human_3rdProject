package fs.human.yk2hyeong.login.service;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.springframework.dao.DataAccessException;

/**
 * 로그인 처리용 서비스 인터페이스
 *
 * 이 인터페이스는 이메일과 비밀번호를 바탕으로 회원을 검증하는 서비스 계층에서 사용됩니다.
 * 이메일로 회원을 조회하는 메서드를 제공하며, 로그인 기능의 핵심 로직을 구현하는데 사용됩니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
public interface LoginService {

    /**
     * 이메일을 기반으로 회원 정보를 조회하는 메서드
     *
     * @param memberEmail 사용자가 입력한 이메일
     * @return 해당 이메일을 가진 회원 정보 (없으면 null 반환)
     * @throws Exception 예외 처리 - DB 조회 중 발생할 수 있는 예외
     */
    MemberVO selectByEmail(String memberEmail) throws Exception;

}
