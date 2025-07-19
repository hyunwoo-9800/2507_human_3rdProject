package fs.human.yk2hyeong.admin.dao;

import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

// 관리자 매퍼
@Mapper
public interface AdminDAO {

    // 미승인 상품 조회
    List<ProductVO> selectPendingProduct() throws DataAccessException;
    
    // 상품 이미지 조회
    List<ProductImageVO> getProductImages(String productId) throws DataAccessException;

    // 미승인 회원 조회
    List<AdminVO> selectPendingMember() throws DataAccessException;

    // 신고 리스트 조회
    List<AdminVO> selectReport() throws DataAccessException;

    // 유저 리스트 조회
    List<AdminVO> selectMember() throws DataAccessException;

    // 게시글 삭제
    void deleteReport(@Param("reportId") List<String> reportId) throws DataAccessException;
    void deleteMember(@Param("memberId") List<String> memberId) throws DataAccessException;

    // 회원가입승인
    void insertAlarm(AdminVO adminVO) throws DataAccessException;
    void updateProductStatus(@Param("productId") String productId, @Param("status") String status) throws DataAccessException;
    void updateProductFlag(@Param("productId") String productId, @Param("flag") String flag) throws DataAccessException;


    // 상품관리 상품삭제
    void updateProductStatusFlag(@Param("productId") String productId,
                                 @Param("status") String status,
                                 @Param("flag") String flag) throws DataAccessException;
    // 유저관리 유저삭제
    void updateMemberStatus(@Param("memberId") String memberId, @Param("status") String status) throws DataAccessException;

    // 회원가입승인
    void updateMemberStatusToApprove(String memberId) throws DataAccessException;

    // 회원등록승인 이미지 다운받기
    List<String> selectMemberImageUrls(String memberId) throws DataAccessException;

}
