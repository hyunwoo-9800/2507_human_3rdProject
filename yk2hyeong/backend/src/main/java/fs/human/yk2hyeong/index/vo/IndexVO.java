package fs.human.yk2hyeong.index.vo;

import lombok.Data;

// 메인화면 VO
@Data
public class IndexVO {

    private String productId;      // 상품 ID
    private String popular;        // 인기상품
    private String productName;    // 상품명

    private String noticeId;
    private String noticeTitle;

}
