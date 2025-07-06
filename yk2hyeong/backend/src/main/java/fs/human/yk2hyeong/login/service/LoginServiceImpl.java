package fs.human.yk2hyeong.login.service;

import fs.human.yk2hyeong.login.dao.LoginDAO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import static fs.human.yk2hyeong.member.constant.MemberStatus.*;

/**
 * 로그인 서비스 구현 클래스
 * - 이메일로 사용자 조회
 * - 비밀번호 검증
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Service
@RequiredArgsConstructor
public class LoginServiceImpl implements LoginService {

    private final LoginDAO loginDAO;
    private final PasswordEncoder passwordEncoder;

    /**
     * 이메일과 비밀번호로 로그인 시도
     * 1. 이메일로 사용자 정보 조회
     * 2. 비밀번호가 일치하면 사용자 정보 반환, 아니면 null
     *
     * @param memberEmail 사용자 이메일
     * @param memberPwd   입력한 비밀번호
     * @return 로그인 성공 시 회원 정보, 실패 시 null
     */
    @Override
    public MemberVO login(String memberEmail, String memberPwd) {

        MemberVO dbMember = loginDAO.selectByEmail(memberEmail);

        if (dbMember == null) return null;

        if (!passwordEncoder.matches(memberPwd, dbMember.getMemberPwd())) {

            return null;

        }

        if (!NORMAL.equals(dbMember.getMemberStatus())) {

            throw new RuntimeException("현재 상태: " + dbMember.getMemberStatus());

        }

        return dbMember;

    }

}
