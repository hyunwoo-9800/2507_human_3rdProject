import React, { useState } from 'react';
import CustomTabs from "../../components/common/CustomTabs";

export default function ProductList() {

    const [activeKey, setActiveKey] = useState('all');

    const handleTabChange = (key) => {
        console.log('선택된 탭 키:', key);
        setActiveKey(key);
    };

    const tabItems = [
        {
            label: '전체',
            key: 'all',
            children: '전체 상품 목록이 여기에 표시됩니다.',
        },
        {
            label: '식량작물',
            key: 'food',
            children: '식량작물 상품 목록이 여기에 표시됩니다.',
        },
        {
            label: '채소류',
            key: 'vegetables',
            children: '채소류 상품 목록이 여기에 표시됩니다.',
        },
        {
            label: '과일류',
            key: 'fruits',
            children: '과일류 상품 목록이 여기에 표시됩니다.',
        },
        {
            label: '특용작물',
            key: 'special',
            children: '특용작물 상품 목록이 여기에 표시됩니다.',
        },
    ];

    return (
        <div>
            <h2>온라인 상품 목록</h2>
            <CustomTabs
                items={tabItems}
                type="card"
                onChange={handleTabChange}
                activeKey={activeKey} // 선택된 탭 반영
            />
        </div>
    );
}
