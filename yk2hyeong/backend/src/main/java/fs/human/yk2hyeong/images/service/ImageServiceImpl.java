package fs.human.yk2hyeong.images.service;

import fs.human.yk2hyeong.common.code.dao.CodeDAO;
import fs.human.yk2hyeong.images.dao.ImageDAO;
import fs.human.yk2hyeong.images.vo.ImageVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.UUID;

/**
 * 이미지 서비스 구현 클래스
 *
 * 이 클래스는 이미지 저장 및 관련 처리를 담당하는 서비스 클래스입니다.
 * 이미지 파일을 서버에 저장하고, 해당 정보를 데이터베이스에 기록합니다.
 *
 * @author 조현우
 * @since 2025-07-13
 */
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageDAO imageDAO; // 이미지 관련 DB 작업을 처리하는 DAO
    private final CodeDAO codeDAO; // 코드 관련 DB 작업을 처리하는 DAO

    /**
     * 이미지를 저장하고, 데이터베이스에 관련 정보를 저장하는 메서드
     *
     * 이 메서드는 이미지를 파일 시스템에 저장하고, 이미지 정보 객체를 생성하여
     * 데이터베이스에 삽입하는 작업을 수행합니다. 이미지를 저장한 후, 고유한 이미지 ID를 반환합니다.
     *
     * @param file 업로드된 이미지 파일
     * @param memberIdOrNull 관련된 회원 ID (회원과 관련 없으면 null)
     * @return 저장된 이미지의 고유 ID(UUID)
     * @throws Exception 파일 저장 또는 DB 처리 중 발생할 수 있는 예외
     */
    @Override
    public String insertImage(MultipartFile file, String memberIdOrNull) throws Exception {
        System.out.println("[DEBUG] insertImage 진입: " + (file != null ? file.getOriginalFilename() : "null"));
        try {

            // 이미지 고유 ID(UUID) 생성
            String uuid = UUID.randomUUID().toString();
            String originalName = file.getOriginalFilename();                 // 원본 파일 이름
            String newFileName = uuid + "_" + originalName;                   // 새로운 파일 이름 생성
            String saveDir = "images/memberimages";                    // DB에 저장할 상대 경로

            // 실제 저장 경로 (두 곳)
            String frontendPath = "yk2hyeong/frontend/public/static/images/memberimages";
            String backendPath = "yk2hyeong/backend/src/main/resources/static/images/memberimages";
            System.out.println("[DEBUG] frontendPath: " + frontendPath);
            System.out.println("[DEBUG] backendPath: " + backendPath);

            // 디렉토리 생성
            Files.createDirectories(Paths.get(frontendPath));
            Files.createDirectories(Paths.get(backendPath));

            // 파일을 프론트엔드 경로에 저장
            Path frontendSavePath = Paths.get(frontendPath, newFileName);
            file.transferTo(frontendSavePath);

            // 백엔드 경로로 복사
            Path backendSavePath = Paths.get(backendPath, newFileName);
            Files.copy(frontendSavePath, backendSavePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 이미지 타입을 코드에서 조회
            String imgType = codeDAO.getImageLowCodeValue();

            // 이미지 정보 객체 생성 및 설정
            ImageVO image = new ImageVO();
            image.setImagePath(saveDir);                                    // 저장 경로 (DB에는 상대경로)
            image.setImageName(newFileName);                                // 새로운 파일 이름
            image.setImageType(imgType);                                    // 이미지 타입
            image.setMemberId(memberIdOrNull);                              // 회원 ID (회원과 관련 없다면 null)
            image.setProductId(" ");                                        // 관련 상품 ID (현재는 사용 안 함)
            image.setCreatedId("SYSTEM");                                   // 등록자 ID (시스템 등록)
            image.setCreatedDate(new Date(System.currentTimeMillis()));     // 등록 일시
            image.setUpdatedId("SYSTEM");                                   // 수정자 ID (시스템 수정)
            image.setUpdatedDate(new Date(System.currentTimeMillis()));     // 수정 일시

            // 이미지 정보 DB에 삽입
            imageDAO.insertImage(image);

            // 이미지 고유 ID 반환
            return uuid;

        } catch (IOException e) {

            // 이미지 저장 중 오류 발생 시 예외 처리
            throw new RuntimeException("이미지 저장 실패", e);

        }

    }

    /**
     * 이미지에 관련된 회원 ID를 업데이트하는 메서드
     *
     * 이 메서드는 이미지와 관련된 회원 ID를 업데이트하여, 이미지와 회원 정보를 연결합니다.
     *
     * @param imageId 이미지 고유 ID
     * @param memberId 관련된 회원 ID
     * @throws Exception DB 처리 중 발생할 수 있는 예외
     */
    @Override
    public void updateImageMemberId(String imageId, String memberId) throws Exception {

        // 이미지의 회원 ID를 업데이트
        imageDAO.updateImageMemberId(imageId, memberId);

    }

}
