package fs.human.yk2hyeong.admin.controller;

import fs.human.yk2hyeong.admin.dao.AdminDAO;
import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.common.code.service.CodeService;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collections;
import java.util.List;

// 관리자 페이지 컨트롤러
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    // 관리자 서비스, 공통코드 서비스
    private final AdminService adminService;
    private final CodeService codeService;
    private final AdminDAO adminDAO;

    // 미승인 상품 조회
    @GetMapping("/product/pending")
    public List<ProductVO> getPendingProduct() throws Exception {

        // System.out.println("[GameController] getPendingProduct() 호출됨");
        return adminService.getPendingProduct();

    }

    // 미승인 회원 조회
    @GetMapping("/member/pending")
    public List<AdminVO> getPendingMember() throws Exception {

        
        // System.out.println("[GameController] getPendingMember() 호출됨");


        // System.out.println("[AdminController] getPendingMember() 호출됨");

        return adminService.getPendingMember();

    }

    // 신고 목록 조회
    @GetMapping("/report")
    public List<AdminVO> getReport() throws Exception {

        // System.out.println("[GameController] getReport() 호출됨");
        return adminService.getReport();

    }

    // 회원 목록 조회
    @GetMapping("/member")
    public List<AdminVO> getMember() throws Exception {

        // System.out.println("[GameController] getMember() 호출됨");
        return adminService.getMember();

    }

    // 상품이미지 불러오기
    @GetMapping("/product/{productId}/images")
    @ResponseBody
    public List<ProductImageVO> getProductImages(@PathVariable String productId) throws Exception {

        return adminService.getProductImages(productId);

    }

    // 게시글 삭제
    @PostMapping("/member/delete")
    public void deleteMember(@RequestParam List<String> memberId) throws Exception {

        adminService.deleteMember(memberId);

    }

    // 알림 삭제
    @PostMapping("/report/delete")
    public void deleteReport(@RequestBody List<String> reportId) throws Exception {
        adminService.deleteReport(reportId);

    }

    // 회원가입승인, 거부
    @PostMapping("/alarm/reject")
    public ResponseEntity<String> insertAlarm(@RequestBody AdminVO adminVO) throws Exception {
        List<String> productId = adminVO.getProductIdList();
        String alarmType = codeService.getRejectAlarmCode(); // 거부 코드
        String rejectCode = codeService.getRejectAlarmCode(); // 상태코드로도 사용
        String displayOff = codeService.getNotDisplayProduct();
        String createdId = adminVO.getCreatedId() != null ? adminVO.getCreatedId() : "SYSTEM";
        String alarmContent = (adminVO.getAlarmContent() == null || adminVO.getAlarmContent().isEmpty())
                ? " "
                : adminVO.getAlarmContent();


        // System.out.println("[GameController] insertAlarm 호출");

        try {

            // adminVO.setAlarmId(UUID.randomUUID().toString()); 오라클에서 처리함

            /* if (adminVO.getReceiverId() == null) {
                adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
                adminVO.setReceiverId("SYSTEM");
            } */

            if (adminVO.getCreatedId() == null) {
                adminVO.setCreatedId("SYSTEM");
            }

            alarmType = codeService.getRejectAlarmCode();        // 승인 거부 코드
            alarmContent = adminVO.getAlarmContent();            // 알림 내용

            // 알림 수신자 ID 조회
            String receiverId = adminDAO.getReceiverId(adminVO.getProductId());

            if (adminVO.getAlarmContent() == null || adminVO.getAlarmContent().equals("")) {

                adminVO.setAlarmContent(" ");

            } else {

                adminVO.setAlarmContent(alarmContent);

            }

            adminVO.setReceiverId(receiverId);
            adminVO.setAlarmType(alarmType);

            // 알림 등록
            adminService.insertAlarm(adminVO);

            // 상태 업데이트 (거부: D4539D86D99B43B68BCAF17EA011E67B)
            if (adminVO.getProductId() != null && !adminVO.getProductId().isEmpty()) {

                rejectCode = codeService.getRejectAlarmCode();

                // adminService.updateProductStatus(adminVO.getProductId(), "D4539D86D99B43B68BCAF17EA011E67B");
                adminService.updateProductStatus(adminVO.getProductId(), rejectCode);

            }

            return ResponseEntity.ok("알림 및 상품 상태 업데이트 완료");

        } catch (Exception e) {

            // e.printStackTrace(); 보안 상 사용하면 안됨
            // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 실패");


            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest().body("상품 ID가 없습니다.");

            }

            for (String id : productId) {
                // 상품 상태 업데이트
                adminService.updateProductStatus(id, rejectCode);
                adminService.updateProductFlag(id, displayOff);

                // 수신자 조회
                String receiverId = adminDAO.getReceiverIdWithoutStatus(id);

                // 알림 insert용 VO 구성
                AdminVO vo = new AdminVO();
                vo.setProductId(id);
                vo.setProductIdList(List.of(id));
                vo.setAlarmType(alarmType);
                vo.setAlarmContent(alarmContent);
                vo.setCreatedId(createdId);

                adminService.insertAlarm(vo);
            }

            return ResponseEntity.ok("상품 거부 처리 및 알림 완료");
//        List<String> productId = adminVO.getProductIdList();
//        String alarmType = codeService.getRejectAlarmCode();        // 승인 거부 코드
//        String alarmContent = (adminVO.getAlarmContent() == null || adminVO.getAlarmContent().isEmpty())?" ":adminVO.getAlarmContent();           // 알림 내용
//        String createdId = adminVO.getCreatedId() != null ? adminVO.getCreatedId() : "SYSTEM";
//
//        // System.out.println("[AdminController] insertAlarm 호출");
//
//        try {
//
//            // adminVO.setAlarmId(UUID.randomUUID().toString()); 오라클에서 처리함
//
//            /* if (adminVO.getReceiverId() == null) {
//                adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
//                adminVO.setReceiverId("SYSTEM");
//            } */
//
//            if (adminVO.getCreatedId() == null) {
//                adminVO.setCreatedId("SYSTEM");
//            }
//
//
//            // 알림 수신자 ID 조회
//            String receiverId = adminDAO.getReceiverId(adminVO.getProductId());
//
//            if (adminVO.getAlarmContent() == null || adminVO.getAlarmContent().equals("")) {
//                adminVO.setAlarmContent(" ");
//            } else {
//                adminVO.setAlarmContent(alarmContent);
//            }
//            adminVO.setReceiverId(receiverId);
//            adminVO.setAlarmType(alarmType);
//
//            // 알림 등록
//            adminService.insertAlarm(adminVO);
//
//            // 상태 업데이트 (거부: D4539D86D99B43B68BCAF17EA011E67B)
//            if (adminVO.getProductId() != null && !adminVO.getProductId().isEmpty()) {
//                String rejectCode = codeService.getRejectAlarmCode();
//                // adminService.updateProductStatus(adminVO.getProductId(), "D4539D86D99B43B68BCAF17EA011E67B");
//                adminService.updateProductStatus(adminVO.getProductId(), rejectCode);
//            }
//            return ResponseEntity.ok("알림 및 상품 상태 업데이트 완료");
//        } catch (Exception e) {
//            // e.printStackTrace(); 보안 상 사용하면 안됨
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 실패");
//        }
        }
    }
    // 회원가입승인, 승인
    @PostMapping("/alarm/approve")
    public ResponseEntity<String> approveProduct(@RequestBody AdminVO adminVO) throws Exception {
        try {
            List<String> productId = adminVO.getProductIdList();
            System.out.println(">>>> 받은 productIdList: " + adminVO.getProductIdList());
            System.out.println("productId 클래스: " + productId.getClass().getName());
            System.out.println("리스트 사이즈: " + productId.size());
            // 알림 코드
            String appCodeProduct = codeService.getApprovalAlarmCodeProduct();


        // System.out.println("[GameController] approveProduct 호출");

            // 표시 코드
            String displayProduct = codeService.getDisplayProduct();
            String createdId = adminVO.getCreatedId() != null ? adminVO.getCreatedId() : "SYSTEM";


            if (productId == null || productId.isEmpty()) {
                return ResponseEntity.badRequest().body("상품 ID가 없습니다.");
            }
            for (String id : productId) {
                try {
                    System.out.println("→ 쿼리용 productId: [" + id + "]");

                    adminService.updateProductStatus(id, appCodeProduct);
                    adminService.updateProductFlag(id, displayProduct);

                    String alarmType = codeService.getApprovalAlarmCode();
                    String receiverId = adminDAO.getReceiverIdWithoutStatus(id);
                    if (receiverId == null || receiverId.isEmpty()) {
                        System.out.println("receiverId가 null → SYSTEM으로 대체");
                        receiverId = "29E46778F8E3430D9C560B84E4861786";
                    }

                    AdminVO vo = new AdminVO();
                    vo.setProductId(id);
                    vo.setProductIdList(Collections.singletonList(id));
                    vo.setAlarmType(alarmType);
                    vo.setAlarmContent(" ");
                    vo.setReceiverId(receiverId);
                    vo.setCreatedId(createdId);

                    System.out.println("🚀 최종 VO 상태: " + vo);
                    adminService.insertAlarm(vo);
                } catch (Exception e) {
                    System.out.println("[예외 발생] productId = " + id);
                    e.printStackTrace();
                }
            }

        return ResponseEntity.ok("상품 승인 및 알림 전송 완료");
    }catch(
    Exception e)

    {
        System.out.println("🔥🔥🔥 VO 매핑 또는 내부 처리 실패");
        e.printStackTrace();
        return ResponseEntity.status(500).body("VO 파싱 실패: " + e.getMessage());
    }
}

    // 상품관리 삭제버튼
    @PostMapping("/products/reject")
    public ResponseEntity<?> rejectProduct(@RequestBody List<String> productId) throws Exception {

        adminService.rejectProduct(productId);
        return ResponseEntity.ok().build();

    }

    // 유저관리 삭제버튼
    @PostMapping("/member/reject")
    public ResponseEntity<?> rejectMember(@RequestBody List<String> memberId) throws Exception {

        adminService.rejectMember(memberId);
        return ResponseEntity.ok().build();

    }

    // 신고관리 삭제버튼
    @PostMapping("/report/resolve")
    public ResponseEntity<String> resolveReport(@RequestBody List<String> productId) throws Exception {

        adminService.rejectProduct(productId); //재사용
        return ResponseEntity.ok().build();

    }

    // 회원가입 승인
    @PutMapping("/member/{memberId}/approve")
    public ResponseEntity<?> approveMember(@PathVariable String memberId) throws Exception {

        adminService.approveMember(memberId);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) throws Exception {
        try {
            
            // 1. 실제 로컬 경로 구성 (경로는 그대로 유지)
            File file = new File("C:/yk2hyeong/member_images/" + filename);

            if (!file.exists()) {
                
                return ResponseEntity.notFound().build();
                
            }

            // 2. 파일을 byte로 읽기
            byte[] imageBytes = Files.readAllBytes(file.toPath());

            // 3. MIME 타입 자동 판별
            String mimeType = Files.probeContentType(file.toPath());
            
            if (mimeType == null) {
                
                mimeType = "application/octet-stream"; // 기본값
                
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(mimeType));

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            
            // e.printStackTrace(); 보안 상 사용하면 안됨
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            
        }
        
    }
    
}
