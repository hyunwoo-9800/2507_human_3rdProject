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

}
