import pandas as pd
from sqlalchemy import create_engine, text
import os
from datetime import date, timedelta

# DB 연결
engine = create_engine("oracle+cx_oracle://yh:0000@116.36.205.25:1521/?service_name=XEPDB1")

# 기간별 시작일 계산
def get_start_date(time_frame):
    today = date.today()
    if time_frame == "week":
        return today - timedelta(days=7)
    elif time_frame == "month":
        return today - timedelta(days=30)
    elif time_frame == "year":
        return today - timedelta(days=365 * 5)
    else:
        return today - timedelta(days=365 * 10)

# 엑셀 리포트 생성 함수
def generate_excel_report(low_code_value, time_frame):
    today_str = date.today().strftime('%Y%m%d')
    start_date = get_start_date(time_frame)

    with engine.connect() as conn:
        # 품목명 조회
        result = conn.execute(
            text("SELECT LOW_CODE_NAME FROM TB_CODE_DETAIL WHERE LOW_CODE_VALUE = :low_code_value"),
            {"low_code_value": low_code_value}
        )
        row = result.fetchone()
        product_name = row[0] if row else f"코드{low_code_value}"
        safe_name = product_name.replace('/', '_').replace('\\', '_')

        # 파일명 설정
        filename = f"시세리포트({safe_name})_{time_frame}_{today_str}.xlsx"
        filepath = os.path.join("reports", filename)
        os.makedirs("reports", exist_ok=True)

        # 1. 과거 시세
        df_past = pd.read_sql(f"""
            SELECT TO_CHAR(RECORDED_DATE, 'YYYY-MM-DD') AS 날짜,
                   ROUND(AVG(RECORDED_UNIT_PRICE), 2) AS 단가
            FROM TB_PRICE_API_HISTORY
            WHERE LOW_CODE_VALUE = :low_code_value
              AND RECORDED_DATE >= TO_DATE(:start_date, 'YYYY-MM-DD')
            GROUP BY TO_CHAR(RECORDED_DATE, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(RECORDED_DATE, 'YYYY-MM-DD')
        """, conn, params={
            "low_code_value": low_code_value,
            "start_date": start_date.strftime('%Y-%m-%d')
        })

        # 2. 예측 시세
        df_pred = pd.read_sql("""
            SELECT TO_CHAR(PREDICT_DATE, 'YYYY-MM-DD') AS 날짜, PREDICTED_UNIT_PRICE AS "예측단가"
            FROM TB_PRICE_PREDICTION
            WHERE LOW_CODE_VALUE = :low_code_value
            ORDER BY PREDICT_DATE
        """, conn, params={"low_code_value": low_code_value})

        # 3. 등락률
        recent_dates = pd.read_sql("""
            SELECT DISTINCT TRUNC(RECORDED_DATE) AS dt
            FROM TB_PRICE_API_HISTORY
            ORDER BY dt DESC
            FETCH FIRST 2 ROWS ONLY
        """, conn)

        if len(recent_dates) < 2:
            print("등락률 계산 불가: 시세 날짜 부족")
            df_diff = pd.DataFrame([{
                "품목명": "-", "어제가격": "-", "오늘가격": "-", "가격차이": "-",
                "등락률": "-", "최근3년평균": "-", "품목수": "-"
            }])
        else:
            today = recent_dates.loc[0, 'dt']
            yesterday = recent_dates.loc[1, 'dt']

            df_diff = pd.read_sql(text("""
                SELECT
                    C.LOW_CODE_NAME AS 품목명,
                    ROUND(AVG(A.RECORDED_UNIT_PRICE), 2) AS 어제가격,
                    ROUND(AVG(B.RECORDED_UNIT_PRICE), 2) AS 오늘가격,
                    ROUND(AVG(B.RECORDED_UNIT_PRICE) - AVG(A.RECORDED_UNIT_PRICE), 2) AS 가격차이,
                    ROUND(
                        CASE
                            WHEN AVG(A.RECORDED_UNIT_PRICE) = 0 THEN 0
                            ELSE (AVG(B.RECORDED_UNIT_PRICE) - AVG(A.RECORDED_UNIT_PRICE)) / AVG(A.RECORDED_UNIT_PRICE) * 100
                        END, 2
                    ) AS 등락률,
                    F.YEAR_AVG AS 최근3년평균,
                    COUNT(E.PRODUCT_ID) AS 품목수
                FROM
                    TB_PRICE_API_HISTORY A
                    LEFT JOIN TB_PRICE_API_HISTORY B
                        ON A.LOW_CODE_VALUE = B.LOW_CODE_VALUE
                    LEFT JOIN TB_CODE_DETAIL C
                        ON A.LOW_CODE_VALUE = C.LOW_CODE_VALUE
                    LEFT JOIN TB_CODE D
                        ON C.CODE_ID = D.CODE_ID
                    LEFT JOIN TB_PRODUCT E
                        ON C.DETAIL_CODE_ID = E.PRODUCT_CODE
                    LEFT JOIN (
                        SELECT
                            H.LOW_CODE_VALUE,
                            AVG(H.RECORDED_UNIT_PRICE) AS YEAR_AVG
                        FROM
                            TB_PRICE_API_HISTORY H
                        WHERE
                            TO_CHAR(H.RECORDED_DATE, 'MM-DD') = TO_CHAR(SYSDATE, 'MM-DD')
                            AND H.RECORDED_DATE BETWEEN ADD_MONTHS(SYSDATE, -36) AND SYSDATE
                        GROUP BY
                            H.LOW_CODE_VALUE
                    ) F ON A.LOW_CODE_VALUE = F.LOW_CODE_VALUE
                WHERE
                    TRUNC(A.RECORDED_DATE) = TO_DATE(:yesterday, 'YYYY-MM-DD')
                    AND TRUNC(B.RECORDED_DATE) = TO_DATE(:today, 'YYYY-MM-DD')
                    AND D.TOP_CODE_NAME = 'CAT'
                    AND E.PRODUCT_UNIT_PRICE <> 0
                    AND A.RECORDED_UNIT_PRICE <> 0
                    AND B.RECORDED_UNIT_PRICE <> 0
                GROUP BY
                    C.LOW_CODE_NAME, F.YEAR_AVG
                ORDER BY 품목수 DESC
            """), conn, params={
                "today": today.strftime('%Y-%m-%d'),
                "yesterday": yesterday.strftime('%Y-%m-%d')
            })

    # 엑셀 저장
    with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
        df_past.to_excel(writer, sheet_name=f"{safe_name}_과거 시세", index=False)
        df_pred.to_excel(writer, sheet_name=f"{safe_name}_예측 시세", index=False)
        df_diff.to_excel(writer, sheet_name="전체 등락률", index=False)

    return filepath
