import React, { useState, useEffect } from 'react';
import ProductRegisterInfo from "./ProductRegisterInfo";
import ProductRegisterGuide from "./ProductRegisterGuide";
import ProductRegisterDescription from "./ProductRegisterDescription";
import CustomAlert from "../../components/common/CustomAlert";
import ProductSidebarMenu from "./ProductSidebarMenu";

export default function ProductRegister() {
    const [activeItem, setActiveItem] = useState("1");            // 현재 활성 탭 키
    const [guideConfirmed, setGuideConfirmed] = useState(false);  // 안내사항 체크 여부
    const [showWarning, setShowWarning] = useState(false);        // 경고창 표시 여부

    // 체크박스 상태 (안내사항 체크박스)
    const [guideChecked, setGuideChecked] = useState(false);

    // 기본정보 상태 관리
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

    // 기본정보 유효성 검사 함수
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

    // 상품소개 유효성 검사 함수
    const isDescriptionValid = () => {
        return (
            thumbnail !== null
        );
    };

    // 사이드바 라벨에 완료 표시 붙이기
    const getLabelWithStatus = (label, isComplete) => {
        return isComplete ? `${label} ✅` : label;
    };

    // 메뉴 아이템 정의
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

    // guideConfirmed가 true가 되면 showWarning을 자동으로 false로 설정해 경고창 숨김
    useEffect(() => {
        if (guideConfirmed) {
            setShowWarning(false);
        }
    }, [guideConfirmed]);

    // 사이드바 탭 클릭 핸들러
    const handleMenuSelect = (info) => {
        console.log('선택된 key:', info.key);  // 선택된 key 확인용 로그

        setShowWarning(false);  // 탭 클릭 시 기본적으로 경고 숨기기

        if (info.key === '1') {
            // 첫번째 탭(안내사항)은 항상 이동 가능
            setActiveItem('1');
            return;
        }

        // 안내사항 확인 안 됐으면 경고 표시하고 이동 차단
        if (!guideConfirmed) {
            setShowWarning(true);
            return;
        }

        // 정상적으로 선택된 탭으로 이동
        setActiveItem(info.key);
    };

    // 최종 제출 버튼 클릭 핸들러
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
        // 실제 제출 시 axios 등으로 API 호출 가능
    };

    // 활성 탭에 따라 다른 컴포넌트 렌더링
    const renderContent = () => {
        switch (activeItem) {
            case '1':
                return (
                    <ProductRegisterGuide
                        checked={guideChecked}
                        onChangeChecked={setGuideChecked}
                        onNext={() => {
                            setGuideConfirmed(true);  // 체크 후 안내사항 확인 완료 상태로 변경
                            setActiveItem('2');       // 기본정보 탭으로 이동
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
                <ProductSidebarMenu
                    items={menuItems}
                    selectedKeys={[activeItem]}
                    defaultOpenKeys={['sub1']}
                    onSelectItem={handleMenuSelect}
                />
            </div>
            <div style={{ flex: 1, padding: 20 }}>
                {/* 경고창 표시 */}
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
