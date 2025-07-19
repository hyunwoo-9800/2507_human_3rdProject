package fs.human.yk2hyeong.common.config.util;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * KeyGenerator 클래스
 *
 * 이 클래스는 256비트의 비밀 키를 생성하는 기능을 제공합니다.
 * 비밀 키는 보안성을 고려하여 SecureRandom을 사용하여 난수를 생성하고,
 * Base64로 인코딩하여 문자열 형태로 반환됩니다.
 * 이 키는 주로 암호화, 인증 및 보안 관련 작업에서 사용될 수 있습니다.
 *
 * 작성자: 조현우
 * 작성일: 2025-07-11
 */
public class KeyGenerator {

    /**
     * 비밀 키를 생성하는 메서드
     *
     * @return Base64로 인코딩된 256비트 비밀 키 문자열
     */
    public static String generateSecretKey() {
        // SecureRandom 객체 생성 - 난수 생성에 안전한 방법
        SecureRandom secureRandom = new SecureRandom();

        // 32바이트 크기의 배열을 생성 (256비트 = 32바이트)
        byte[] key = new byte[32];

        // 난수로 채워진 바이트 배열 생성
        secureRandom.nextBytes(key);

        // 바이트 배열을 Base64로 인코딩하여 문자열로 반환
        return Base64.getEncoder().encodeToString(key);
    }

    /**
     * 메인 메서드 - 키 생성 후 출력
     *
     * @param args 프로그램 실행 시 인자
     */
    public static void main(String[] args) {
        // 생성된 비밀 키 출력
        System.out.println("Generated Secret Key: " + generateSecretKey());
    }

}
