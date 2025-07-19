import React, { useEffect, useState } from 'react';
import axios from "axios";
import CustomTable from "../../components/common/CustomTable";
import CustomPagination from "../../components/common/CustomPagination";

const PriceChangeTable = ({ limit = null }) => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 한 페이지당 항목 수

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

    // 보여줄 데이터 계산
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    const pagedData = tableData.slice(startIdx, endIdx);
    const displayData = limit ? pagedData.slice(0, limit) : pagedData;

    return (
        <div>
            <CustomTable
                columns={columns}
                data={displayData.map((item, index) => ({ key: index + startIdx, ...item }))}
                selectionType={null}
            />

            {/* 페이징 */}
            {!limit && (
                <CustomPagination
                    defaultCurrent={currentPage}
                    total={tableData.length}
                    onChange={(page) => setCurrentPage(page)}
                    className="custom-pagination"
                />
            )}

            <p className="trendy-price-caution">
                ※ 주말에는 최신 시세 데이터가 없어, 직전 평일(목/금)의 가격을 참고용으로 제공합니다.
                (거래 내역이 존재하는 품목만 출력됩니다.)
            </p>
        </div>
    );
};

export default PriceChangeTable;
