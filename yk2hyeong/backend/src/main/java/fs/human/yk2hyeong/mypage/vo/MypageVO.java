package fs.human.yk2hyeong.mypage.vo;

import lombok.Data;

@Data
public class MypageVO {
    private String buyId;
    private String productId;
    private String memberId;
    private int buyQty;
    private double buyUnitPrice;
    private double buyTotalPrice;
    private String buyDeliveryDate;
    private String createdDate;

    private String productName;
    private String productDescription;
    private double productUnitPrice;
    private int productMinQtr;
    private String sellMemberId;
    private String imageName;

    private String alarmId;
    private String alarmContent;
    private String receiverId;
    private String isRead;
    private String status;

    // 판매완료(sold) 전용
    private String sellerName;
    private String buyerName;
    private String memberAddr;
    private String memberDetailAddr;
    private String deliveryDate;
}
