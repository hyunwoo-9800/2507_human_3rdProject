package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class ProductImageVO {

    private String imageId;     // 이미지 고유 ID
    private String imagePath;   // 이미지 경로
    private String imageName;   // 이미지 명
    private String imageType;   // 이미지 타입
    private String memberId;    // 사용자 고유 ID
    private String productId;   // 상품 고유 ID

}
