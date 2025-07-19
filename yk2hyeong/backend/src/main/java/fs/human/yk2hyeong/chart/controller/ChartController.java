package fs.human.yk2hyeong.chart.controller;

import fs.human.yk2hyeong.chart.service.ChartService;
import fs.human.yk2hyeong.chart.vo.ChartVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
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

    @GetMapping("/price/dailyPriceDiff")
    public ResponseEntity<?> getDailyPriceDiff() throws Exception {

        LocalDate now = LocalDate.now();
        DayOfWeek day = now.getDayOfWeek();

        LocalDate localToday;
        LocalDate localYesterday;

        switch (day) {

            // 토요일
            case SATURDAY -> {
                localToday = now.minusDays(1);       // 금요일
                localYesterday = now.minusDays(2);   // 목요일
            }

            // 일요일
            case SUNDAY -> {
                localToday = now.minusDays(2);       // 금요일
                localYesterday = now.minusDays(3);   // 목요일
            }

            default -> {
                localToday = now.minusDays(1);
                localYesterday = now.minusDays(2);
            }

        }

        Date today = Date.valueOf(localToday);
        Date yesterday = Date.valueOf(localYesterday);

        List<ChartVO> diffList = chartService.dailyPriceDiff(yesterday, today);

        return ResponseEntity.ok(diffList);

    }

}