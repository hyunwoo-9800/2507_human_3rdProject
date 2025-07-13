package fs.human.yk2hyeong.images.vo;

import lombok.Data;

import java.sql.Date;


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
