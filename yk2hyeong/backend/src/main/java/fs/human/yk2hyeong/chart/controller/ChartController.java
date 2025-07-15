package fs.human.yk2hyeong.chart.controller;

import fs.human.yk2hyeong.chart.service.ChartService;
import fs.human.yk2hyeong.common.code.service.CodeService;
import fs.human.yk2hyeong.common.code.vo.CodeVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chart")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

    private final CodeService codeService;

    // 부류 코드에 해당하는 품목 코드 목록 반환
    @GetMapping("/items")
    public ResponseEntity<List<CodeVO>> getItemsByCategory(@RequestParam String midCode) {

        // categoryCode에 해당하는 품목 코드 목록을 DB에서 가져옴
        List<CodeVO> items = codeService.getItemsByCategory(midCode);
        return ResponseEntity.ok(items);

    }

    @GetMapping
    public ResponseEntity<?> getChartDat(@RequestParam String timeFrame, @RequestParam(required = false) String itemCode) throws Exception {

        switch (timeFrame) {

            case "week":
                return ResponseEntity.ok(chartService.getUnitPriceWeek(itemCode));

            case "month":
                return ResponseEntity.ok(chartService.getUnitPriceMonth(itemCode));

            case "year":
                return ResponseEntity.ok(chartService.getUnitPriceYear(itemCode));

            default:
                return ResponseEntity.badRequest().body("Invalid timeFrame");

        }

    }

}