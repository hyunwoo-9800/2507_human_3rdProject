package fs.human.yk2hyeong.member.dao;

import fs.human.yk2hyeong.member.vo.MemberVO;
import org.apache.ibatis.annotations.Mapper;

/**
 * 회원 관련 MyBatis 매퍼 인터페이스
 * - 이메일 중복 확인
 * - 회원 정보 저장
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Mapper
public interface MemberDAO {

    /**
     * 이메일 중복 확인
     *
     * @param email 입력한 이메일
     * @return 중복 시 1 이상, 아니면 0
     */
    int isEmailExist(String email);

    /**
     * 회원 정보 저장
     *
     * @param member 저장할 회원 정보
     */
    void insertMember(MemberVO member);

}