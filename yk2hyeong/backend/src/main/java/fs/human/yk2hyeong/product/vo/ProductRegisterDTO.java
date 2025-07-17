package fs.human.yk2hyeong.product.vo;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductRegisterDTO {
    private String productName; // PRODUCT_NAME

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate; // PRODUCT_REV_START

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate; // PRODUCT_REV_END

    private double productPrice; // PRODUCT_UNIT_PRICE
    private String detailCodeId; // PRODUCT_CODE
    private String orderType; // PRODUCT_TYPE
    private int saleQuantity; // PRODUCT_STOCK_QTY
    private int minSaleUnit; // PRODUCT_MIN_QTR
    private String descriptionText; // PRODUCT_DESCRIPTION
    private String memberId; // SELLER_MEMBER_ID, CREATED_ID, UPDATED_ID

    private MultipartFile thumbnail; // TB_IMAGES의 IMAGE_TYPE 200
    private List<MultipartFile> detailImages; // TB_IMAGES의 IMAGE_TYPE 300



}

