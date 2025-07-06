package fs.human.yk2hyeong.member.service;

import fs.human.yk2hyeong.member.dao.MemberDAO;
import fs.human.yk2hyeong.member.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import static fs.human.yk2hyeong.member.constant.MemberStatus.*;

/**
 * 회원 서비스 구현 클래스
 * - 이메일 중복 확인
 * - 비밀번호 암호화 후 회원가입 처리
 *
 * @author 조현우
 * @since 2025-07-06
 */
@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberDAO memberDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 이메일 중복 여부 확인 (아직 미사용)
     */
    @Override
    public int isEmailExist(String email) {
        return 0; // TODO: 필요 시 구현
    }

    /**
     * 회원가입 처리
     * 1. 이메일 중복 검사
     * 2. 비밀번호 암호화
     * 3. DB에 회원 정보 저장
     *
     * @param member 가입할 회원 정보
     */
    @Override
    public void registerMember(MemberVO member) {

        if (memberDAO.isEmailExist(member.getMemberEmail()) > 0) {

            throw new RuntimeException("이미 사용 중인 이메일입니다.");

        }

        // 1. 비밀번호 암호화
        member.setMemberPwd(passwordEncoder.encode(member.getMemberPwd()));

        // 2. 회원 생성자, 수정자, 상태 저장
        member.setCreatedBy("ADMIN");
        member.setUpdatedBy("ADMIN");
        member.setMemberStatus(PENDING);

        // 3. 회원 정보 저장
        memberDAO.insertMember(member);

    }

}
