package fs.human.yk2hyeong.admin.dao;

import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

// 관리자 매퍼
@Mapper
public interface AdminDAO {

    List<ProductVO> selectPendingProduct();
    List<ProductImageVO> getProductImages(String productId);

    List<AdminVO> selectPendingMember();

    List<AdminVO> selectReport();
    List<AdminVO> selectMember();

//    게시글 삭제
    void deleteReport(@Param("reportId") List<String> reportId);
    void deleteMember(@Param("memberId") List<String> memberId);

//    회원가입승인
    void insertAlarm(AdminVO adminVO);
    void updateProductStatus(@Param("productId") String productId, @Param("status") String status);
    void updateProductFlag(@Param("productId") String productId, @Param("flag") String flag);


//    상품관리 상품삭제
    void updateProductStatusFlag(@Param("productId") String productId,
                                 @Param("status") String status,
                                 @Param("flag") String flag);
//    유저관리 유저삭제
    void updateMemberStatus(@Param("memberId") String memberId, @Param("status") String status);

//    회원가입승인
    void updateMemberStatusToApprove(String memberId);
}
