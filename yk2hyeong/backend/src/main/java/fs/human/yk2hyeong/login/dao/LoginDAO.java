package fs.human.yk2hyeong.login.dao;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

/**
 * 로그인 관련 DB 처리 매퍼 인터페이스
 *
 * 이 인터페이스는 로그인과 관련된 DB 작업을 처리합니다.
 * 주로 이메일을 기반으로 회원 정보를 조회하는 역할을 수행합니다.
 * MyBatis와 연동하여 SQL 쿼리 수행을 담당합니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Mapper
public interface LoginDAO {

    /**
     * 이메일로 회원 정보를 조회하는 메서드
     *
     * @param memberEmail 사용자가 입력한 이메일
     * @return 해당 이메일을 가진 회원 정보 (없으면 null 반환)
     * @throws DataAccessException DB 접근 중 발생할 수 있는 예외 처리
     */
    MemberVO selectByEmail(String memberEmail) throws DataAccessException;
}
