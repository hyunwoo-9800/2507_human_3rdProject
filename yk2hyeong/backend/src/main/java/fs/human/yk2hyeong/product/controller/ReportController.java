package fs.human.yk2hyeong.product.controller;

import fs.human.yk2hyeong.product.service.ReportService;
import fs.human.yk2hyeong.product.vo.ReportVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping("/report")
    public ResponseEntity<?> insertReport(@RequestBody ReportVO reportVO) {
        System.out.println("[Controller] reasonCode = " + reportVO.getReasonCode());
        reportService.insertReport(reportVO);
        return ResponseEntity.ok().build();
    }
} 