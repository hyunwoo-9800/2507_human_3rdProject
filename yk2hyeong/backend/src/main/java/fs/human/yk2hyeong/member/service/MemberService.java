package fs.human.yk2hyeong.member.service;

import fs.human.yk2hyeong.member.vo.MemberVO;

/**
 * 회원 관련 서비스 인터페이스
 * - 이메일 중복 확인
 * - 회원 가입 처리
 *
 * @author 조현우
 * @since 2025-07-06
 */
public interface MemberService {

    /**
     * 이메일 중복 여부 확인
     *
     * @param email 중복 검사할 이메일
     * @return 중복 시 1 이상, 아니면 0
     */
    int isEmailExist(String email);

    /**
     * 회원가입 처리
     *
     * @param member 가입할 회원 정보
     */
    void registerMember(MemberVO member);

}
