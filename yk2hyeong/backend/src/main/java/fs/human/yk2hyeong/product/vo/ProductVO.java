package fs.human.yk2hyeong.product.vo;

import lombok.Data;

// 상품관련 VO
@Data
public class ProductVO {
    private String productId;
    private String productName;
    private String productDescription;
    private int productStockQty;
    private double productUnitPrice;
    private String sellMemberId;
}
