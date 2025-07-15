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

    // 상품 하위 목록 조회
    @Override
    public List<CodeVO> getItemsByCategory(String midCode) throws DataAccessException {

        return codeDAO.getItemsByCategory(midCode);

    }
}
