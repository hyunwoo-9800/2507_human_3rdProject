import React, { useState } from 'react';
import CustomSidebarMenu from "../../components/common/CustomSidebarMenu";

export default function ProductRegister() {
    // label을 상태로 관리
    const [activeItem, setActiveItem] = useState("1. 안내사항");

    const menuItems = [
        {
            key: 'sub1',
            label: '상품 등록하기',
            children: [
                { key: '1', label: '1. 안내사항' },
                { key: '2', label: '2. 기본정보' },
                { key: '3', label: '3. 상품소개' },
            ]
        }
    ];

    // 모든 하위 메뉴 label 수집 (상위 메뉴 제외)
    const allSubLabels = menuItems.flatMap(item =>
        item.children ? item.children.map(child => child.label) : []
    );

    // onSelectItem이 label을 인자로 받으므로 label 기반 상태 변경
    const handleMenuSelect = (label) => {
        if (allSubLabels.includes(label)) {
            setActiveItem(label);
        }
    };

    // label 기준으로 콘텐츠 렌더링
    const renderContent = () => {
        switch (activeItem) {
            case '1. 안내사항':
                return <div>📌 1. 안내사항 콘텐츠</div>;
            case '2. 기본정보':
                return <div>📝 2. 기본정보 콘텐츠</div>;
            case '3. 상품소개':
                return <div>🛒 3. 상품소개 콘텐츠</div>;
            default:
                return <div>선택된 콘텐츠가 없습니다.</div>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: 256, marginTop:5}}>
                <CustomSidebarMenu
                    items={menuItems}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onSelectItem={handleMenuSelect} // label 인자 받는 콜백
                />
            </div>
            <div style={{ flex: 1, padding: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}
