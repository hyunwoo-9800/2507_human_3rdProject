from fastapi import FastAPI, HTTPException
import cx_Oracle
import pandas as pd
from prophet import Prophet
from datetime import datetime

from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정: 모든 도메인에서 접근 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처에서의 요청을 허용 (보안에 민감한 경우 특정 도메인만 설정 가능)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# Oracle DB 연결 설정
dsn = cx_Oracle.makedsn("116.36.205.25", 1521, service_name="XEPDB1")
conn = cx_Oracle.connect(user="yh", password="0000", dsn=dsn)


# DB에서 품목 코드 정보를 가져오는 함수
def get_grain_codes():
    query = """
            SELECT DISTINCT B.MID_CODE_VALUE, B.LOW_CODE_VALUE, B.LOW_CODE_NAME
            FROM TB_CODE_DETAIL B
            WHERE B.MID_CODE_VALUE IS NOT NULL \
              AND B.LOW_CODE_VALUE IS NOT NULL \
            """
    df = pd.read_sql(query, con=conn)
    grain_codes = {}
    for index, row in df.iterrows():
        # MID_CODE_VALUE를 key로 사용, LOW_CODE_VALUE와 LOW_CODE_NAME을 value로 사용
        grain_codes[row['LOW_CODE_NAME'].lower()] = {
            "mid_code_value": row["MID_CODE_VALUE"],
            "low_code_value": row["LOW_CODE_VALUE"]
        }
    return grain_codes


# 품목 코드 가져오기
grain_codes = get_grain_codes()


@app.get("/forecast")
def get_forecast(grain: str):
    # if grain not in grain_codes:
    #     raise HTTPException(status_code=400, detail="알 수 없는 품목입니다.")
    #
    # mid_code_value = grain_codes[grain]["mid_code_value"]
    # low_code_value = grain_codes[grain]["low_code_value"]

    query = """
            SELECT A.RECORDED_DATE, \
                   A.RECORDED_UNIT_PRICE
            FROM TB_PRICE_API_HISTORY A
                     LEFT JOIN TB_CODE_DETAIL B
                               ON A.DETAIL_CODE_ID = B.LOW_CODE_VALUE
            WHERE B.MID_CODE_VALUE = :mid_code_value
              AND B.LOW_CODE_VALUE = :low_code_value
              AND A.RECORDED_UNIT_PRICE IS NOT NULL
              AND A.RECORDED_DATE BETWEEN TO_DATE(:start_date, 'YYYY-MM-DD') AND TO_DATE(:end_date, 'YYYY-MM-DD')
            ORDER BY RECORDED_DATE \
            """

    df = pd.read_sql(query, con=conn, params={"mid_code_value": '100', "low_code_value": '111'})

    if df.empty:
        raise HTTPException(status_code=404, detail="시세 데이터가 없습니다.")

    df.rename(columns={"RECORDED_DATE": "ds", "RECORDED_UNIT_PRICE": "y"}, inplace=True)

    model = Prophet()
    model.fit(df)

    future_dates = model.make_future_dataframe(df, periods=90)
    forecast = model.predict(future_dates)

    forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    forecast_data.rename(columns={
        "ds": "날짜",
        "yhat": "예측 값",
        "yhat_lower": "하한 예측값",
        "yhat_upper": "상한 예측값"
    }, inplace=True)

    conn.close()

    return {"forecast": forecast_data.to_dict(orient="records")}
