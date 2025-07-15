package fs.human.yk2hyeong.chart.service;

import fs.human.yk2hyeong.chart.vo.ChartVO;

import java.util.List;

public interface ChartService {

    List<ChartVO> getUnitPriceWeek(String itemCode) throws Exception;

    List<ChartVO> getUnitPriceMonth(String itemCode) throws Exception;

    List<ChartVO> getUnitPriceYear(String itemCode) throws Exception;

}
