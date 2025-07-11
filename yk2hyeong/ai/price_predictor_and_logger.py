import requests
import cx_Oracle
import datetime
import uuid

# 인증 정보
CERT_KEY = "9e32fc12-8533-4883-b970-b45b3599316a"
CERT_ID = "5956"

# DB 연결 정보
DB_DSN = cx_Oracle.makedsn("116.36.205.25", 1521, service_name="XEPDB1")
DB_USER = "yh"
DB_PASS = "0000"

# KAMIS API 설정
PRODUCT_CLS_CODE = "02"  # 도매
ITEM_CATEGORY_CODES = ["100", "200", "300", "400"]  # 식량, 채소, 특용, 과일

def fetch_and_insert(date_str):
    print(f"\n[{date_str}] 데이터 수집 중...")
    try:
        # DB 연결을 함수 내에서 열기
        conn = cx_Oracle.connect(DB_USER, DB_PASS, DB_DSN, encoding="UTF-8")
        conn.autocommit = True  # Oracle 자동 커밋
        cursor = conn.cursor()

        cursor.execute("SELECT SYS_CONTEXT('USERENV', 'CURRENT_USER') FROM DUAL")
        current_user = cursor.fetchone()[0]
        print(f"[DEBUG] 현재 접속 사용자: {current_user}")

        for item_category_code in ITEM_CATEGORY_CODES:
            url = (
                f"http://www.kamis.or.kr/service/price/xml.do?"
                f"action=dailyPriceByCategoryList"
                f"&p_product_cls_code={PRODUCT_CLS_CODE}"
                f"&p_regday={date_str}"
                f"&p_convert_kg_yn=N"
                f"&p_item_category_code={item_category_code}"
                f"&p_cert_key={CERT_KEY}"
                f"&p_cert_id={CERT_ID}"
                f"&p_returntype=json"
            )
            print(f"[DEBUG] API 요청 URL: {url}")

            try:
                res = requests.get(url)
                res.raise_for_status()
                json_data = res.json()
                print(f"[DEBUG] API 응답 데이터: {json_data}")
            except Exception as e:
                print(f"[ERROR] {date_str} {item_category_code} JSON 파싱 실패 또는 요청 에러:\n{e}")
                continue

            # 응답에서 item 리스트 추출
            raw_data = json_data.get("data", {})
            if isinstance(raw_data, dict):
                if raw_data.get("error_code") == "001":
                    print(f"[SKIP] {item_category_code} → KAMIS: 데이터 없음 응답 (001)")
                    continue
                data = raw_data.get("item", [])
            else:
                print(f"[SKIP] {item_category_code} → 예상치 못한 data 구조: {type(raw_data)}")
                continue

            if not isinstance(data, list):
                print(f"[SKIP] {item_category_code} → item 필드가 list 아님: {type(data)}")
                continue

            valid_items = [item for item in data if isinstance(item, dict)]
            print(f"[DEBUG] {item_category_code} 유효한 항목 수: {len(valid_items)}")

            for item in valid_items:
                item_code = item.get("item_code", "").strip()
                item_name = item.get("item_name", "").strip()
                price_str = item.get("dpr1", "").replace(",", "").strip()

                # 잘못된 가격 정보 처리
                if price_str == "-" or not price_str:
                    print(f"[SKIP] 잘못된 가격 정보: {item_name} / code: {item_code}")
                    continue

                recorded_date = date_str  # 안전하게 요청 날짜 기준으로 저장

                try:
                    price = float(price_str)
                    price = round(price, 2)  # 소수점 둘째 자리로 반올림
                except ValueError:
                    print(f"[SKIP] 숫자 변환 실패: {price_str} (item: {item_name} / {item_code})")
                    price = 0  # 유효하지 않은 가격은 0으로 처리

                # 1kg당 가격 계산 (단가)
                recorded_unit_price = price  # 기본 가격이 1kg당 가격인 경우
                unit = item.get('unit', ' ')
                print(f"[DEBUG] 단위 값 확인: {unit}")

                if 'kg' in unit:  # 만약 단위가 'kg'이라면
                    try:
                        quantity = float(unit.replace('kg', ''))  # kg 단위로 수량 추출
                        recorded_unit_price = price / quantity  # 가격을 수량으로 나누어 1kg당 단가 계산
                        recorded_unit_price = round(recorded_unit_price, 2)  # 소수점 둘째 자리로 반올림
                    except ValueError:
                        print(f"[SKIP] 단위 변환 실패: {unit} (item: {item_name} / {item_code})")
                        continue

                print(f"[DEBUG] 1kg당 단가 계산: {recorded_unit_price}원")

                # 값이 너무 크지 않도록 제한
                if recorded_unit_price > 99999999.99:
                    print(f"[SKIP] 가격 너무 큼: {recorded_unit_price} (item: {item_name} / {item_code})")
                    continue

                # `DETAIL_CODE_ID`와 `RECORDED_UNIT` 수정
                detail_code_id = item_code  # `item_code`를 `DETAIL_CODE_ID`로 사용
                recorded_unit = unit.replace("kg", "")  # 단위 값 그대로 사용

                # 데이터 확인
                print(f"[DEBUG] INSERT 데이터 확인: {detail_code_id}, {price}, {recorded_date}, {recorded_unit}, {recorded_unit_price}")

                try:
                    cursor.execute("""
                        INSERT INTO TB_PRICE_API_HISTORY (
                            HISTORY_PRICE_ID, DETAIL_CODE_ID, RECORDED_PRICE, RECORDED_DATE,
                            RECORDED_UNIT, RECORDED_UNIT_PRICE, CREATED_ID, UPDATED_ID
                        ) VALUES (
                            :1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'),
                            :5, :6, :7, :8
                        )
                    """, (
                        str(uuid.uuid4()), detail_code_id, price, recorded_date,
                        recorded_unit, recorded_unit_price, "system", "system"
                    ))
                    print(f"[INSERT SUCCESS] {item_name} - {item_code} 저장 완료")
                except Exception as e:
                    print(f"[ERROR] INSERT 실패: {e} - 데이터: {price}, {recorded_unit_price}, {recorded_date}, {unit}")

            print(f"[OK] {item_category_code} 저장 완료")

        cursor.close()  # 커서 종료
        conn.close()  # 연결 종료

    except Exception as e:
        print(f"[ERROR] DB 연결 오류: {e}")

# 매일 데이터를 수집하도록 반복 실행
if __name__ == "__main__":
    current_date = datetime.date(2015, 1, 1)
    end_date = datetime.date(2025, 12, 31)

    while current_date <= end_date:
        date_str = current_date.strftime("%Y%m%d")
        print(f"\n[INFO] {date_str} 데이터 수집 시작!")
        fetch_and_insert(date_str)  # 하루 단위로 데이터 수집
        current_date += datetime.timedelta(days=1)  # 하루씩 증가
