package fs.human.yk2hyeong.product.vo;

import lombok.Data;

import java.sql.Date;

// 상품관련 VO
@Data
public class ProductVO {
    private String productId;
    private String productCode;
    private String productName;
    private String productDescription;
    private int productStockQty;
    private double productUnitPrice;
    private String sellMemberId;
    private String productType;
    private int productMinQtr;
    private Date productRevStart;
    private Date productRevEnd;
    private String productDisplayFlag;
    private String productStatus;
    private String productCodeName;
    private String productStatusName;
    private String sellerName;
    private String sellerEmail;
    private String productSellType;
    private String productDisplayType;
}
