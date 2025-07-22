import requests
import cx_Oracle
import datetime
import uuid
import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

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
        conn = cx_Oracle.connect(DB_USER, DB_PASS, DB_DSN, encoding="UTF-8")
        conn.autocommit = True
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
                print(f"[DEBUG] API 응답 데이터 수신 성공")
            except Exception as e:
                print(f"[ERROR] {date_str} {item_category_code} 요청 실패: {e}")
                continue

            raw_data = json_data.get("data", {})
            if isinstance(raw_data, dict):
                if raw_data.get("error_code") == "001":
                    print(f"[SKIP] {item_category_code} → KAMIS: 데이터 없음")
                    continue
                data = raw_data.get("item", [])
            else:
                print(f"[SKIP] {item_category_code} → 예상치 못한 data 구조")
                continue

            if not isinstance(data, list):
                print(f"[SKIP] {item_category_code} → item 필드가 리스트가 아님")
                continue

            valid_items = [item for item in data if isinstance(item, dict)]
            print(f"[DEBUG] {item_category_code} 항목 수: {len(valid_items)}")

            for item in valid_items:
                low_code_value = item.get("item_code", "").strip()
                item_name = item.get("item_name", "").strip()
                price_str = item.get("dpr1", "").replace(",", "").strip()

                if price_str == "-" or not price_str:
                    print(f"[SKIP] 가격 정보 없음: {item_name} / {low_code_value}")
                    continue

                recorded_date = date_str

                try:
                    price = float(price_str)
                    price = round(price, 2)
                except ValueError:
                    print(f"[SKIP] 숫자 변환 실패: {price_str} (item: {item_name})")
                    continue

                unit = item.get('unit', ' ').strip()
                recorded_unit_price = price
                
               # 단위 숫자만 추출 (예: '100개' → '100')
                recorded_unit = re.sub(r'\D', '', unit)

                if 'kg' in unit:
                    try:
                        quantity = float(unit.replace('kg', '').strip())
                        recorded_unit_price = round(price / quantity, 2)
                    except ValueError:
                        print(f"[SKIP] 단위 변환 실패: {unit} (item: {item_name})")
                        continue
                elif not recorded_unit.isdigit():
                    print(f"[SKIP] 유효하지 않은 단위: {unit} → 숫자 아님")
                    continue

                if recorded_unit_price > 99999999.99:
                    print(f"[SKIP] 가격 너무 큼: {recorded_unit_price} (item: {item_name})")
                    continue

                print(f"[DEBUG] 저장 대상: {low_code_value}, {price}, {recorded_unit_price}, {recorded_date}, {recorded_unit}")

                try:
                    cursor.execute("""
                        INSERT INTO TB_PRICE_API_HISTORY (
                            HISTORY_PRICE_ID, LOW_CODE_VALUE, RECORDED_PRICE, RECORDED_DATE,
                            RECORDED_UNIT, RECORDED_UNIT_PRICE, CREATED_ID, UPDATED_ID
                        ) VALUES (
                            :1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'),
                            :5, :6, :7, :8
                        )
                    """, (
                        str(uuid.uuid4()), low_code_value, price, recorded_date,
                        recorded_unit, recorded_unit_price, "system", "system"
                    ))
                    print(f"[INSERT] {item_name} 저장 완료")
                except Exception as e:
                    print(f"[ERROR] DB INSERT 실패: {e}")

            print(f"[OK] {item_category_code} 저장 완료")

        cursor.close()
        conn.close()

    except Exception as e:
        print(f"[ERROR] DB 연결 오류: {e}")


if __name__ == "__main__":
    from_date = sys.argv[1]  # "YYYYMMDD"
    to_date = sys.argv[2]

    current_date = datetime.datetime.strptime(from_date, "%Y%m%d").date()
    end_date = datetime.datetime.strptime(to_date, "%Y%m%d").date()

    while current_date <= end_date:
        date_str = current_date.strftime("%Y%m%d")
        print(f"\n[INFO] {date_str} 데이터 수집 시작")
        fetch_and_insert(date_str)
        current_date += datetime.timedelta(days=1)
