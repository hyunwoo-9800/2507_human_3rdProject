package fs.human.yk2hyeong.chart.service;

import fs.human.yk2hyeong.chart.dao.chartDAO;
import fs.human.yk2hyeong.chart.vo.ChartVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChartServiceImpl implements ChartService {

    @Autowired
    chartDAO chartDAO;

    // 주간 데이터
    @Override
    public List<ChartVO> getUnitPriceWeek(String itemCode) throws Exception {

        List<ChartVO> actualPrices = chartDAO.getUnitPriceWeek(itemCode);

        List<ChartVO> predictedPrices  = chartDAO.getUnitPriceMonthPredictor(itemCode);

        List<ChartVO> chartData = new ArrayList<>();

        // 실측값과 예측값을 매핑
        for (int i = 0; i < actualPrices.size(); i++) {

            ChartVO chartVO = new ChartVO();

            chartVO.setRecordedDate(actualPrices.get(i).getRecordedDate());
            chartVO.setRecordedUnitPrice(actualPrices.get(i).getRecordedUnitPrice());
            chartVO.setPredictDate(predictedPrices.get(i).getPredictDate());
            chartVO.setPredictedUnitPrice(predictedPrices.get(i).getPredictedUnitPrice());

            chartData.add(chartVO); // 매핑된 데이터를 리스트에 추가
        }

        // 실측값과 예측값이 매핑된 리스트 반환
        return chartData;  // 여기서 chartData를 반환해야 함

    }

    // 월간 데이터
    @Override
    public List<ChartVO> getUnitPriceMonth(String itemCode) throws Exception {

        return chartDAO.getUnitPriceMonth(itemCode);

    }

    // 년간 데이터
    @Override
    public List<ChartVO> getUnitPriceYear(String itemCode) throws Exception {

        return chartDAO.getUnitPriceYear(itemCode);

    }

    // 주간 예측 데이터
    @Override
    public List<ChartVO> getUnitPriceWeekPredictor(String itemCode) throws Exception {

        return chartDAO.getUnitPriceWeekPredictor(itemCode);

    }

    // 월간 예측 데이터
    @Override
    public List<ChartVO> getUnitPriceMonthPredictor(String itemCode) throws Exception {

        return chartDAO.getUnitPriceMonthPredictor(itemCode);

    }

    // 년간 예측 데이터
    @Override
    public List<ChartVO> getUnitPriceYearPredictor(String itemCode) throws Exception {

        return chartDAO.getUnitPriceYearPredictor(itemCode);

    }

    // 시세 등락율
    @Override
    public List<ChartVO> dailyPriceDiff(Date yesterday, Date today) throws Exception {

        return chartDAO.dailyPriceDiff(yesterday, today);

    }

}
