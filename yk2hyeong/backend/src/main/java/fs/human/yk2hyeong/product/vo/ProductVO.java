package fs.human.yk2hyeong.product.vo;

import lombok.Data;

import java.math.BigDecimal;
import java.sql.Date;

// 상품관련 VO
@Data
public class ProductVO {

    private String productId;                           // 상품 고유 ID (UUID)
    private String productCode;                         // 상품 코드
    private String productName;                         // 상품명
    private String productDescription;                  // 상품 설명
    private int productStockQty;                        // 상품 재고 수량
    private BigDecimal productUnitPrice;                // 상품 단가 (1개당 가격)
    private String sellMemberId;                        // 판매자 회원 ID
    private String productType;                         // 상품 타입
    private int productMinQtr;                          // 최소 주문 수량
    private Date productRevStart;                       // 예약 가능 시작일 (예약상품인 경우)
    private Date productRevEnd;                         // 예약 가능 종료일 (예약상품인 경우)
    private String productDisplayFlag;                  // 상품 노출 여부
    private String productStatus;                       // 상품 상태
    private String createdId;                           // 등록자 ID
    private String createdDate;                         // 등록일시
    private String updatedId;                           // 수정자 ID
    private String updatedDate;                         // 수정일시

    private String productCat;                          // 상품 카테고리
    private String productCodeName;                     // 부류 코드 명(식량작물, 특용작물 등)
    private String lowCodeValue;                        // 품목 코드
    private String productStatusName;                   // 상품 상태 명

    private String sellerTel;                           // 판매자 연락처
    private String sellerName;                          // 판매자 명
    private String sellerEmail;                         // 판매자 이메일
    private String sellerCompany;                       // 판매자 상호

    private String productSellType;                     // 판매 타입
    private String productDisplayType;                  // 상품 노출 타입

    // 이미지
    private String imageId;
    private String imagePath;
    private String imageName;
    private String imageType;
    private String memberId;

}
