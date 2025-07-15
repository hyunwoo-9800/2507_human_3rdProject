package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import java.util.List;

@Data
public class CategoryVO {
    private String midCodeValue;
    private String midCodeName;
    private List<CategoryDetailVO> subCategories;  // SubCategoryVO -> CategoryDetailVO 변경
}


