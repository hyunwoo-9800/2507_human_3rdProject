package fs.human.yk2hyeong.admin.service;

import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;

import java.util.List;

// 관리자 서비스 인터페이스
public interface AdminService {
    List<ProductVO> getPendingProduct();
    List<ProductImageVO> getProductImages(String productId);

    List<AdminVO> getPendingMember();

    List<AdminVO> getReport();
    List<AdminVO> getMember();

    void deleteMember(List<String> reportId);
    void deleteReport(List<String> reportId);
}
