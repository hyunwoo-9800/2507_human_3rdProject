import React, { useState } from 'react';
import CustomSidebarMenu from "../../components/common/CustomSidebarMenu";
import ProductRegisterInfo from "./ProductRegisterInfo";
import ProductRegisterGuide from "./ProductRegisterGuide";
import ProductRegisterDescription from "./ProductRegisterDescription";
import CustomAlert from "../../components/common/CustomAlert";

export default function ProductRegister() {
    const [activeItem, setActiveItem] = useState("1. 안내사항");
    const [guideConfirmed, setGuideConfirmed] = useState(false);
    const [showWarning, setShowWarning] = useState(false); // 여기 추가!

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
        setShowWarning(false); // 클릭 때마다 경고 숨김

        if (label === '1. 안내사항') {
            setActiveItem(label);
            return;
        }

        if (!guideConfirmed) {
            setShowWarning(true); // 체크 안 됐을 때 경고 표시
            return;
        }

        setActiveItem(label);
    };

    const renderContent = () => {
        switch (activeItem) {
            case '1. 안내사항':
                return <ProductRegisterGuide
                    onNext={() => {
                        setGuideConfirmed(true);
                        setActiveItem('2. 기본정보');
                    }}
                />;
            case '2. 기본정보': return <ProductRegisterInfo />;
            case '3. 상품소개': return <ProductRegisterDescription />;
            default:
                return <div>선택된 콘텐츠가 없습니다.</div>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: 256, marginTop: 5 }}>
                <CustomSidebarMenu
                    items={menuItems}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onSelectItem={handleMenuSelect}
                />
            </div>
            <div style={{ flex: 1, padding: 20 }}>
                {showWarning && (
                    <CustomAlert
                        type="warning"
                        message="주의!"
                        description="안내사항 확인 여부를 체크해주세요."
                        style={{ marginBottom: 20 }}
                    />
                )}
                {renderContent()}
            </div>
        </div>
    );
}