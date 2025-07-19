package fs.human.yk2hyeong.product.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

// 상품관련 VO
@Data
public class ProductVO {
    private String productId;
    private String productCode;
    private String productName;
    private String productDescription;
    private int productStockQty;
    private BigDecimal productUnitPrice;
    private String sellMemberId;
    private String productType;
    private int productMinQtr;
    private Date productRevStart;
    private Date productRevEnd;
    private String productDisplayFlag;
    private String productStatus;
    private String createdId;
    private String createdDate;
    private String updatedId;

    private String productCat;
    private String productCodeName;
    private String lowCodeValue;
    private String productStatusName;

    private String sellerTel;
    private String sellerName;
    private String sellerEmail;
    private String sellerCompany;

    private String productSellType;
    private String productDisplayType;

    // 이미지
    private String imageId;
    private String imagePath;
    private String imageName;
    private String imageType;
    private String memberId;
}
