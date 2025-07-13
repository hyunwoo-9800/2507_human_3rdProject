package fs.human.yk2hyeong.images.service;

import fs.human.yk2hyeong.images.vo.ImageVO;
import org.springframework.web.multipart.MultipartFile;

/**
 * 이미지 서비스 인터페이스
 *
 * 이 인터페이스는 이미지 관련 작업을 수행하는 서비스의 기본적인 계약을 정의합니다.
 * 이미지를 업로드하고, 이미지에 대한 회원 정보를 업데이트하는 메서드를 제공합니다.
 *
 * @author 조현우
 * @since 2025-07-13
 */
public interface ImageService {

    /**
     * 이미지를 저장하고, 관련 정보를 데이터베이스에 삽입하는 메서드
     *
     * 이 메서드는 이미지를 파일 시스템에 저장하고, 이미지 정보를 데이터베이스에 삽입합니다.
     * 저장된 이미지의 고유 ID를 반환합니다.
     *
     * @param file 업로드된 이미지 파일
     * @param memberId 이미지와 연결될 회원 ID (null일 수 있음)
     * @return 저장된 이미지의 고유 ID(UUID)
     * @throws Exception 파일 저장 또는 DB 처리 중 발생할 수 있는 예외
     */
    String insertImage(MultipartFile file, String memberId) throws Exception;

    /**
     * 이미지에 대한 회원 ID를 업데이트하는 메서드
     *
     * 이 메서드는 특정 이미지의 `memberId` 값을 업데이트하여, 이미지가 속한 회원을 설정합니다.
     * 이미지와 관련된 회원 정보를 연결하는 작업입니다.
     *
     * @param imageId 이미지 고유 ID
     * @param memberId 업데이트할 회원 ID
     * @throws Exception DB 처리 중 발생할 수 있는 예외
     */
    void updateImageMemberId(String imageId, String memberId) throws Exception;

}
