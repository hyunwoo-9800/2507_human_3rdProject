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
    private String reservationDate; // 예약완료 알림용 예약일자
    private String purchaseType; // 판매완료 알림용 구매유형
    private String buyerTel; // 판매완료 알림용 구매자 연락처
    private String buyDate; // 판매완료 알림용 구매일자
    private String productCodeName; // 상품 카테고리명
    private String revId; // 예약구매 ID

    // 판매완료(sold) 전용
    private String sellerName;
    private String buyerName;
    private String memberAddr;
    private String memberDetailAddr;
    private String deliveryDate;
}
