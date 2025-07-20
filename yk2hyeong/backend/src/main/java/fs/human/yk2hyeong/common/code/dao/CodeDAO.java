package fs.human.yk2hyeong.common.code.dao;

import fs.human.yk2hyeong.common.code.vo.CodeVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

import java.util.List;

// 공통 코드 매퍼
@Mapper
public interface CodeDAO {

    // 은행 목록
    List<CodeVO> getBankNameList() throws DataAccessException;
    
    // 회원 권한 목록
    List<CodeVO> getRoleList() throws DataAccessException;

    // 미승인 권한 코드 조회
    String getRoleWithNoEntry() throws DataAccessException;

    // 회원 상태 목록
    List<CodeVO> getMemberStatList() throws DataAccessException;
   
    String getImageLowCodeValue();

    // 상품 부류 목록 조회
    List<CodeVO> getMidList() throws DataAccessException;

    // 상품 하위 목록 조회
    List<CodeVO> getLowList(String midCodeValue) throws DataAccessException;

    // 알림 회원 미승인 코드 조회
    String getRejectAlarmCode() throws DataAccessException;

    // 알림 회원 승인 코드 조회
    String getApprovalAlarmCode() throws DataAccessException;    // 알림 승인 코드 조회

    // 알림 상품 승인 코드 조회
    String getApprovalAlarmCodeProduct() throws DataAccessException;

    // 상품 표시 코드 조회
    String getDisplayProduct() throws DataAccessException;

    //  상품 판매중지 코드 조회
    String getEndProduct() throws DataAccessException;

    // 상품 비표시 코드 조회
    String getNotDisplayProduct() throws DataAccessException;

    // 회원 탈퇴 코드 조회
    String getDeleteMemberCode() throws DataAccessException;

    // 상품 미승인 코드 조회
    String getDisProduct() throws DataAccessException;

    // 상품 판매 코드(예약/즉시) 조회
    String getProductCode1() throws DataAccessException;

    // 상품 판매 코드(즉시) 조회
    String getProductCode2() throws DataAccessException;

    // 상품 판매 코드(예약) 조회
    String getProductCode3() throws DataAccessException;

}
