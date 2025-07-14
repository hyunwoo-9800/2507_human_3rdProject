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

    // 상품 전체 조회
    @Override
    public List<ProductVO> getAllProducts() {
        return productDAO.getAllProducts();
    }

    // 즐겨찾기 등록
    @Override
    public void insertFavorite(String memberId, String productId) {
        productDAO.insertFavorite(memberId, productId);
    }

    // 즐겨찾기 삭제
    @Override
    public void deleteFavorite(String memberId, String productId) {
        productDAO.deleteFavorite(memberId, productId);
    }

    // 즐겨찾기된 productId 목록 조회
    @Override
    public List<String> getFavoriteProductIds(String memberId) {
        return productDAO.selectFavoriteProductIds(memberId);
    }
}
