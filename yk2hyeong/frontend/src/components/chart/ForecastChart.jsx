import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
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

const ForecastChart = ({ detailCodeId, timeFrame }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!detailCodeId || !timeFrame) return;

        const fetchPastData = axios.get('/chart/price/past', {
            params: {
                detailCodeId,
                timeFrame, // 과거 데이터만
            }
        });

        const fetchFutureData = axios.get('/chart/price/future', {
            params: {
                detailCodeId,
                timeFrame, // 예측된 미래 데이터
            }
        });

        Promise.all([fetchPastData, fetchFutureData]).then(([pastRes, futureRes]) => {
            const pastData = pastRes.data;
            const futureData = futureRes.data;

            // 날짜 범위 설정
            const labels = [];
            const today = new Date();

            if (timeFrame === 'week') {
                // 과거 7일, 미래 7일
                for (let i = 7; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    labels.push(date.toISOString().slice(0, 10));  // 'YYYY-MM-DD'
                }
                for (let i = 1; i <= 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    labels.push(date.toISOString().slice(0, 10));  // 'YYYY-MM-DD'
                }
            } else if (timeFrame === 'month') {
                // 과거 6개월, 미래 3개월
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(today);
                    date.setMonth(today.getMonth() - i);
                    labels.push(date.toISOString().slice(0, 7)); // 'YYYY-MM'
                }
                for (let i = 1; i <= 3; i++) {
                    const date = new Date(today);
                    date.setMonth(today.getMonth() + i);
                    labels.push(date.toISOString().slice(0, 7)); // 'YYYY-MM'
                }
            } else if (timeFrame === 'year') {
                // 과거 5년, 미래 1년
                for (let i = 4; i >= 0; i--) {
                    const date = new Date(today);
                    date.setFullYear(today.getFullYear() - i);
                    labels.push(date.getFullYear().toString()); // 'YYYY'
                }
                for (let i = 1; i <= 1; i++) {
                    const date = new Date(today);
                    date.setFullYear(today.getFullYear() + i);
                    labels.push(date.getFullYear().toString()); // 'YYYY'
                }
            }

            // 과거 데이터 매핑 (실제 가격)
            const pastPriceMap = pastData.reduce((acc, d) => {
                const dateKey = timeFrame === 'month' ? d.recordedDate.slice(0, 7) : (timeFrame === 'year' ? d.recordedDate.slice(0, 4) : d.recordedDate);
                acc[dateKey] = acc[dateKey] || { recorded: 0 };
                if (d.recordedUnitPrice) acc[dateKey].recorded = d.recordedUnitPrice;
                return acc;
            }, {});

            // 미래 데이터 매핑 (예측 가격)
            const futurePriceMap = futureData.reduce((acc, d) => {
                const dateKey = timeFrame === 'month' ? d.predictDate.slice(0, 7) : (timeFrame === 'year' ? d.predictDate.slice(0, 4) : d.predictDate);
                acc[dateKey] = acc[dateKey] || { predicted: 0 };
                if (d.predictedUnitPrice) acc[dateKey].predicted = d.predictedUnitPrice;
                return acc;
            }, {});

            // 실제 가격 및 예측 가격 배열로 변환
            const actualPrices = [];
            const predictedPrices = [];
            const filteredLabels = [];

            labels.forEach(date => {
                if (pastPriceMap[date]?.recorded || futurePriceMap[date]?.predicted) {
                    filteredLabels.push(date);
                    actualPrices.push(pastPriceMap[date]?.recorded || 0);
                    predictedPrices.push(futurePriceMap[date]?.predicted || 0);
                }
            });

            // 차트 데이터 설정
            setChartData({
                labels: filteredLabels,
                datasets: [
                    {
                        type: 'bar',
                        label: '실제 단가',
                        data: actualPrices,
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
                    scales: {
                        y: {
                            min: 0, // y축 최소값 설정 (0부터 시작)
                            max: Math.max(...chartData.datasets[0].data, ...chartData.datasets[1].data) * 1.2, // y축 최대값 설정 (가장 큰 값의 120%)
                        }
                    },
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: '시세 추이 (실제 vs 예측)' }
                    }
                }} />
            ) : (
                <CustomLoading />
            )}
        </div>
    );
};

export default ForecastChart;
