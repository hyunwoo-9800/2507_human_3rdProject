package fs.human.yk2hyeong.admin.controller;

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

    // 미승인 상품 조회
    @GetMapping("/product/pending")
    public List<ProductVO> getPendingProduct() throws Exception {

        // System.out.println("[AdminController] getPendingProduct() 호출됨");
        return adminService.getPendingProduct();

    }

    // 미승인 회원 조회
    @GetMapping("/member/pending")
    public List<AdminVO> getPendingMember() throws Exception {
        
        // System.out.println("[AdminController] getPendingMember() 호출됨");
        return adminService.getPendingMember();
        
    }

    // 신고 목록 조회
    @GetMapping("/report")
    public List<AdminVO> getReport() throws Exception {

        // System.out.println("[AdminController] getReport() 호출됨");
        return adminService.getReport();

    }

    // 회원 목록 조회
    @GetMapping("/member")
    public List<AdminVO> getMember() throws Exception {

        // System.out.println("[AdminController] getMember() 호출됨");
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
    public void deleteReport(@RequestParam List<String> reportId) throws Exception {

        adminService.deleteReport(reportId);

    }

    // 회원가입승인, 거부
    @PostMapping("/alarm/reject")
    public ResponseEntity<String> insertAlarm(@RequestBody AdminVO adminVO) throws Exception {

        // System.out.println("[AdminController] insertAlarm 호출");

        try {

            // adminVO.setAlarmId(UUID.randomUUID().toString()); 오라클에서 처리함

            if (adminVO.getReceiverId() == null) {
             // adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
                adminVO.setReceiverId("SYSTEM");
            }

            if (adminVO.getCreatedId() == null) {
                adminVO.setCreatedId("SYSTEM");
            }

            // 알림 등록
            adminService.insertAlarm(adminVO);

            // 상태 업데이트 (거부: D4539D86D99B43B68BCAF17EA011E67B)
            if (adminVO.getProductId() != null && !adminVO.getProductId().isEmpty()) {

                String rejectCode = codeService.getRejectAlarmCode();

                // adminService.updateProductStatus(adminVO.getProductId(), "D4539D86D99B43B68BCAF17EA011E67B");
                adminService.updateProductStatus(adminVO.getProductId(), rejectCode);

            }

            return ResponseEntity.ok("알림 및 상품 상태 업데이트 완료");

        } catch (Exception e) {

            // e.printStackTrace(); 보안 상 사용하면 안됨
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 실패");

        }
        
    }

    // 회원가입승인, 승인
    @PostMapping("/alarm/approve")
    public ResponseEntity<String> approveProduct(@RequestBody AdminVO adminVO) throws Exception {

        // System.out.println("[AdminController] approveProduct 호출");

        // 알림 코드
        String appCodeProduct = codeService.getApprovalAlarmCodeProduct();
        
        // 표시 코드
        String displayProduct = codeService.getDisplayProduct();

        // adminService.updateProductStatus(adminVO.getProductId(), "E79E6C1F58604795AD30CCDDD37115FF");
        // adminService.updateProductFlag(adminVO.getProductId(), "B57FCB1CA009426E9D3EF7FC335F7DCA");

        adminService.updateProductStatus(adminVO.getProductId(), appCodeProduct);
        adminService.updateProductFlag(adminVO.getProductId(), displayProduct);

        /* if (adminVO.getAlarmId() == null || adminVO.getAlarmId().isEmpty()) {

            adminVO.setAlarmId(UUID.randomUUID().toString());

        }  오라클에서 처리함 */

        // 알림 승인 코드
        String AlarmType = codeService.getApprovalAlarmCode();

        adminVO.setAlarmType(AlarmType);
        adminVO.setAlarmContent(" ");                              // DB에는 NULL을 넣지 않도록 수정(공백으로 수정)
        adminVO.setReceiverId("SYSTEM");                           // 관리자 UUID도 변경될 수 있으니 SYSTEM 고정
        adminVO.setCreatedId("SYSTEM");

//        adminVO.setAlarmType("011");
//        adminVO.setAlarmContent(null);
//        adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
//        adminVO.setCreatedId("SYSTEM");

        adminService.insertAlarm(adminVO);

        return ResponseEntity.ok("상품 승인 및 알림 전송 완료");
    }

    //상품관리 삭제버튼
    @PostMapping("/products/reject")
    public ResponseEntity<?> rejectProduct(@RequestBody List<String> productId) throws Exception {

        adminService.rejectProduct(productId);
        return ResponseEntity.ok().build();

    }

    //유저관리 삭제버튼
    @PostMapping("/member/reject")
    public ResponseEntity<?> rejectMember(@RequestBody List<String> memberId) throws Exception {

        adminService.rejectMember(memberId);
        return ResponseEntity.ok().build();

    }

    //신고관리 삭제버튼
    @PostMapping("/report/resolve")
    public ResponseEntity<String> resolveReport(@RequestBody List<String> productId) throws Exception {

        adminService.rejectProduct(productId); //재사용
        return ResponseEntity.ok().build();

    }

    //    회원가입 승인
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
