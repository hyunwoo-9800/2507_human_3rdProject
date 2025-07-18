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

//    회원가입승인 알람
    void insertAlarm(AdminVO adminVO);
    void updateProductStatus(String productId, String status);
    void updateProductFlag(String productId, String flag);

//    상품관리 상품삭제
    void rejectProduct(List<String> productId);
//    유저관리 유저삭제
    void rejectMember(List<String> memberId);
//    신고관리 신고삭제는 상품관리 상품삭제랑 기능 동일해서 재사용

//    회원가입승인
    void approveMember(String memberId);




}
