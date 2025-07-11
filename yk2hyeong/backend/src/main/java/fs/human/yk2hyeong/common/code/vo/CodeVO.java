package fs.human.yk2hyeong.common.code.vo;

import lombok.Data;

import java.sql.Date;

// 공통 코드 VO
@Data
public class CodeVO {

    private String detailCodeId;    // 상세 코드 고유 ID (UUID)
    private String codeId;          // 상위 코드 ID (TB_CODE.CODE_ID 참조)
    private String midCodeValue;    // 중위 코드 값 (코드 그룹 중간단계)
    private String midCodeName;     // 중위 코드 명 (중간단계 이름)
    private String lowCodeValue;    // 하위 코드 값
    private String lowCodeName;     // 하위 코드 명 (코드 그룹 내 실제 표시명)

    int sortOrder;                  // 정렬 순서

    private String createdId;       // 등록자 ID (로그인 사용자 ID)
    private Date createdDate;       // 등록일시 (기본값 SYSDATE)
    private String updatedId;       // 수정자 ID (로그인 사용자 ID)
    private Date updatedDate;       // 수정일시 (기본값 SYSDATE)

}
