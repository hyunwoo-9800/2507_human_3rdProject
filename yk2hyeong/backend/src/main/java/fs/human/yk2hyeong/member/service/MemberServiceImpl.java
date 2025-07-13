package fs.human.yk2hyeong.member.service;

import fs.human.yk2hyeong.member.dao.MemberDAO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 회원 서비스 구현 클래스
 *
 * 이 클래스는 회원 서비스 인터페이스(`MemberService`)를 구현한 클래스입니다.
 * - 이메일 중복 확인 및 회원가입 처리
 * - 비밀번호를 암호화하여 회원가입 처리
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Service
public class MemberServiceImpl implements MemberService {

    // 회원 데이터베이스 작업을 위한 DAO 객체
    @Autowired
    MemberDAO memberDAO;

    /**
     * 회원 가입 처리 메서드
     *
     * 이 메서드는 회원 가입 요청을 받아, `MemberDAO`를 통해 회원 정보를 데이터베이스에 저장하는 역할을 합니다.
     * 비밀번호 암호화와 같은 추가적인 처리 로직은 서비스 계층에서 진행될 수 있습니다.
     *
     * @param vo 회원 정보를 담고 있는 `MemberVO` 객체
     * @throws Exception DB 처리 중 발생할 수 있는 예외 처리
     */
    @Override
    public void insertMember(MemberVO vo) throws Exception {

        // DAO를 통해 회원 정보를 DB에 삽입
        memberDAO.insertMember(vo);
    }

    @Override
    public boolean isEmailExist(String email) throws Exception {

        return memberDAO.isEmailExist(email) > 0;

    }
}
