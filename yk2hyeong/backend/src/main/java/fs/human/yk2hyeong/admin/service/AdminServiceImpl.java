package fs.human.yk2hyeong.admin.service;

import fs.human.yk2hyeong.admin.dao.AdminDAO;
import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.common.code.dao.CodeDAO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

// 관리자 서비스 구현
@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminDAO adminDAO;

    @Autowired
    private CodeDAO codeDAO;


    @Override
    public List<ProductVO> getPendingProduct() {

        List<ProductVO> list = adminDAO.selectPendingProduct();

        /* if (list == null) {

            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");

        } else {

            System.out.println("[AdminServiceImpl] 조회된 상품 개수: " + list.size());

            for (ProductVO item : list) {

                System.out.println("상품명: " + item.getProductName());

            }

        } */

        // 리스트가 없을 경우 빈 리스트 반환
        if (list == null || list.isEmpty()) {

            return Collections.emptyList();

        }

        return list;

    }

    @Override
    public List<AdminVO> getPendingMember() {

        // System.out.println("[AdminServiceImpl] getPendingMember 호출됨");

        List<AdminVO> list = adminDAO.selectPendingMember();

        if (list == null || list.isEmpty()) {

            // System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");
            return Collections.emptyList();

        } else {

            // System.out.println("[AdminServiceImpl] 조회된 유저 수: " + list.size());

            for (AdminVO item : list) {

                // System.out.println("상품명: " + item.getMemberName());

                //이미지 리스트 조회해서 세팅 추가
                List<String> imageUrls = adminDAO.selectMemberImageUrls(item.getMemberId());
                item.setMemberFileUrls(imageUrls);

            }

        }

        return list;

    }

    @Transactional
    @Override
    public List<AdminVO> getReport() {

        // System.out.println("[AdminServiceImpl] getReport 호출됨");

        List<AdminVO> list = adminDAO.selectReport();

        /* if (list == null) {

            System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");

        } else {

            System.out.println("[AdminServiceImpl] 조회된 신고 수: " + list.size());

            for (AdminVO item : list) {

                System.out.println("신고자명: " + item.getReporterName());

            }

        } */

        if (list == null || list.isEmpty()) {

            return Collections.emptyList();

        }

        return list;

    }

    @Override
    public List<AdminVO> getMember() {

        // System.out.println("[AdminServiceImpl] getMember 호출됨");

        List<AdminVO> list = adminDAO.selectMember();
        /* if (list == null) {

             System.out.println("[AdminServiceImpl] DAO에서 null 반환됨");

        } else {

             System.out.println("[AdminServiceImpl] 조회된 멤버 수: " + list.size());

            for (AdminVO item : list) {

                System.out.println("멤버명: " + item.getMemberName());

            }

        } */

        if (list == null || list.isEmpty()) {

            return Collections.emptyList();

        }

        return list;

    }

    //이미지 불러오기
    @Override
    public List<ProductImageVO> getProductImages(String productId){

        List<ProductImageVO> images = adminDAO.getProductImages(productId);

        // System.out.println("[AdminServiceImpl] 조회된 이미지 개수: " + images.size());

        return adminDAO.getProductImages(productId);

    }

//    게시글 삭제
    @Override
    public void deleteReport(List<String> reportId){
        System.out.println("🔥 deleteReport() 호출됨");
        System.out.println("🔥 삭제할 reportId 목록: " + reportId);

        adminDAO.deleteReport(reportId);

    }

    @Override
    public void deleteMember(List<String> reportId){

        adminDAO.deleteReport(reportId);

    }

//    회원가입승인
    @Override
    public void insertAlarm(AdminVO adminVO) {
        System.out.println("[insertAlarm] 호출됨");
        List<String> productIdList = adminVO.getProductIdList(); //복수 상품 처리
        String alarmContent = adminVO.getAlarmContent() != null ? adminVO.getAlarmContent() : "";
        String alarmType = adminVO.getAlarmType() != null ? adminVO.getAlarmType() : "012";
        String createdId = adminVO.getCreatedId() != null ? adminVO.getCreatedId() : "SYSTEM";

        // System.out.println("[AdminServiceImpl] insertAlarm 호출");
        // System.out.println("productId: " + adminVO.getProductId());

        // UUID, 관리자 ID 등 보완
//        if (adminVO.getAlarmId() == null || adminVO.getAlarmId().isEmpty()) {
//
//            adminVO.setAlarmId(UUID.randomUUID().toString());
//
//        } 오라클에서 처리함
        // ✅ 단건 처리 (productId만 존재할 때)
        if ((productIdList == null || productIdList.isEmpty()) && adminVO.getProductId() != null) {
            System.out.println("→ 단건 알림 insert");
            adminDAO.insertAlarm(adminVO);
            return;
        }

        // ✅ 복수 처리
        if (productIdList != null && !productIdList.isEmpty()) {
            System.out.println("→ 복수 알림 insert");
            for (String id : productIdList) {
                System.out.println("→ 쿼리용 productId: [" + id + "]");
                String receiverId = adminDAO.getReceiverIdWithoutStatus(id);

                AdminVO vo = new AdminVO();
                vo.setProductId(id);
                vo.setReceiverId(receiverId);
                vo.setAlarmType(alarmType);
                vo.setAlarmContent(alarmContent);
                vo.setCreatedId(createdId);

                adminDAO.insertAlarm(vo);
            }
        }

    }

    @Override
    public void updateProductStatus(String productId, String status) {

        adminDAO.updateProductStatus(productId, status);

    }

    @Override
    public void updateProductFlag(String productId, String flag) {

        adminDAO.updateProductFlag(productId, flag);

    }


    // 상품관리 상품삭제
    @Transactional
    @Override
    public void rejectProduct(List<String> productIds) {

    String productEnd = codeDAO.getEndProduct();
    String productNotDisplay = codeDAO.getNotDisplayProduct();

        for (String productId : productIds) {

            adminDAO.updateProductStatusFlag(
                    productId,
                    productEnd,
                    productNotDisplay
            );

//            adminDAO.updateProductStatusFlag(
//                    productId,
//                    "6524D569917E4468B4B4323E4355E0B8",
//                    "C64A2EE83FBB4B0B9681227F31401EE0"
//            );

        }

    }

    // 회원 가입 거부
    @Override
    public void rejectMember(List<String> memberId) {

        String memberDeleteCode = codeDAO.getDeleteMemberCode();

        for (String id : memberId){

            adminDAO.updateMemberStatus(id, memberDeleteCode);
//          adminDAO.updateMemberStatus(id, "003");

        }

    }

    // 회원가입승인
    public void approveMember(String memberId) {

        adminDAO.updateMemberStatusToApprove(memberId);

    }

    // 알림 수신자 ID 조회
    @Override
    public String getReceiverId(String productId) throws Exception {

        return adminDAO.getReceiverId(productId);

    }

}
