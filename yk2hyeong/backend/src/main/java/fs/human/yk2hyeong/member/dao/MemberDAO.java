package fs.human.yk2hyeong.member.dao;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

/**
 * 회원 관련 MyBatis 매퍼 인터페이스
 *
 * 이 인터페이스는 회원 관련 데이터베이스 작업을 처리하는 MyBatis 매퍼 인터페이스입니다.
 * - 이메일 중복 확인
 * - 회원 정보 저장
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Mapper
public interface MemberDAO {

    /**
     * 회원 정보 저장 메서드
     *
     * 이 메서드는 회원 가입 시, 회원 정보를 데이터베이스에 저장하는 역할을 합니다.
     *
     * @param vo 회원 정보를 담고 있는 MemberVO 객체
     * @throws DataAccessException DB 접근 중 발생할 수 있는 예외 처리
     */
    void insertMember(MemberVO vo) throws DataAccessException;
    void insertGameMember(MemberVO vo) throws DataAccessException;

    /**
     * 이메일 중복 확인 메서드
     *
     * 이 메서드는 회원가입 시, 사용자가 입력한 이메일이 이미 데이터베이스에 존재하는지 확인합니다.
     * 이메일이 존재하면 1 이상을 반환하고, 존재하지 않으면 0을 반환합니다.
     *
     * SQL 쿼리는 MyBatis 매퍼 XML에서 정의되어 있습니다.
     *
     * @param memberEmail 확인하려는 이메일 주소
     * @return 이메일 존재 여부 (1: 존재, 0: 없음)
     * @throws DataAccessException DB 접근 중 발생할 수 있는 예외 처리
     */
    int isEmailExist(String memberEmail) throws DataAccessException;

    String findEmail(String memberName, String memberTel) throws DataAccessException;

    void updatePassword(@Param("email") String email, @Param("newPassword") String newPassword) throws DataAccessException;

    /* 회원정보 수정 */
    void updateMemberInfo(MemberVO member) throws DataAccessException;
    MemberVO selectByEmail(String email) throws DataAccessException;

    // 회원 탈퇴
    void deleteMemberById(String memberId) throws DataAccessException;

    // 게임 회원 정보 조회
    MemberVO selectByGameMem(String memberId) throws DataAccessException;


}
