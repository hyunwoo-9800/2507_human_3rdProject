package fs.human.yk2hyeong.product.vo;

import lombok.Data;

@Data
public class CategoryDetailVO {
    private String detailCodeId;
    private String midCodeValue; // 예: 100
    private String midCodeName;  // 예: 식량작물
    private String lowCodeValue; // 예: 113
    private String lowCodeName;  // 예: 혼합곡
}
