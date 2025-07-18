package fs.human.yk2hyeong.product.vo;

import lombok.Data;

@Data
public class ProductNoticeVO {
    private String productNoticeId;
    private String productId;
    private String title; // 공지 제목
    private String productNoticeContent;
    private String memberId; // 등록자(판매자)
    private String productNoticeType; // NOTICE, WARNING
    private String createdId;
    private String updatedId;
    private String createdDate;
    private String updatedDate;
}