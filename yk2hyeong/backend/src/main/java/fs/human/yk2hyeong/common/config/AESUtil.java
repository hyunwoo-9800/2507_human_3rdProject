package fs.human.yk2hyeong.common.config;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

/**
 * AESUtil 클래스는 AES 암호화를 수행하는 유틸리티 클래스입니다.
 * 이 클래스는 주어진 평문을 암호화하거나 암호문을 복호화하는 기능을 제공합니다.
 * 암호화는 AES 알고리즘을 사용하며, 결과는 Base64로 인코딩되어 문자열로 반환됩니다.
 *
 * <p>
 * - 암호화 메서드: 평문을 AES로 암호화한 후 Base64로 인코딩하여 반환합니다.
 * - 복호화 메서드: Base64로 인코딩된 암호문을 복호화하여 원본 평문을 복원합니다.
 * </p>
 *
 *  * @author 조현우
 *  * @since 2025-07-11
 *
 */
public class AESUtil {

    // 16자리 고정 비밀 키 (AES는 16바이트 키를 사용)
    private static final String SECRET_KEY = "MySecretKey12345"; // 16자리 키 (고정)

    /**
     * 주어진 평문을 AES로 암호화하여 Base64로 인코딩된 문자열을 반환합니다.
     *
     * @param plainText 암호화할 평문
     * @return 암호화된 Base64 인코딩된 문자열
     * @throws Exception 암호화 과정에서 발생할 수 있는 예외
     */
    public static String encrypt(String plainText) throws Exception {
        // 비밀 키를 바이트 배열로 변환하여 SecretKeySpec 객체 생성
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");

        // AES/ECB/PKCS5Padding 방식으로 Cipher 객체 생성 (ECB 모드는 보안에 취약할 수 있음)
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");

        // 암호화 모드로 초기화
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);

        // 평문을 암호화
        byte[] encrypted = cipher.doFinal(plainText.getBytes("UTF-8"));

        // 암호화된 결과를 Base64로 인코딩하여 문자열로 반환
        return Base64.getEncoder().encodeToString(encrypted); // 문자열로 변환
    }

    /**
     * 주어진 Base64로 인코딩된 암호문을 AES로 복호화하여 원본 평문을 반환합니다.
     *
     * @param encryptedText 암호화된 Base64 인코딩 문자열
     * @return 복호화된 평문 문자열
     * @throws Exception 복호화 과정에서 발생할 수 있는 예외
     */
    public static String decrypt(String encryptedText) throws Exception {
        // 비밀 키를 바이트 배열로 변환하여 SecretKeySpec 객체 생성
        SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), "AES");

        // AES/ECB/PKCS5Padding 방식으로 Cipher 객체 생성 (복호화)
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");

        // 복호화 모드로 초기화
        cipher.init(Cipher.DECRYPT_MODE, keySpec);

        // Base64로 인코딩된 암호문을 디코딩
        byte[] decoded = Base64.getDecoder().decode(encryptedText);

        // 복호화하여 원본 평문을 얻음
        byte[] decrypted = cipher.doFinal(decoded);

        // 복호화된 바이트 배열을 UTF-8 문자열로 변환하여 반환
        return new String(decrypted, "UTF-8");
    }

}