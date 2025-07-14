package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductDAO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// 상품관련 서비스 구현
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductDAO productDAO;

    @Autowired
    public ProductServiceImpl(ProductDAO productDAO) {
        this.productDAO = productDAO;
    }

    @Override
    public List<ProductVO> getAllProducts() {
        return productDAO.getAllProducts();
    }
}
