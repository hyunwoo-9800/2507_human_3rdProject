import cx_Oracle
import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
from matplotlib import font_manager
import datetime

# 한글 폰트 설정
font_path = "C:/Windows/Fonts/malgun.ttf"
font_prop = font_manager.FontProperties(fname=font_path)

# 1. Oracle DB 연결
dsn = cx_Oracle.makedsn("116.36.205.25", 1521, service_name="XEPDB1")
conn = cx_Oracle.connect(user="yh", password="0000", dsn=dsn)

# 2. 시세 데이터 조회 (예: 메밀)
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

params = {
    'mid_code_value': '100',  # 식량작물
    'low_code_value': '111',  # 쌀 (메밀이면 '144')
    'start_date': '2020-01-01',
    'end_date': '2025-07-11'
}

df = pd.read_sql(query, con=conn, params=params)
conn.close()

# 데이터 출력 확인
print(df.head())
print(df.info())

# 예측할 수 있는 데이터가 부족하면 종료
if df.empty or df['RECORDED_UNIT_PRICE'].dropna().shape[0] < 2:
    print("⚠️ 예측할 수 있는 데이터가 부족합니다.")
    exit()

# 3. Prophet이 요구하는 컬럼명으로 변경
df.rename(columns={"RECORDED_DATE": "ds", "RECORDED_UNIT_PRICE": "y"}, inplace=True)

# 4. Prophet 모델 학습
model = Prophet()
model.fit(df)

# 5. 미래 날짜 생성 (90일 예측)
future_dates = model.make_future_dataframe(periods=90)

# 6. 예측 결과
forecast = model.predict(future_dates)

# 예측 데이터에서 필요한 컬럼만 선택
forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]  # 예측값만 추출

# 예측 데이터를 한글로 이름 변경
forecast_data.rename(columns={
    "ds": "날짜",
    "yhat": "예측 값",
    "yhat_lower": "하한 예측값",
    "yhat_upper": "상한 예측값"
}, inplace=True)

# 7. 오늘 날짜 기준으로 과거 데이터와 미래 데이터 나누기
today = datetime.date.today()

# 과거 데이터: 오늘 이전의 데이터만
historical_data = df[df['ds'] < str(today)][['ds', 'y']]  # 'ds'는 날짜, 'y'는 실제 가격

historical_data.rename(columns={
    "ds": "날짜",
    "y": "실제 가격"
}, inplace=True)

# 미래 데이터: 오늘 이후의 데이터만
forecast_data_future = forecast_data[forecast_data['날짜'] > str(today)]

# 8. 엑셀로 결과 저장 (두 개의 시트)
with pd.ExcelWriter('forecast_result_with_actual_and_forecast.xlsx') as writer:
    # 과거 시세만 저장
    historical_data.to_excel(writer, sheet_name='과거 시세', index=False)

    # 미래 예측 시세만 저장
    forecast_data_future.to_excel(writer, sheet_name='미래 예측 시세', index=False)

# 9. 그래프 시각화 (실제 가격 + 예측값)
plt.figure(figsize=(10, 6))
plt.plot(df['ds'], df['y'], label='과거 시세', color='blue')  # 실제 시세 (과거)
plt.plot(forecast['ds'], forecast['yhat'], label='예측 시세', color='red')  # 예측 시세 (미래)

# 제목과 레이블 설정
plt.title("메밀 시세 추세 및 예측", fontproperties=font_prop)
plt.xlabel("날짜", fontproperties=font_prop)
plt.ylabel("1kg당 가격 (원)", fontproperties=font_prop)
plt.grid(True)
plt.legend()  # 범례 추가
plt.show()
