package fs.human.yk2hyeong.admin.controller;

import fs.human.yk2hyeong.admin.service.AdminService;
import fs.human.yk2hyeong.product.vo.ProductVO;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 관리자 페이지 컨트롤러
@RestController
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/api/product/pending")
    public List<ProductVO> getPendingProduct() {
        return adminService.getPendingProduct();
    }
}
