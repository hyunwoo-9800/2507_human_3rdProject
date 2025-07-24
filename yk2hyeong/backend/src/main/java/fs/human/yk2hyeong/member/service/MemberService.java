package fs.human.yk2hyeong.member.service;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

/**
 * 회원 관련 서비스 인터페이스
 *
 * 이 인터페이스는 회원 가입 처리 및 이메일 중복 확인과 같은 회원 관련 비즈니스 로직을 정의합니다.
 * 회원 가입을 위한 메서드가 포함되어 있으며, 이 인터페이스를 구현한 클래스에서 실제 로직을 처리합니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
public interface MemberService {

    /**
     * 회원 가입 처리 메서드
     *
     * 이 메서드는 회원 가입 요청을 받아, 회원 정보를 처리하여 데이터베이스에 저장하는 역할을 합니다.
     * 회원 정보는 `MemberVO` 객체로 전달되며, 이 객체는 회원 가입에 필요한 모든 정보를 포함합니다.
     *
     * @param vo 회원 정보를 담고 있는 `MemberVO` 객체
     * @throws Exception DB 처리 중 발생할 수 있는 예외 처리
     */
    void insertMember(MemberVO vo) throws Exception;
    void insertGameMember(MemberVO vo) throws Exception;

    /**
     * 이메일 중복 확인 메서드
     *
     * 이 메서드는 입력된 이메일이 이미 데이터베이스에 존재하는지 확인하는 역할을 합니다.
     * 이메일이 이미 존재하면 중복된 이메일로 처리하고, 그렇지 않으면 새로운 이메일로 처리합니다.
     *
     * @param email 확인하려는 이메일 주소
     * @return 이메일 존재 여부 (true: 존재, false: 없음)
     * @throws Exception DB 처리 중 발생할 수 있는 예외 처리
     */
    boolean isEmailExist(String email) throws Exception;

    String findEmail(String memberName, String memberTel) throws Exception;

    void updatePassword(@Param("email") String email, @Param("newPassword") String newPassword) throws Exception;

    /* 회원정보 수정 */
    void updateMemberInfo(MemberVO member) throws Exception;
    MemberVO selectByEmail(String email) throws Exception;

    // 회원 탈퇴
    void deleteMemberById(String memberId) throws Exception;

    // 게임 회원 정보 조회
    MemberVO selectByGameMem(String memberId) throws Exception;

    // 마지막에 가입한 회원 ID를 이메일로 조회
    String getLastInsertedMemberId(String memberEmail) throws Exception;

}
