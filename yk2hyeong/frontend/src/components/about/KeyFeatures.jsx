import React from "react";
import {useNavigate} from "react-router-dom";

function KeyFeatures(){
    const navigate = useNavigate();

    return(
        <div className="key-features">
            <h1>주요기능</h1>
            <div className="key-features-grid">
                <div className="key-card" onClick={()=> navigate("/productlist")}>
                    <i className="fa-solid fa-truck-fast"></i>
                    <h2>즉시구매/예약구매</h2>
                    <p>금일 시세로 즉시구매 또는 예약구매가 가능합니다.</p>
                </div>
                <div className="key-card" onClick={()=>navigate("/chart")}>
                    <i className="fa-solid fa-chart-simple"></i>
                    <h2>시세추이 차트</h2>
                    <p>데이터 분석 차트를 보고 구매 결정에 참고할 수 있습니다.</p>
                </div>
                <div className="key-card">
                    <i className="fa-solid fa-robot key-icon" />
                    <h2>1:1 챗봇</h2>
                    <p>AI 챗봇이 1:1 상담을 제공합니다.</p>
                </div>
            </div>
        </div>
    )
}

export default KeyFeatures;