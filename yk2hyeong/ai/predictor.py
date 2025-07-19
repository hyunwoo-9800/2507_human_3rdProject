import pandas as pd
import numpy as np
import cx_Oracle
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import matplotlib.pyplot as plt
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

# 1. DB 연결
conn = cx_Oracle.connect("yh", "0000", cx_Oracle.makedsn("116.36.205.25", 1521, service_name="XEPDB1"))
cursor = conn.cursor()

# 2. 예측 대상 전체 불러오기 (DETAIL_CODE_ID 포함)
df = pd.read_sql("""
    SELECT RECORDED_DATE, RECORDED_UNIT_PRICE, DETAIL_CODE_ID
    FROM TB_PRICE_API_HISTORY
    ORDER BY DETAIL_CODE_ID, RECORDED_DATE
""", conn)

# 3. DETAIL_CODE_ID별로 예측 수행
for detail_code, group in df.groupby('DETAIL_CODE_ID'):
    group = group.dropna(subset=['RECORDED_UNIT_PRICE'])
    group['RECORDED_DATE'] = pd.to_datetime(group['RECORDED_DATE'])
    group.set_index('RECORDED_DATE', inplace=True)

    if len(group) < 1:
        print(f"[SKIP] {detail_code}: 데이터 부족 ({len(group)}개)")
        continue

    # 정규화
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(group['RECORDED_UNIT_PRICE'].values.reshape(-1, 1))

    # LSTM 입력 데이터 구성
    X, Y = [], []
    for i in range(60, len(scaled_data)):
        X.append(scaled_data[i-60:i, 0])
        Y.append(scaled_data[i, 0])
    X, Y = np.array(X), np.array(Y)
    X = X.reshape((X.shape[0], X.shape[1], 1))

    # LSTM 모델 구성 및 학습
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    model.add(LSTM(units=50))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, Y, epochs=10, batch_size=32, verbose=0)

    # 미래 365일 예측
    future_input = scaled_data[-60:].reshape(1, 60, 1)
    future_predictions = []

    for _ in range(365):
        pred = model.predict(future_input, verbose=0)
        future_predictions.append(pred[0, 0])
        pred_reshaped = pred.reshape(1, 1, 1)
        future_input = np.append(future_input[:, 1:, :], pred_reshaped, axis=1)

    # 역정규화
    future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

    # 날짜 생성
    last_date = group.index[-1]
    future_dates = [last_date + pd.Timedelta(days=i+1) for i in range(365)]

    # DB 저장
    for pred_date, pred_price in zip(future_dates, future_predictions):
        pred_price_float = float(pred_price[0])  # float32 → float 변환
        cursor.execute("""
            INSERT INTO TB_PRICE_PREDICTION 
            (PREDICTION_ID, DETAIL_CODE_ID, PREDICT_DATE, PREDICT_PRICE, PREDICTED_UNIT_PRICE, PREDICT_MODEL)
            VALUES (SYS_GUID(), :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, 'LSTM')
        """, (
            detail_code,
            pred_date.strftime('%Y-%m-%d'),
            pred_price_float,
            pred_price_float
        ))

    print(f"[DONE] {detail_code}: 365일 예측 저장 완료")

# 마무리
conn.commit()
cursor.close()
conn.close()
print("[FINISH] 모든 DETAIL_CODE_ID에 대한 예측 완료 및 저장 완료")
