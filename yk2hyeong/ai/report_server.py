from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from generate_report import generate_excel_report
from urllib.parse import quote
import os
import uvicorn

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 배포시에는 프론트 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/report/download")
def download_report(lowCodeValue: str, timeFrame: str):
    file_path = generate_excel_report(lowCodeValue, timeFrame)
    filename = os.path.basename(file_path)

    encoded_filename = quote(filename)

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
        }
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
