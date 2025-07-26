@echo off
@chcp 65001 > nul
echo [FastAPI 서버 실행 준비 중...]
echo -------------------------------

REM 필요한 패키지 설치 (없으면 설치)
pip install uvicorn fastapi openpyxl pandas sqlalchemy cx_Oracle tensorflow scikit-learn matplotlib --quiet

REM 서버 실행
echo [FastAPI 서버 실행 중...]
uvicorn report_server:app --reload --host 0.0.0.0 --port 8001

pause
