import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import CustomLoading from '../../components/common/CustomLoading';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineController,
    BarController
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const ForecastChart = ({detailCodeId, timeFrame}) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!detailCodeId || !timeFrame) return;

        axios.get('/chart/price', {
            params: {
                detailCodeId,
                timeFrame,
            }
        }).then(res => {
            const data = res.data;
            //
            // const labels = data.map(d => d.recordedDate);
            // const actualPrices = data.map(d => d.recordedUnitPrice);
            // const predictedPrices = data.map(d => d.predictedUnitPrice || null); // 예측값이 있다면

            const labels = [];
            const today = new Date();

            // 날짜 범위 설정
            let dateRange = [];

            // 날짜 범위 설정 (주간, 월간, 연간)
            if (timeFrame === 'week') {
                // 최근 7일
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i); // 7일 전부터 오늘까지
                    labels.push(date.toISOString().slice(0, 10));  // 'YYYY-MM-DD' 형태로 저장
                }
            } else if (timeFrame === 'month') {
                // 최근 5개월
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setMonth(today.getMonth() - i); // 5개월 전부터 오늘까지
                    labels.push(date.toISOString().slice(0, 7)); // 'YYYY-MM' 형태로 저장
                }
            } else if (timeFrame === 'year') {
                // 최근 5년
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setFullYear(today.getFullYear() - i); // 5년 전부터 오늘까지
                    labels.push(date.getFullYear().toString()); // 'YYYY' 형태로 저장
                }
            }

            // 실제 가격 데이터 매핑 (없으면 0으로 처리)
            const actualPrices = labels.map(date => {
                const found = data.find(d => {
                    // 월간/연간 데이터는 'YYYY-MM' 또는 'YYYY' 형식으로 비교
                    if (timeFrame === 'month') {
                        return d.recordedDate.slice(0, 7) === date; // 'YYYY-MM' 형식으로 비교
                    } else if (timeFrame === 'year') {
                        return d.recordedDate.slice(0, 4) === date; // 'YYYY' 형식으로 비교
                    } else {
                        return d.recordedDate === date; // 주간은 'YYYY-MM-DD' 형식으로 그대로 비교
                    }
                });
                return found ? found.recordedUnitPrice : 0;  // 데이터가 없으면 0
            });

            // 예측 가격 데이터 매핑 (없으면 null로 처리)
            const predictedPrices = labels.map(date => {
                const found = data.find(d => {
                    if (timeFrame === 'month') {
                        return d.recordedDate.slice(0, 7) === date; // 'YYYY-MM' 형식으로 비교
                    } else if (timeFrame === 'year') {
                        return d.recordedDate.slice(0, 4) === date; // 'YYYY' 형식으로 비교
                    } else {
                        return d.recordedDate === date; // 주간은 'YYYY-MM-DD' 형식으로 그대로 비교
                    }
                });
                return found ? found.predictedUnitPrice : null;  // 예측값이 없으면 null
            });

            setChartData({
                labels,
                datasets: [
                    {
                        type: 'bar',
                        label: '실제 단가',
                        data: actualPrices, // 값 없으면 0
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        type: 'line',
                        label: '예측 단가',
                        data: predictedPrices,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3
                    }
                ]
            });
        });
    }, [detailCodeId, timeFrame]);

    return (
        <div>
            <h3>실거래 + 예측 시세</h3>
            {chartData ? (
                <Bar data={chartData} options={{
                    responsive: true,
                    plugins: {
                        legend: {position: 'top'},
                        title: {display: true, text: '시세 추이 (실제 vs 예측)'}
                    }
                }}/>
            ) : (
                <CustomLoading/>
            )}
        </div>
    );
};
export default ForecastChart;
