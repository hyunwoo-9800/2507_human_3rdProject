package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.util.List;

@Data
public class ProductRegisterDTO {
    private String productCode;
    private String productName;
    private String productDescription;
    private int productStockQty;
    private double productUnitPrice;
    private String sellMemberId;
    private String productType;
    private int productMinQtr;
    private Date productRevStart;
    private Date productRevEnd;

    private MultipartFile thumbnail;
    private List<MultipartFile> detailImages;
}
