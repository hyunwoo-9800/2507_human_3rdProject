package fs.human.yk2hyeong.chart.vo;

import lombok.Data;

import java.sql.Date;

@Data
public class ChartVO {

    private String historyPriceId;  // 시세 이력 고유 ID (UUID)
    private String detailCodeId;    // 상품 상세 코드 ID (TB_CODE_DETAIL.DETAIL_CODE_ID 참조)
    private int recordedPrice;      // 기록된 시세 (원 단위)
    private Date recordedDate;      // 시세 기록 일시
    private int recordedUnit;       // 팔린 수량 단위 (예: 8kg, 10kg 등)
    private int recordedUnitPrice;  // 1kg당 단가 (원/1kg)

    // 데이터를 출력하기 위한 용도
    private String midCodeValue;    // 중위 코드 값 (코드 그룹 중간단계)
    private String midCodeName;     // 중위 코드 명 (중간단계 이름)
    private String lowCodeValue;    // 하위 코드 값
    private String lowCodeName;     // 하위 코드 명 (코드 그룹 내 실제 표시명)
    
    // 예측 데이터 저장용
    private int predictedUnitPrice;      // 예측 시세
    private Date predictDate;           //  예측 날짜

    private String createdId;       // 등록자 ID (로그인 사용자 ID)
    private Date createdDate;       // 등록일시 (기본값 SYSDATE)
    private String updatedId;       // 수정자 ID (로그인 사용자 ID)
    private Date  updatedDate;      // 수정일시 (기본값 SYSDATE)
}
