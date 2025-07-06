package fs.human.yk2hyeong.login.service;

import fs.human.yk2hyeong.member.vo.MemberVO;

/**
 * 로그인 처리용 서비스 인터페이스
 * - 이메일과 비밀번호로 회원 검증
 *
 * @author 조현우
 * @since 2025-07-06
 */
public interface LoginService {

    /**
     * 이메일과 비밀번호로 로그인 시도
     *
     * @param memberEmail 입력한 이메일
     * @param memberPwd   입력한 비밀번호
     * @return 로그인 성공 시 회원 정보, 실패 시 null
     */
    MemberVO login(String memberEmail, String memberPwd);

}
