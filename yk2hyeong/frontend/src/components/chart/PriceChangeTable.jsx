import React, { useEffect, useState } from 'react';
import axios from "axios";
import CustomTable from "../../components/common/CustomTable";

const PriceChangeTable = ({ limit = null }) => {
    const [tableData, setTableData] = useState([]);

    const columns = [
        {
            title: '품목명',
            dataIndex: 'lowCodeName',
            key: 'lowCodeName',
        },
        {
            title: '어제 평균가 (원)',
            dataIndex: 'yesterdayPrice',
            key: 'yesterdayPrice',
            render: (price) => price?.toLocaleString(),
        },
        {
            title: '오늘 평균가 (원)',
            dataIndex: 'todayPrice',
            key: 'todayPrice',
            render: (price) => price?.toLocaleString(),
        },
        {
            title: '등락 (원, %)',
            key: 'rate',
            render: (_, record) => {
                const diff = record.todayPrice - record.yesterdayPrice;
                const rate = record.yesterdayPrice !== 0
                    ? (diff / record.yesterdayPrice) * 100
                    : 0;

                const color = diff > 0 ? 'red' : diff < 0 ? 'blue' : 'black';
                const sign = diff > 0 ? '+' : '';

                return (
                    <span style={{ color }}>
                        {sign}{diff.toFixed(0)}원 ({sign}{rate.toFixed(2)}%)
                    </span>
                );
            }
        },
    ];

    useEffect(() => {
        axios.get('/chart/price/dailyPriceDiff').then(res => {
            setTableData(res.data);
        });
    }, []);

    // limit이 있으면 제한, 없으면 전체
    const displayData = limit ? tableData.slice(0, limit) : tableData;

    return (
        <div>
            <CustomTable
                columns={columns}
                data={displayData.map((item, index) => ({ key: index, ...item }))}
                selectionType={null}
            />
            <p className="trendy-price-caution">※ 주말에는 최신 시세 데이터가 없어, 직전 평일(목/금)의 가격을 참고용으로 제공합니다.</p>
        </div>
    );
};

export default PriceChangeTable;
