package fs.human.yk2hyeong.chart.dao;

import fs.human.yk2hyeong.chart.vo.ChartVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import java.sql.Date;
import java.util.List;

// 시세 데이터 매퍼
@Mapper
public interface chartDAO {

    // 주간 데이터
    List<ChartVO> getUnitPriceWeek(String itemCode) throws DataAccessException;

    // 월간 데이터
    List<ChartVO> getUnitPriceMonth(String itemCode) throws DataAccessException;

    // 년간 데이터
    List<ChartVO> getUnitPriceYear(String itemCode) throws DataAccessException;

    // 주간 예측 데이터
    List<ChartVO> getUnitPriceWeekPredictor(String itemCode) throws DataAccessException;

    // 월간 예측 데이터
    List<ChartVO> getUnitPriceMonthPredictor(String itemCode) throws DataAccessException;

    // 년간 예측 데이터
    List<ChartVO> getUnitPriceYearPredictor(String itemCode) throws DataAccessException;

    // 시세 등략율
    List<ChartVO> dailyPriceDiff(@Param("yesterday") Date yesterday,
                                 @Param("today") Date today) throws DataAccessException;

}
