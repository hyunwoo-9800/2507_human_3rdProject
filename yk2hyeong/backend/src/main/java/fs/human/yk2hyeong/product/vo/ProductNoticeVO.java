package fs.human.yk2hyeong.product.vo;

import lombok.Data;

@Data
public class ProductNoticeVO {

    private String productNoticeId;         // 상품 공지 ID
    private String productId;               // 상품 고유 ID
    private String title;                   // 공지 제목
    private String productNoticeContent;    // 공지 내용
    private String memberId;                // 등록자(판매자)
    private String productNoticeType;       // NOTICE, WARNING
    
    private String createdId;               // 작성자
    private String updatedId;               // 수정자
    private String createdDate;             // 작성일자
    private String updatedDate;             // 수정일자
    
}