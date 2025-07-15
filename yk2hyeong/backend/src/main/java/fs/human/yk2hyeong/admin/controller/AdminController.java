package fs.human.yk2hyeong.admin.controller;

import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// 관리자 페이지 컨트롤러
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/product/pending")
    public List<ProductVO> getPendingProduct() {


        System.out.println("[AdminController] getPendingProduct() 호출됨");
        return adminService.getPendingProduct();
    }
    @GetMapping("/member/pending")
    public List<AdminVO> getPendingMember() {
        System.out.println("[AdminController] getPendingMember() 호출됨");
        return adminService.getPendingMember();
    }
    @GetMapping("/report")
    public List<AdminVO> getReport() {
        System.out.println("[AdminController] getReport() 호출됨");
        return adminService.getReport();
    }
    @GetMapping("/member")
    public List<AdminVO> getMember() {
        System.out.println("[AdminController] getMember() 호출됨");
        return adminService.getMember();
    }

    //상품이미지 불러오기
    @GetMapping("/product/{productId}/images")
    @ResponseBody
    public List<ProductImageVO> getProductImages(@PathVariable String productId) {
        return adminService.getProductImages(productId);
    }

//    게시글 삭제
    @PostMapping("/member/delete")
    public void deleteMember(@RequestParam List<String> memberId) {
        adminService.deleteMember(memberId);
    }
    @PostMapping("/report/delete")
    public void deleteReport(@RequestParam List<String> reportId) {
        adminService.deleteReport(reportId);
    }

//    회원가입승인/거부
@PostMapping("/alarm/reject")
public ResponseEntity<String> insertAlarm(@RequestBody AdminVO adminVO) {
    System.out.println("[AdminController] insertAlarm 호출");
    try {
        adminVO.setAlarmId(UUID.randomUUID().toString());

        if (adminVO.getReceiverId() == null) {
            adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
        }
        if (adminVO.getCreatedId() == null) {
            adminVO.setCreatedId("SYSTEM");
        }

        // 알림 등록
        adminService.insertAlarm(adminVO);

        // 상태 업데이트 (거부: D4539D86D99B43B68BCAF17EA011E67B)
        if (adminVO.getProductId() != null && !adminVO.getProductId().isEmpty()) {
            adminService.updateProductStatus(adminVO.getProductId(), "D4539D86D99B43B68BCAF17EA011E67B");
        }

        return ResponseEntity.ok("알림 및 상품 상태 업데이트 완료");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 실패");
    }
}
//회원가입승인 / 승인
@PostMapping("/alarm/approve")
public ResponseEntity<String> approveProduct(@RequestBody AdminVO adminVO) {
    System.out.println("[AdminController] approveProduct 호출");
    adminService.updateProductStatus(adminVO.getProductId(), "EFA81F6A88A34960AC41EEA075469128");
    adminService.updateProductFlag(adminVO.getProductId(), "B57FCB1CA009426E9D3EF7FC335F7DCA");

    if (adminVO.getAlarmId() == null || adminVO.getAlarmId().isEmpty()) {
        adminVO.setAlarmId(UUID.randomUUID().toString());
    }
    adminVO.setAlarmType("011");
    adminVO.setAlarmContent(null);
    adminVO.setReceiverId("29E46778F8E3430D9C560B84E4861786");
    adminVO.setCreatedId("SYSTEM");

    adminService.insertAlarm(adminVO);

    return ResponseEntity.ok("상품 승인 및 알림 전송 완료");
}



}
