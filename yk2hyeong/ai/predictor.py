import pandas as pd
import numpy as np
import cx_Oracle
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import matplotlib.pyplot as plt

# DB 연결 설정
conn = cx_Oracle.connect("yh", "0000", cx_Oracle.makedsn("116.36.205.25", 1521, service_name="XEPDB1"))

# 데이터 불러오기 (과거 시세 데이터)
df = pd.read_sql("SELECT RECORDED_DATE, RECORDED_UNIT_PRICE FROM TB_PRICE_API_HISTORY ORDER BY RECORDED_DATE", conn)

# 시계열 데이터로 처리
df['RECORDED_DATE'] = pd.to_datetime(df['RECORDED_DATE'])
df.set_index('RECORDED_DATE', inplace=True)

# 데이터 정규화 (0~1 범위로 변환)
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(df['RECORDED_UNIT_PRICE'].values.reshape(-1, 1))

# 데이터 준비 (LSTM 모델에 맞는 형태로 변환)
X = []
Y = []

# 전체 기간에 대해 예측 (60일 이상부터 예측 시작)
for i in range(len(scaled_data)):  # 전체 데이터를 사용
    if i >= 60:  # 60일 이상부터 예측 시작
        X.append(scaled_data[i-60:i, 0])  # 60일 이전부터 현재까지 데이터
        Y.append(scaled_data[i, 0])  # 예측하려는 가격

X, Y = np.array(X), np.array(Y)

# LSTM 모델 구성
model = Sequential()
model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)))
model.add(LSTM(units=50, return_sequences=False))
model.add(Dense(units=1))  # 예측 가격 1개 출력

# 모델 컴파일 및 훈련
model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X, Y, epochs=10, batch_size=32)

# 예측
predicted_prices = model.predict(X)

# 예측된 가격을 원래 스케일로 되돌리기
predicted_prices = scaler.inverse_transform(predicted_prices)

# 예측값 DB에 저장
cursor = conn.cursor()

# 현재 날짜를 기준으로 예측값을 저장
for i, pred_price in enumerate(predicted_prices):
    predicted_date = df.index[-len(predicted_prices) + i]
    
    # float32 -> float로 변환 (cx_Oracle에서 문제가 발생하지 않도록)
    pred_price_float = float(pred_price[0])  # 예측된 가격을 float으로 변환

    # 예측값을 DB에 저장
    cursor.execute("""
        INSERT INTO TB_PRICE_PREDICTION (PREDICTION_ID, DETAIL_CODE_ID, PREDICT_DATE, PREDICT_PRICE, PREDICTED_UNIT_PRICE, PREDICT_MODEL)
        VALUES (SYS_GUID(), :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, 'LSTM')
    """, ('111', predicted_date.strftime('%Y-%m-%d'), pred_price_float, pred_price_float))  # 예측 값 저장

# DB 커밋
conn.commit()

# DB 연결 종료
cursor.close()
conn.close()

print("[INFO] 예측값이 TB_PRICE_PREDICTION 테이블에 저장되었습니다.")

# 예측 결과 시각화
plt.plot(df.index[-len(Y):], Y, color='blue', label='Actual Price')
plt.plot(df.index[-len(predicted_prices):] + pd.Timedelta(days=1), predicted_prices, color='red', label='Predicted Price')
plt.legend()
plt.show()
