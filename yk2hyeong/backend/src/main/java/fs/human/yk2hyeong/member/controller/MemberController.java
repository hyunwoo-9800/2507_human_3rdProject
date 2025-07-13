package fs.human.yk2hyeong.member.controller;

import fs.human.yk2hyeong.common.code.service.CodeService;
import fs.human.yk2hyeong.common.config.AESUtil;
import fs.human.yk2hyeong.images.service.ImageService;
import fs.human.yk2hyeong.member.service.MailService;
import fs.human.yk2hyeong.member.service.MemberService;
import fs.human.yk2hyeong.member.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    private final ImageService imageService;
    private final MailService mailService;

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
    @PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> signupMember(
            @RequestPart("member") MemberVO member, // 회원 정보
            @RequestPart(value = "businessCertImage", required = false) MultipartFile businessCertImage, // 사업자 등록증 이미지
            @RequestPart(value = "bankBookImage", required = false) MultipartFile bankBookImage // 통장 사본 이미지
    ) throws Exception {

        // 기본 사용자 상태 조회 (미승인 상태)
        String memberStat = codeService.getRoleWithNoEntry();

        try {

            // 비밀번호 암호화
            String encryptedPwd = AESUtil.encrypt(member.getMemberPwd());
            member.setMemberPwd(encryptedPwd); // 암호화된 비밀번호로 설정

            // 기본 사용자 상태 설정 (예: 미승인)
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

            // 이미지 저장 (사업자 등록증)
            if (businessCertImage != null && !businessCertImage.isEmpty()) {
                String imageId = imageService.insertImage(businessCertImage, member.getMemberId());
                imageService.updateImageMemberId(imageId, member.getMemberId());
            }

            // 이미지 저장 (통장 사본)
            if (bankBookImage != null && !bankBookImage.isEmpty()) {
                String imageId = imageService.insertImage(bankBookImage, member.getMemberId());
                imageService.updateImageMemberId(imageId, member.getMemberId());
            }

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

    /**
     * 이메일 중복 확인 API
     *
     * 이 메서드는 이메일 중복 여부를 확인하는 API입니다.
     * 사용자가 입력한 이메일이 이미 존재하는지 확인하고, 그 결과를 반환합니다.
     *
     * @param email 사용자가 입력한 이메일
     * @return 이메일 중복 여부 (exists: true/false)
     * @throws Exception 이메일 중복 확인 중 발생할 수 있는 예외
     */
    @GetMapping("/checkEmail")
    public ResponseEntity<Map<String, Boolean>> checkEmailDuplication(@RequestParam("email") String email) throws Exception {

        // 이메일 중복 확인
        boolean exists = memberService.isEmailExist(email);

        // 중복 여부 반환
        return ResponseEntity.ok(Map.of("exists", exists));

    }

    /**
     * 인증번호 발송 API
     *
     * 이메일로 인증번호를 발송하는 API입니다. 사용자가 입력한 이메일로 인증번호를 발송합니다.
     *
     * @param email 인증번호를 발송할 이메일
     * @return 성공 시 200 OK 응답
     */
    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestParam String email) {
        mailService.sendCode(email); // 인증번호 발송
        return ResponseEntity.ok().build();
    }

    /**
     * 인증번호 확인 API
     *
     * 사용자가 입력한 인증번호가 맞는지 확인하는 API입니다.
     * 이메일과 인증번호를 비교하여 일치하면 인증 성공, 아니면 인증 실패를 반환합니다.
     *
     * @param email 이메일 주소
     * @param code 사용자가 입력한 인증번호
     * @return 인증 성공/실패 응답
     */
    @GetMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean result = mailService.verifyCode(email, code); // 인증번호 검증
        if (result) return ResponseEntity.ok().build(); // 인증 성공
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패"); // 인증 실패
    }

}
