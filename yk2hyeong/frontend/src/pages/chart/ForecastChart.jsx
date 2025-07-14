import React, { useEffect, useState } from "react";

function Forecast() {
    const [grain, setGrain] = useState("rice");  // 기본값을 rice로 설정
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FastAPI에서 시세 예측 값 가져오기
    useEffect(() => {
        fetch(`http://localhost:8000/forecast?grain=${grain}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.forecast) {
                    setForecastData(data.forecast);  // 예측 데이터 저장
                } else {
                    setError("데이터가 없습니다.");
                }
                setLoading(false); // 로딩 완료
            })
            .catch((error) => {
                setError("데이터를 가져오는 데 실패했습니다.");
                setLoading(false);
            });
    }, [grain]);  // grain 값이 변경될 때마다 새로 요청

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>시세 예측</h1>
            <select onChange={(e) => setGrain(e.target.value)} value={grain}>
                <option value="rice">쌀</option>
                <option value="sweet_rice">찹쌀</option>
                <option value="barley">보리</option>
                {/* 다른 품목들 */}
            </select>
            <table>
                <thead>
                <tr>
                    <th>날짜</th>
                    <th>예측 값</th>
                    <th>하한 예측값</th>
                    <th>상한 예측값</th>
                </tr>
                </thead>
                <tbody>
                {forecastData.length > 0 ? (
                    forecastData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.날짜}</td>
                            <td>{item["예측 값"]}</td>
                            <td>{item["하한 예측값"]}</td>
                            <td>{item["상한 예측값"]}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4">예측 데이터가 없습니다.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Forecast;
