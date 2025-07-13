package fs.human.yk2hyeong.member.dao;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;
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

    int isEmailExist(String memberEmail) throws DataAccessException;

}
