package fs.human.yk2hyeong.images.vo;

import lombok.Data;

import java.sql.Date;

/**
 * 이미지 정보 VO (Value Object) 클래스
 *
 * 이 클래스는 이미지 정보를 담기 위한 VO 클래스입니다.
 * 이미지 고유 ID, 이미지 경로, 타입 등의 정보를 저장하며,
 * 특정 회원이나 상품과 연결될 수 있습니다.
 *
 * @author 조현우
 * @since 2025-07-13
 */
@Data
public class ImageVO {

    private String imageId;       // 이미지 고유 ID (UUID)
    private String imagePath;     // 저장 경로
    private String imageName;     // 파일 이름
    private String imageType;     // 이미지 타입 ('BUSINESS_CERT', 'BANK_BOOK', 등)

    private String memberId;      // 관련 회원 ID (nullable)
    private String productId;     // 관련 상품 ID (nullable)

    private String createdId;     // 등록자 ID
    private Date createdDate;

    private String updatedId;     // 수정자 ID
    private Date updatedDate;

}
