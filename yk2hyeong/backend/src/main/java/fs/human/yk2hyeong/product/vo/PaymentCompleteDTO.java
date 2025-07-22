package fs.human.yk2hyeong.product.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

// 결제 완료 시 사용
@Data
public class PaymentCompleteDTO {

    private String orderNumber;             // 주문번호
    private String orderType;               // immediate | reservation
    private String productId;               // 상품 ID
    private String memberId;                // 사용자 ID
    private int buyQty;                     // 수량
    private BigDecimal buyUnitPrice;        // 단가
    private BigDecimal buyTotalPrice;       // 총금액
    private Date buyDeliveryDate;           // 출하 예정일 (YYYY-MM-DD)
    private String paymentKey;              // 토스 결제 키
    private String createdId;               // 실제 결제 금액

}
