package fs.human.yk2hyeong.chart.controller;

import fs.human.yk2hyeong.chart.service.ChartService;
import fs.human.yk2hyeong.chart.vo.ChartVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chart")
@RequiredArgsConstructor
public class ChartController {

    private final ChartService chartService;

    @GetMapping("/price/past")
    public ResponseEntity<List<ChartVO>> getPastPrice(
            @RequestParam String detailCodeId,
            @RequestParam String timeFrame // 예: "week", "month", "year"
    ) throws Exception {

        List<ChartVO> result;

        switch (timeFrame) {
            case "week":
                result = chartService.getUnitPriceWeek(detailCodeId);
                break;
            case "month":
                result = chartService.getUnitPriceMonth(detailCodeId);
                break;
            case "year":
                result = chartService.getUnitPriceYear(detailCodeId);
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/price/future")
    public ResponseEntity<List<ChartVO>> getFuturePrice(
            @RequestParam String detailCodeId,
            @RequestParam String timeFrame // 예: "week", "month", "year"
    ) throws Exception {

        List<ChartVO> result;

        switch (timeFrame) {
            case "week":
                result = chartService.getUnitPriceWeekPredictor(detailCodeId);
                break;
            case "month":
                result = chartService.getUnitPriceMonthPredictor(detailCodeId);
                break;
            case "year":
                result = chartService.getUnitPriceYearPredictor(detailCodeId);
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(result);
    }

}