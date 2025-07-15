package fs.human.yk2hyeong.chart.service;

import fs.human.yk2hyeong.chart.dao.chartDAO;
import fs.human.yk2hyeong.chart.vo.ChartVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChartServiceImpl implements ChartService {

    @Autowired
    chartDAO chartDAO;

    @Override
    public List<ChartVO> getUnitPriceWeek(String itemCode) throws Exception {

        return chartDAO.getUnitPriceWeek(itemCode);

    }

    @Override
    public List<ChartVO> getUnitPriceMonth(String itemCode) throws Exception {

        return chartDAO.getUnitPriceMonth(itemCode);

    }

    @Override
    public List<ChartVO> getUnitPriceYear(String itemCode) throws Exception {

        return chartDAO.getUnitPriceYear(itemCode);

    }

}
