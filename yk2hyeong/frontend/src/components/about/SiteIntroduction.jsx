import React from "react";

function SiteIntroduction(){
    return(
        <div className="site-introduction">
            <div className="intro-left">
                <img src="/static/images/logo.png" alt="logo"/>
            </div>
            <div className="intro-right">
                <h1 className="site-title">영근이형 (YH)</h1>
                <h2 className="site-subtitle">도매업자들을 위한 농산물 시세추이 직거래 사이트</h2>
                <p className="site-description">우리 플랫폼은 도매업자분들을 위한 전문적인 농산물 시세 분석 기반의 직거래 서비스입니다.
                    날씨, 수급, 지역별 생산량 등 다양한 요인으로 인해 시시각각 변동하는 농산물 시세를 보다 정밀하게 분석하고
                    시각화하여, 사용자들이 시장 흐름을 빠르고 정확하게 파악할 수 있도록 돕습니다.
                    기존의 복잡한 유통 단계를 최소화하고, 전국 각지의 생산자들과 직접 연결되어 중간 마진 없는 직거래가
                    가능하도록 설계되어 있어, 도매업자 입장에서 더 합리적인 가격으로 안정적인 물량 확보가 가능합니다.</p>
            </div>
        </div>
    )
}

export default SiteIntroduction;