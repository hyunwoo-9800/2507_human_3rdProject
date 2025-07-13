package fs.human.yk2hyeong.common.code.service;

import fs.human.yk2hyeong.common.code.vo.CodeVO;

import java.util.List;

// 공통 코드 서비스 인터페이스
public interface CodeService {

    // 은행 목록
    List<CodeVO> getBankNameList() throws Exception;
    
    // 회원 권한 목록
    List<CodeVO> getRoleList() throws Exception;
    
    // 미승인 권한 코드 조회
    String getRoleWithNoEntry() throws Exception;
    
    // 회원 상태 목록
    List<CodeVO> getMemberStatList() throws Exception;

    String getImageLowCodeValue() throws Exception;

}
