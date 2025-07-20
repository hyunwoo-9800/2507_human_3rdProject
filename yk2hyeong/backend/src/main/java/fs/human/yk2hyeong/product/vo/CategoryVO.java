package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import java.util.List;

@Data
public class CategoryVO {
    
    private String midCodeValue;                    // 중간 코드
    private String midCodeName;                     // 중간 코드 명
    private List<CategoryDetailVO> subCategories;   // SubCategoryVO -> CategoryDetailVO 변경
    
}


