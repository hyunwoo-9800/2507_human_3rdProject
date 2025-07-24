package fs.human.yk2hyeong.product.vo;

import lombok.Data;

@Data
public class ReportVO {
    private String reportId;        // 신고 고유 ID (UUID)
    private String reporterId;      // 신고자 회원 ID
    private String productId;       // 신고 대상 상품 ID
    private String reasonCode;      // 신고 사유 코드
    private String reasonName;      // 신고 사유명 (프론트에서 전달, ex: '부정확한 상품 정보/이미지')
    private String reportContent;   // 신고 상세 내용
    private String createdId;       // 등록자 ID
    private String createdDate;     // 등록일시
    private String updatedId;       // 수정자 ID
    private String updatedDate;     // 수정일시
} 