package fs.human.yk2hyeong.product.dao;

import fs.human.yk2hyeong.product.vo.ReportVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReportDAO {
    void insertReport(ReportVO reportVO);
} 