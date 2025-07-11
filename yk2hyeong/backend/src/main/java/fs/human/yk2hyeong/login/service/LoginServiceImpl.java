package fs.human.yk2hyeong.login.service;

import fs.human.yk2hyeong.login.dao.LoginDAO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 로그인 서비스 구현 클래스
 *
 * 이 클래스는 로그인 기능을 구현하며, 이메일을 사용하여 사용자를 조회하고
 * 비밀번호를 검증하는 역할을 합니다.
 * 주로 이메일을 기반으로 사용자 정보를 조회하고, 비밀번호 검증은 컨트롤러에서 처리합니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    // 로그인 관련 DB 작업을 수행하는 DAO
    private final LoginDAO loginDAO;

    // 비밀번호를 암호화/검증하는 PasswordEncoder
    private final PasswordEncoder passwordEncoder;

    /**
     * 이메일로 회원 정보를 조회하는 메서드
     *
     * @param memberEmail 사용자가 입력한 이메일
     * @return 해당 이메일을 가진 회원 정보 (없으면 null 반환)
     * @throws Exception DB 조회 중 발생할 수 있는 예외 처리
     */
    @Override
    public MemberVO selectByEmail(String memberEmail) throws Exception {

        // 이메일로 사용자 정보를 조회
        MemberVO member = loginDAO.selectByEmail(memberEmail);

        // 이메일에 해당하는 사용자가 없으면 null 반환
        if (member == null) {
            return null; // 이메일에 해당하는 사용자 없음
        }

        // 사용자 정보 반환 (비밀번호는 Controller에서 검증)
        return member;
    }

}
