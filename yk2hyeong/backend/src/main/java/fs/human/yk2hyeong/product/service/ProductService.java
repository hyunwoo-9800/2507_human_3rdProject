package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.vo.ProductVO;

import java.util.List;

// 상품관련 서비스 인터페이스
public interface ProductService {
    List<ProductVO> getAllProducts();
}
