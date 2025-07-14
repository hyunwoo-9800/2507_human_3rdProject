package fs.human.yk2hyeong.admin.controller;

import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.admin.vo.AdminVO;
import fs.human.yk2hyeong.product.vo.ProductImageVO;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/{productId}/images")
    @ResponseBody
    public List<ProductImageVO> getProductImages(@PathVariable String productId) {
        return adminService.getProductImages(productId);
    }
}
