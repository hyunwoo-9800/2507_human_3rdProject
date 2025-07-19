package fs.human.yk2hyeong.chart.service;

import fs.human.yk2hyeong.chart.vo.ChartVO;

import java.sql.Date;
import java.util.List;

public interface ChartService {

    // 주간 데이터
    List<ChartVO> getUnitPriceWeek(String itemCode) throws Exception;

    // 월간 데이터
    List<ChartVO> getUnitPriceMonth(String itemCode) throws Exception;

    // 년간 데이터
    List<ChartVO> getUnitPriceYear(String itemCode) throws Exception;

    // 주간 예측 데이터
    List<ChartVO> getUnitPriceWeekPredictor(String itemCode) throws Exception;

    // 월간 예측 데이터
    List<ChartVO> getUnitPriceMonthPredictor(String itemCode) throws Exception;

    // 년간 예측 데이터
    List<ChartVO> getUnitPriceYearPredictor(String itemCode) throws Exception;

    // 시세 등략율
    List<ChartVO> dailyPriceDiff(Date yesterday, Date today) throws Exception;

}
