package fs.human.yk2hyeong.member.controller;

import fs.human.yk2hyeong.common.code.service.CodeService;
import fs.human.yk2hyeong.common.config.AESUtil;
import fs.human.yk2hyeong.member.service.MemberService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 회원 관련 API 컨트롤러
 *
 * 이 클래스는 회원가입 관련 API를 처리하는 컨트롤러입니다.
 * 주로 회원가입 요청을 처리하며, 비밀번호 암호화 및 기본 사용자 상태 설정을 포함합니다.
 *
 * @author 조현우
 * @since 2025-07-06
 */
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final CodeService codeService;

    /**
     * 회원가입 처리 메서드
     *
     * 이 메서드는 회원가입 요청을 받아, 입력된 회원 정보를 처리하고, 비밀번호를 암호화한 후
     * 회원 정보를 DB에 저장합니다. 또한, 기본 상태 및 역할을 설정하고, 오류 발생 시 적절한 응답을 반환합니다.
     *
     * @param member 회원가입을 위한 회원 정보 (이메일, 비밀번호 등)
     * @return 회원가입 성공 또는 오류 메시지
     * @throws Exception 예외 처리 - 비밀번호 암호화 또는 DB 처리 중 발생할 수 있는 예외
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signupMember(@RequestBody MemberVO member) throws Exception {

        // 기본 사용자 상태 조회 (미승인 상태)
        String memberStat = codeService.getRoleWithNoEntry();

        try {

            // 비밀번호 암호화
            String encryptedPwd = AESUtil.encrypt(member.getMemberPwd());
            member.setMemberPwd(encryptedPwd);

            // 기본 사용자 상태 설정
            member.setMemberStatus(memberStat);

            // 출하자(상호) 이름이 null일 경우 기본 값 설정
            if (member.getMemberShipperName() == null) {
                member.setMemberShipperName(" ");
            }

            // 회원 역할이 null일 경우 기본 상태로 설정
            if (member.getMemberRole() == null) {
                member.setMemberRole(memberStat);
            }

            // 기본 등록자 및 수정자 설정
            member.setCreatedId("SYSTEM");
            member.setUpdatedId("SYSTEM");

            // 회원 정보 DB에 삽입
            memberService.insertMember(member);

            // 회원가입 성공 메시지 반환
            return ResponseEntity.ok().body(Map.of(
                    "message", "회원가입 성공",
                    "email", member.getMemberEmail()
            ));

        } catch (Exception e) {

            // 예외 발생 시 오류 메시지 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "회원가입 중 오류 발생"));
        }

    }

}
