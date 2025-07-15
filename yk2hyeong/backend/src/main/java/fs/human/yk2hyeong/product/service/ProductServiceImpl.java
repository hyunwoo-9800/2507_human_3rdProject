package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ProductDAO;
import fs.human.yk2hyeong.product.vo.CategoryDetailVO;
import fs.human.yk2hyeong.product.vo.CategoryVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import fs.human.yk2hyeong.product.vo.SubCategoryVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

    // 카테고리 리스트 조회
    @Override
    public List<CategoryVO> getCategoryHierarchy() {
        List<CategoryDetailVO> flatList = productDAO.selectCategoryDetails();

        Map<String, CategoryVO> categoryMap = new LinkedHashMap<>();

        for (CategoryDetailVO item : flatList) {
            String midCode = item.getMidCodeValue();

            // 중위 카테고리가 없으면 새로 생성
            categoryMap.computeIfAbsent(midCode, k -> {
                CategoryVO category = new CategoryVO();
                category.setMidCodeValue(item.getMidCodeValue());
                category.setMidCodeName(item.getMidCodeName());
                category.setSubCategories(new ArrayList<>());
                return category;
            });

            categoryMap.get(midCode).getSubCategories().add(item);  // CategoryDetailVO 그대로 추가
        }

        return new ArrayList<>(categoryMap.values());
    }

}
