package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ProductImageVO {
    private String imageId;
    private String imagePath;
    private String imageName;
    private String imageType;
    private String memberId;
    private String productId;
}
