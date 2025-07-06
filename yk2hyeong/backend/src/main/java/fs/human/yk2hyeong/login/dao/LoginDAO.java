package fs.human.yk2hyeong.login.dao;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 로그인 관련 DB 처리 매퍼 인터페이스
 * - 이메일로 회원 정보 조회
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Mapper
public interface LoginDAO {

    /**
     * 이메일로 회원 조회
     *
     * @param memberEmail 사용자가 입력한 이메일
     * @return 해당 이메일을 가진 회원 정보 (없으면 null)
     */
    MemberVO selectByEmail(String memberEmail);
}
