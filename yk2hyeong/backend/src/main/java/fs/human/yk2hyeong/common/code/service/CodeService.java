package fs.human.yk2hyeong.common.code.service;

import fs.human.yk2hyeong.common.code.vo.CodeVO;
import org.springframework.dao.DataAccessException;

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

    // 상품 부류 목록 조회
    List<CodeVO> getMidList() throws Exception;
    
    // 상품 하위 목록 조회
    List<CodeVO> getLowList(String midCodeValue) throws Exception;

    // 알림 미승인 코드 조회
    String getRejectAlarmCode() throws Exception;

    // 알림 승인 코드 조회
    String getApprovalAlarmCode() throws Exception;

    // 알림 상품 승인 코드 조회
    String getApprovalAlarmCodeProduct() throws Exception;

    // 상품 표시 코드 조회
    String getDisplayProduct() throws Exception;

    //  상품 판매중지 코드 조회
    String getEndProduct() throws Exception;

    // 상품 비표시 코드 조회
    String getNotDisplayProduct() throws Exception;

    // 회원 탈퇴 코드 조회
    String getDeleteMemberCode() throws Exception;

    // 상품 미승인 코드 조회
    String getDisProduct() throws Exception;

    // 상품 판매 코드(예약/즉시) 조회
    String getProductCode1() throws Exception;

    // 상품 판매 코드(즉시) 조회
    String getProductCode2() throws Exception;

    // 상품 판매 코드(예약) 조회
    String getProductCode3() throws Exception;

}
