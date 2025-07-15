import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
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
    LineController,  // 추가된 부분
    BarController     // 추가된 부분
} from 'chart.js';

// LineController와 BarController를 명시적으로 등록
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineController,  // Line 차트를 위한 컨트롤러 등록
    BarController,   // Bar 차트를 위한 컨트롤러 등록
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement
);

const ForecastChart = () => {

    const [priceData, setPriceData] = useState([]);

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Actual Price (Bar)',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                type: 'bar',
            },
            {
                label: 'Predicted Price (Line)',
                data: [],
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
                borderWidth: 2,
                type: 'line',
            },
        ],
    });

    useEffect(() => {

        axios.get(`/chart?timeFrame`)

            .then(response => {

                const prices = response.data;

                const labels = prices.map(item => item.recordedDate);
                const actualPrices = prices.map(item => item.recordedUnitPrice);

                const predictedPrices = [];

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Actual Price (Bar)',
                            data: actualPrices,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            type: 'bar',
                        },
                        {
                            label: 'Predicted Price (Line)',
                            data: predictedPrices,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            fill: false,
                            borderWidth: 2,
                            type: 'line',
                        },
                    ],
                });
            })
            .catch(error => {
                console.error("There was an error fetching the data:", error);
            });

    }, []);

    return (
        <div>
            <h2>시세 추이</h2>

            <div>
                <h3>실거래 가격(도매)</h3>
                <Bar data={chartData} />
            </div>

        </div>
    );
};

export default ForecastChart;
