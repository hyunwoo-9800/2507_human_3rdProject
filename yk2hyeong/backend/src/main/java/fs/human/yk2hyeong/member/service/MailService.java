package fs.human.yk2hyeong.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 메일 인증 인터페이스
 *
 * @author 조현우
 * @since 2025-07-13
 *
 */
@Service
public class MailService {

    private final JavaMailSender mailSender; // JavaMailSender를 사용하여 이메일 발송

    // email → CodeData (인증번호 + 발송시각)
    private final Map<String, CodeData> codeStorage = new ConcurrentHashMap<>();

    // 인증 유효 시간 (단위: ms) → 3분
    private static final long CODE_EXPIRE_MILLIS = 3 * 60 * 1000;

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender; // JavaMailSender 초기화
    }

    /**
     * 인증번호 발송 메서드
     *
     * 이 메서드는 이메일로 인증번호를 발송합니다.
     * 발송된 인증번호는 `codeStorage`에 이메일과 함께 저장됩니다.
     * 인증번호는 6자리 숫자로 생성되며, 발송 시각과 함께 저장됩니다.
     *
     * @param email 인증번호를 발송할 이메일 주소
     */
    public void sendCode(String email) {
        String code = generateCode(); // 6자리 인증번호 생성
        codeStorage.put(email, new CodeData(code)); // 이메일과 인증번호, 발송 시각 저장

        // 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email); // 수신 이메일 설정
        message.setSubject("[회원가입 인증] 이메일 인증 요청");                              // 메일 제목

        message.setText(
                "안녕하세요, YH 서비스에 가입해주셔서 감사합니다.\n\n" +
                        "아래 인증번호를 입력하여 회원가입을 완료해 주세요\n\n" +
                        "인증번호: " + code + "\n\n" +
                        "※ 유효시간은 3분입니다. 시간이 지나면 인증번호가 만료됩니다.\n\n" +
                        "감사합니다.\nYH 서비스 드림"
        );                                                                              // 메일 내용

        mailSender.send(message); // 메일 발송
        
    }
    
    // 개발 테스트용
    /*public String sendCode(String email) {

        String code = generateCode(); // 6자리 인증번호 생성
        codeStorage.put(email, new CodeData(code)); // 이메일과 인증번호, 발송 시각 저장

        // 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[회원가입 인증] 이메일 인증 요청");
        message.setText(
                "안녕하세요, YH 서비스에 가입해주셔서 감사합니다.\n\n" +
                        "아래 인증번호를 입력하여 회원가입을 완료해 주세요\n\n" +
                        "인증번호: " + code + "\n\n" +
                        "※ 유효시간은 3분입니다. 시간이 지나면 인증번호가 만료됩니다.\n\n" +
                        "감사합니다.\nYH 서비스 드림"
        );

        mailSender.send(message);

        return code;

    }*/

    public void sendPasswordResetCode(String email) {
        String code = generateCode(); // 6자리 인증번호 생성
        codeStorage.put(email, new CodeData(code)); // 이메일과 인증번호, 발송 시각 저장

        // 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email); // 수신 이메일 설정
        message.setSubject("[비밀번호 찾기] 이메일 인증 요청"); // 메일 제목 변경: 비밀번호 찾기 인증

        message.setText(
                "안녕하세요, YH 서비스입니다.\n\n" +
                        "비밀번호 재설정을 위한 인증번호는 아래와 같습니다\n\n" +
                        "인증번호: " + code + "\n\n" +
                        "※ 유효시간은 3분입니다. 시간이 지나면 인증번호가 만료됩니다.\n\n" +
                        "감사합니다.\nYH 서비스 드림"
        ); // 메일 내용 변경: 비밀번호 찾기 관련 내용

        mailSender.send(message); // 메일 발송
    }

    /**
     * 인증번호 검증 메서드
     *
     * 이 메서드는 사용자가 입력한 인증번호가 유효한지 검증합니다.
     * 검증할 때, 저장된 인증번호와 입력된 인증번호를 비교하고,
     * 인증번호가 만료되었는지 여부도 확인합니다.
     *
     * @param email       인증번호를 확인할 이메일 주소
     * @param inputCode  사용자가 입력한 인증번호
     * @return 인증번호가 일치하면 true, 그렇지 않으면 false
     */
    public boolean verifyCode(String email, String inputCode) {
        CodeData saved = codeStorage.get(email); // 저장된 인증번호 데이터 가져오기

        if (saved == null) {
            return false; // 인증번호 없음
        }

        if (saved.isExpired(CODE_EXPIRE_MILLIS)) {
            codeStorage.remove(email); // 만료된 코드 삭제
            return false;
        }

        boolean matched = saved.getCode().equals(inputCode); // 입력된 코드와 비교

        if (matched) {
            codeStorage.remove(email); // 일치하면 코드 사용 후 삭제
        }

        return matched; // 인증번호 일치 여부 반환
    }

    /**
     * 인증번호 생성 메서드 (6자리 숫자)
     *
     * 이 메서드는 6자리 숫자의 인증번호를 생성합니다.
     * 인증번호는 랜덤으로 생성되며, 숫자 범위는 100000부터 999999까지입니다.
     *
     * @return 생성된 6자리 인증번호
     */
    private String generateCode() {

        return String.valueOf((int)(Math.random() * 900000) + 100000); // 6자리 랜덤 숫자 생성

    }

    /**
     * 인증코드 + 발송시각을 저장하는 클래스
     *
     * 이 클래스는 인증번호와 발송 시각을 저장하여 인증번호의 유효기간을 확인할 수 있습니다.
     */
    private static class CodeData {
        private final String code; // 인증번호
        private final long issuedAtMillis; // 인증번호 발송 시각

        public CodeData(String code) {
            this.code = code;
            this.issuedAtMillis = System.currentTimeMillis(); // 현재 시간 기록
        }

        public String getCode() {

            return code; // 인증번호 반환

        }

        public boolean isExpired(long expireMillis) {
            return System.currentTimeMillis() - issuedAtMillis > expireMillis; // 유효시간 초과 여부 확인
        }
    }
}
