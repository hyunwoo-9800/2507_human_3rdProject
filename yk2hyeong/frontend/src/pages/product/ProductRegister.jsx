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
    const [userInfo, setUserInfo] = useState(null);               // 사용자 정보 상태

    // 로그인 사용자 정보 가져오기
    useEffect(() => {
        fetch("http://localhost:8080/auth/me", {
            credentials: "include" // 쿠키 기반 인증 시 필요
        })
            .then(res => {
                if (!res.ok) throw new Error("인증 정보 불러오기 실패");
                return res.json();
            })
            .then(data => {
                setUserInfo(data);
            })
            .catch(err => {
                console.error("유저 정보 불러오기 실패:", err);
            });
    }, []);

    // 안내사항 체크박스 상태
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
        categoryData: {}, // 이 항목은 제출 시 제외될 것
        showDateWarning: false,
    });

    // 상품소개 상태
    const [descriptionText, setDescriptionText] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [detailImages, setDetailImages] = useState([]);

    // 기본정보 유효성 검사
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

    // 상품소개 유효성 검사
    const isDescriptionValid = () => {
        return thumbnail !== null;
    };

    // 완료된 항목 라벨에 체크 표시
    const getLabelWithStatus = (label, isComplete) => {
        return isComplete ? `${label} ✅` : label;
    };

    // 사이드바 메뉴 항목
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

    // 안내사항 체크 시 경고창 자동 숨김
    useEffect(() => {
        if (guideConfirmed) {
            setShowWarning(false);
        }
    }, [guideConfirmed]);

    // 사이드바 탭 클릭 핸들러
    const handleMenuSelect = (info) => {
        setShowWarning(false);  // 경고 초기화

        if (info.key === '1') {
            setActiveItem('1');
            return;
        }

        if (!guideConfirmed) {
            setShowWarning(true); // 안내사항 체크 안 되어 있으면 경고
            return;
        }

        setActiveItem(info.key); // 정상 이동
    };

    // 최종 제출 핸들러
    const handleFinalSubmit = () => {
        if (!isBasicInfoValid(productForm) || !isDescriptionValid()) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        if (!userInfo) {
            alert("로그인 정보가 확인되지 않았습니다.");
            return;
        }

        // categoryData 필드 제거
        const { categoryData, ...cleanedForm } = productForm;

        const submitData = {
            ...cleanedForm,
            descriptionText,
            thumbnail,
            detailImages,
            memberId: userInfo.memberId,
            memberEmail: userInfo.memberEmail,
            memberName: userInfo.memberName,
            memberBname: userInfo.memberBname,
            memberBnum: userInfo.memberBnum
        };

        console.log("✅ 최종 제출 데이터:", submitData);

        // 실제 제출 예시
        // axios.post("/api/products", submitData)
        //     .then(res => console.log(res))
        //     .catch(err => console.error(err));
    };

    // 현재 탭에 따라 콘텐츠 렌더링
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
                                disabled={!userInfo}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: userInfo ? '#00a43c' : 'gray',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: userInfo ? 'pointer' : 'not-allowed',
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
                {/* 경고창 */}
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
