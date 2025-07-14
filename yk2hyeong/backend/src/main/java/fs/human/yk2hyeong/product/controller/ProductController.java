package fs.human.yk2hyeong.product.controller;

import fs.human.yk2hyeong.product.service.ProductService;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


// 상품관련 컨트롤러
@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<ProductVO> getAllProducts() {
        return productService.getAllProducts();
    }
}
