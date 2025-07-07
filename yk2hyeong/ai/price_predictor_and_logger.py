import requests
import cx_Oracle
import datetime
import uuid

# 인증 정보
CERT_KEY = "9e32fc12-8533-4883-b970-b45b3599316a"
CERT_ID = "5956"

# DB 연결 정보
DB_DSN = cx_Oracle.makedsn("localhost", 1521, service_name="xe")
DB_USER = "c##hw"
DB_PASS = "0000"

# KAMIS API 설정
PRODUCT_CLS_CODE = "02"  # 도매
ITEM_CATEGORY_CODES = ["100", "200", "300", "400"]  # 식량, 채소, 특용, 과일

def fetch_and_insert(date_str):
    print(f"\n[{date_str}] 데이터 수집 중...")
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

        try:
            res = requests.get(url)
            res.raise_for_status()
            json_data = res.json()
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
            recorded_at = date_str  # 안전하게 요청 날짜 기준으로 저장

            if not item_code or not price_str or price_str == "-":
                print(f"[SKIP] 가격 정보 없음 또는 item_code 누락 → {item_name} / code: {item_code}")
                continue

            try:
                price = float(price_str)
            except ValueError:
                print(f"[SKIP] 숫자 변환 실패: {price_str}")
                continue

            print(f"[INSERT] {item_name}({item_code}) / {price}원 / {recorded_at}")

            try:
                cursor.execute("""
                    INSERT INTO TB_PRICE_HISTORY (
                        HISTORY_PRICE_ID, ITEM_CODE, RECORDED_PRICE, RECORDED_AT,
                        SOURCE_TYPE, IS_PREDICTED, CREATED_BY, CREATED_AT
                    ) VALUES (
                        :1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'),
                        :5, :6, :7, SYSDATE
                    )
                """, (
                    str(uuid.uuid4()), item_code, price, recorded_at,
                    "API", 'N', "system"
                ))
            except Exception as e:
                print(f"[ERROR] {date_str} {item_category_code} 저장 실패: {e}")

        print(f"[OK] {item_category_code} 저장 완료")

    cursor.close()
    conn.close()

# 실행 진입점
if __name__ == "__main__":
    # 테스트용 날짜 고정 or 어제 날짜 자동
    # fetch_and_insert((datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"))
    fetch_and_insert("2025-07-04")
