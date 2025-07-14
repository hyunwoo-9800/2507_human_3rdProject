package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

// 상품관련 VO
@Data
@Getter
@Setter
public class ProductVO {
    private String productId;             // PRODUCT_ID
    private String productName;           // PRODUCT_NAME
    private String productDescription;    // PRODUCT_DESCRIPTION
    private int productStockQty;          // PRODUCT_STOCK_QTY
    private int productUnitPrice;         // PRODUCT_UNIT_PRICE
    private String sellMemberId;          // SELL_MEMBER_ID
    private String productType;           // PRODUCT_TYPE
    private int productMinQty;            // PRODUCT_MIN_QTR
    private String productRevEnd;         // PRODUCT_REV_END (예약 종료일)
    private String productRevStart;       // PRODUCT_REV_START (예약 시작일)
    private String createdId;             // CREATED_ID
    private String createdDate;           // CREATED_DATE
    private String productStatus;         // PRODUCT_STATUS

//    tb_images
    private String imageId;
    private String imagePath;
    private String imageName;
    private String imageType;
    private String memberId;


}
