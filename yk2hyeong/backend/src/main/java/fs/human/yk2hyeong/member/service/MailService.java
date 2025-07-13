package fs.human.yk2hyeong.member.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    // email → CodeData (인증번호 + 발송시각)
    private final Map<String, CodeData> codeStorage = new ConcurrentHashMap<>();

    // 인증 유효 시간 (단위: ms) → 3분
    private static final long CODE_EXPIRE_MILLIS = 3 * 60 * 1000;

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * 인증번호 발송
     */
    public void sendCode(String email) {
        String code = generateCode();
        codeStorage.put(email, new CodeData(code)); // 이메일 - 코드+시간 저장

        // 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[인증번호] 이메일 인증 요청");
        message.setText("인증번호는: " + code + " 입니다. 유효시간은 3분입니다.");
        mailSender.send(message);
    }

    /**
     * 인증번호 검증
     */
    public boolean verifyCode(String email, String inputCode) {
        CodeData saved = codeStorage.get(email);

        if (saved == null) {
            return false; // 인증번호 없음
        }

        if (saved.isExpired(CODE_EXPIRE_MILLIS)) {
            codeStorage.remove(email); // 만료된 코드 삭제
            return false;
        }

        boolean matched = saved.getCode().equals(inputCode);

        if (matched) {
            codeStorage.remove(email); // 일치하면 사용 후 삭제
        }

        return matched;
    }

    /**
     * 인증번호 생성 (6자리 숫자)
     */
    private String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    /**
     * 인증코드 + 발송시각을 저장하는 클래스
     */
    private static class CodeData {
        private final String code;
        private final long issuedAtMillis;

        public CodeData(String code) {
            this.code = code;
            this.issuedAtMillis = System.currentTimeMillis();
        }

        public String getCode() {
            return code;
        }

        public boolean isExpired(long expireMillis) {
            return System.currentTimeMillis() - issuedAtMillis > expireMillis;
        }
    }
}
