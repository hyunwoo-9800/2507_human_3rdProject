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

    /**
     * 이메일 중복 확인 메서드
     *
     * 이 메서드는 입력된 이메일이 이미 존재하는지 확인합니다.
     * 이메일이 이미 존재하면 `true`, 그렇지 않으면 `false`를 반환합니다.
     *
     * @param email 확인하려는 이메일 주소
     * @return 이메일 존재 여부 (true: 존재, false: 없음)
     * @throws Exception DB 처리 중 발생할 수 있는 예외 처리
     */
    @Override
    public boolean isEmailExist(String email) throws Exception {

        // DAO를 통해 이메일 존재 여부 확인
        return memberDAO.isEmailExist(email) > 0;  // 존재하면 1 이상, 존재하지 않으면 0 반환

    }

    @Override
    public String findEmail(String memberName, String memberTel) throws Exception {

        String email = memberDAO.findEmail(memberName, memberTel);

        if (email == null) {

            throw new Exception("해당 정보로 아이디를 찾을 수 없습니다.");

        }

        return email;

    }

    @Override
    public void updatePassword(String email, String newPassword) throws Exception {

        memberDAO.updatePassword(email, newPassword);

    }

    /* 회원정보 수정 구현 */
    @Override
    public void updateMemberInfo(MemberVO member) throws Exception {
        memberDAO.updateMemberInfo(member);
    }

    @Override
    public MemberVO selectByEmail(String email) throws Exception {
        return memberDAO.selectByEmail(email);
    }


}
