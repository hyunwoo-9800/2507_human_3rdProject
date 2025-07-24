package fs.human.yk2hyeong.admin.service;

import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;

import java.util.List;

// 관리자 서비스 인터페이스
public interface AdminService {
    
    // 미승인 상품 조회
    List<ProductVO> getPendingProduct() throws Exception;
    
    // 상품 이미지 조회
    List<ProductImageVO> getProductImages(String productId) throws Exception;

    // 미승인 회원 조회
    List<AdminVO> getPendingMember() throws Exception;

    // 신고 리스트 조회
    List<AdminVO> getReport() throws Exception;

    // 유저 리스트 조회
    List<AdminVO> getMember() throws Exception;

    // 게시글 삭제
    void deleteMember(List<String> reportId) throws Exception;
    void deleteReport(List<String> reportId) throws Exception;

    // 회원가입승인 알람
    void insertAlarm(AdminVO adminVO);
    void updateProductStatus(String productId, String status) throws Exception;
    void updateProductFlag(String productId, String flag) throws Exception;

    // 상품관리 상품삭제
    void rejectProduct(List<String> productId) throws Exception;

    // 유저관리 유저삭제
    void rejectMember(List<String> memberId) throws Exception;

    // 신고관리 신고삭제는 상품관리 상품삭제랑 기능 동일해서 재사용

    // 회원가입승인
    void approveMember(List<String> memberIds) throws Exception;

    // 알림 수신자 ID 조회
    String getReceiverId(String productId) throws Exception;

}
