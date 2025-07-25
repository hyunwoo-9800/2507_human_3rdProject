package fs.human.yk2hyeong.product.service;

import fs.human.yk2hyeong.product.dao.ReportDAO;
import fs.human.yk2hyeong.product.vo.ReportVO;
import fs.human.yk2hyeong.common.code.service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportServiceImpl implements ReportService {
    @Autowired
    private ReportDAO reportDAO;
    @Autowired
    private CodeService codeService;

    @Override
    public void insertReport(ReportVO reportVO) {
        // 신고사유명 → 코드값 매핑
//        if (reportVO.getReasonName() != null && !reportVO.getReasonName().isEmpty()) {
//            String codeValue = codeService.getLowCodeValueByLowCodeName(reportVO.getReasonName());
//            reportVO.setReasonCode(codeValue);
        // reasonCode가 null인 경우에만 codeService 호출
        if ((reportVO.getReasonCode() == null || reportVO.getReasonCode().isEmpty())
                && reportVO.getReasonName() != null && !reportVO.getReasonName().isEmpty()) {

            String codeValue = codeService.getLowCodeValueByLowCodeName(reportVO.getReasonName());
            System.out.println("매핑된 codeValue = " + codeValue);
            reportVO.setReasonCode(codeValue);
        }
        reportDAO.insertReport(reportVO);
    }
} 