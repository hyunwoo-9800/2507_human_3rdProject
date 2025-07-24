package fs.human.yk2hyeong.common.code.service;

import fs.human.yk2hyeong.common.code.dao.CodeDAO;
import fs.human.yk2hyeong.common.code.vo.CodeVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

// 공통 코드 서비스 구현
@Service
public class CodeServiceImpl implements CodeService {

    @Autowired
    private CodeDAO codeDAO;

    // 은행명 조회
    @Override
    public List<CodeVO> getBankNameList() throws Exception {

        return codeDAO.getBankNameList();

    }

    // 회원 권한 목록
    @Override
    public List<CodeVO> getRoleList() throws Exception {

        return codeDAO.getRoleList();

    }

    // 미승인 회원 코드 조회
    @Override
    public String getRoleWithNoEntry() throws Exception {

        return codeDAO.getRoleWithNoEntry();

    }

    // 회원 상태 목록
    @Override
    public List<CodeVO> getMemberStatList() throws Exception {

        return codeDAO.getMemberStatList();

    }

    @Override
    public String getImageLowCodeValue() {

        return codeDAO.getImageLowCodeValue();

    }

    // 상품 부류 목록 조회
    @Override
    public List<CodeVO> getMidList() throws Exception {

        return codeDAO.getMidList();

    }

    // 상품 하위 목록 조회
    @Override
    public List<CodeVO> getLowList(String midCodeValue) throws Exception {

        return codeDAO.getLowList(midCodeValue);

    }

    // 알림 미승인 코드 조회
    @Override
    public String getRejectAlarmCode() throws Exception {

        return codeDAO.getRejectAlarmCode();

    }

    // 알림 승인 코드 조회
    @Override
    public String getApprovalAlarmCode() throws Exception {

        return codeDAO.getApprovalAlarmCode();

    }

    // 알림 상품 승인 코드 조회
    @Override
    public String getApprovalAlarmCodeProduct() throws Exception {

        return codeDAO.getApprovalAlarmCodeProduct();

    }

    // 상품 표시 코드 조회
    @Override
    public String getDisplayProduct() throws Exception {

        return codeDAO.getDisplayProduct();

    }

    // 상품 판매중지 코드 조회
    @Override
    public String getEndProduct() throws Exception {

        return codeDAO.getEndProduct();

    }

    // 상품 비표시 코드 조회
    @Override
    public String getNotDisplayProduct() throws Exception {

        return codeDAO.getNotDisplayProduct();

    }

    // 회원 탈퇴 코드 조회
    @Override
    public String getDeleteMemberCode() throws Exception {

        return codeDAO.getDeleteMemberCode();

    }

    // 상품 미승인 코드 조회
    @Override
    public String getDisProduct() throws Exception {

        return codeDAO.getDisProduct();

    }

    // 상품 판매 코드(예약/즉시) 조회
    @Override
    public String getProductCode1() throws Exception {

        return codeDAO.getProductCode1();

    }

    // 상품 판매 코드(즉시) 조회
    @Override
    public String getProductCode2() throws Exception {

        return codeDAO.getProductCode2();

    }

    // 상품 판매 코드(예약) 조회
    @Override
    public String getProductCode3() throws Exception {

        return codeDAO.getProductCode3();

    }

    @Override
    public String getLowCodeValueByLowCodeName(String lowCodeName) {
        return codeDAO.getLowCodeValueByLowCodeName(lowCodeName);
    }

}
