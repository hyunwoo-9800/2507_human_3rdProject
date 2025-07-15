import React, { useState } from 'react';
import CustomSidebarMenu from "../../components/common/CustomSidebarMenu";
import ProductRegisterInfo from "./ProductRegisterInfo";
import ProductRegisterGuide from "./ProductRegisterGuide";
import ProductRegisterDescription from "./ProductRegisterDescription";
import CustomAlert from "../../components/common/CustomAlert";

export default function ProductRegister() {
    const [activeItem, setActiveItem] = useState("1");
    const [guideConfirmed, setGuideConfirmed] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    // 체크박스 상태
    const [guideChecked, setGuideChecked] = useState(false);

    // 기본정보 상태
    const [productForm, setProductForm] = useState({
        productName: '',
        startDate: null,
        endDate: null,
        productPrice: '',
        detailCodeId: null,
        orderType: 'immediate/reservation',
        saleQuantity: 100,
        minSaleUnit: 10,
        selectedCategory: null,
        selectedSubCategory: null,
        categoryData: {},
        showDateWarning: false,
    });

    // 상품소개 상태
    const [descriptionText, setDescriptionText] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [detailImages, setDetailImages] = useState([]);

    // ✅ 기본정보 유효성 검사
    const isBasicInfoValid = (form) => {
        return (
            form.productName?.trim() !== '' &&
            form.productPrice?.trim() !== '' &&
            form.startDate !== null &&
            form.endDate !== null &&
            form.detailCodeId !== null &&
            form.saleQuantity > 0 &&
            form.minSaleUnit > 0 &&
            !form.showDateWarning
        );
    };

    // ✅ 상품소개 유효성 검사
    const isDescriptionValid = () => {
        return (
            thumbnail !== null &&
            detailImages.length > 0
        );
    };

    // ✅ 사이드바 라벨 표시
    const getLabelWithStatus = (label, isComplete) => {
        return isComplete ? `${label} ✅` : label;
    };

    const menuItems = [
        {
            key: 'sub1',
            label: '상품 등록하기',
            children: [
                { key: '1', label: getLabelWithStatus('1. 안내사항', guideConfirmed) },
                { key: '2', label: getLabelWithStatus('2. 기본정보', isBasicInfoValid(productForm)) },
                { key: '3', label: getLabelWithStatus('3. 상품소개', isDescriptionValid()) },
            ]
        }
    ];

    // ✅ 사이드바 탭 클릭 시
    const handleMenuSelect = ({ key }) => {
        setShowWarning(false);

        if (key === '1') {
            setActiveItem('1');
            return;
        }

        if (!guideConfirmed) {
            setShowWarning(true);
            return;
        }

        setActiveItem(key);
    };

    // ✅ 최종 제출 핸들러
    const handleFinalSubmit = () => {
        if (!isBasicInfoValid(productForm) || !isDescriptionValid()) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        const submitData = {
            ...productForm,
            descriptionText,
            thumbnail,
            detailImages
        };

        console.log("✅ 최종 제출 데이터:", submitData);
        // 예: axios.post('/api/products', submitData)
    };

    const renderContent = () => {
        switch (activeItem) {
            case '1':
                return (
                    <ProductRegisterGuide
                        checked={guideChecked}
                        onChangeChecked={setGuideChecked}
                        onNext={() => {
                            setGuideConfirmed(true);
                            setActiveItem('2');
                        }}
                    />
                );
            case '2':
                return (
                    <ProductRegisterInfo
                        form={productForm}
                        setForm={setProductForm}
                        onNext={() => setActiveItem('3')}
                        onBack={() => setActiveItem('1')}
                    />
                );
            case '3':
                return (
                    <>
                        <ProductRegisterDescription
                            text={descriptionText}
                            setText={setDescriptionText}
                            thumbnail={thumbnail}
                            setThumbnail={setThumbnail}
                            detailImages={detailImages}
                            setDetailImages={setDetailImages}
                            onBack={() => setActiveItem('2')}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
                            <button
                                onClick={handleFinalSubmit}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#00a43c',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                최종 등록하기
                            </button>
                        </div>
                    </>
                );
            default:
                return <div>선택된 콘텐츠가 없습니다.</div>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: 256, marginTop: 5 }}>
                <CustomSidebarMenu
                    items={menuItems}
                    selectedKeys={[activeItem]}
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
