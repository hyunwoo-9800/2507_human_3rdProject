import React, {useEffect, useState} from 'react';
import Input from "../../components/common/Input";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import CustomAlert from "../../components/common/CustomAlert";
import TwoLevelSelect from "../../components/common/TwoLevelSelect";
import axios from "axios";
import CustomInputNumber from "../../components/common/CustomInputNumber";
import CustomRadio from "../../components/common/CustomRadio";
import dayjs from "dayjs"; // 알림 메시지용 (선택사항)
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export default function ProductRegisterInfo({ onNext }) {
    // 상품명 상태 관리
    const [productName, setProductName] = useState('');
    // 판매 시작일 상태 관리
    const [startDate, setStartDate] = useState(null);
    // 판매 종료일 상태 관리
    const [endDate, setEndDate] = useState(null);
    // 날짜 경고 표시 여부 상태 관리
    const [showDateWarning, setShowDateWarning] = useState(false);
    // 가격 상태 관리
    const [productPrice, setProductPrice] = useState('');

    const [detailCodeId, setDetailCodeId] = useState(null);

    // 카테고리 선택
    const [categoryData, setCategoryData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    //수량
    const [saleQuantity, setSaleQuantity] = useState(100);
    const [minSaleUnit, setMinSaleUnit] = useState(10);

    //라디오버튼
    const [orderType, setOrderType] = useState('immediate'); // 기본값 예시
    const orderOptions = {
        immediate: true,
        reservation: true,
    };
    const onOrderTypeChange = (val) => {
        console.log('거래 유형 변경:', val);
    };

    const handleCategoryChange = ([category, subCategory, detailCodeId]) => {
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);
        console.log('선택된 카테고리:', category, subCategory, detailCodeId);
        // 여기서 detailCodeId 상태로 저장해도 좋습니다.
        setDetailCodeId(detailCodeId); // 필요하다면 useState로 따로 관리
    };

    // 컴포넌트 마운트 시 카테고리 데이터 불러오기
    useEffect(() => {
        axios.get('http://localhost:8080/api/category')
            .then(res => {
                const filtered = res.data
                    .filter(cat =>
                        ['100', '200', '300', '400'].includes(cat.midCodeValue)
                    );

                // TwoLevelSelect에서 기대하는 형태로 변환
                const formatted = {};
                filtered.forEach(cat => {
                    formatted[cat.midCodeName] = cat.subCategories.map(sub => ({
                        lowCodeName: sub.lowCodeName,
                        detailCodeId: sub.detailCodeId
                    }));
                });
                setCategoryData(formatted);
            })
            .catch(err => {
                console.error('카테고리 불러오기 실패:', err);
            });
    }, []);

    if (Object.keys(categoryData).length === 0) {
        return <div>카테고리 데이터를 불러오는 중입니다...</div>;
    }

    // 상품명 입력값 변경 핸들러
    const handleNameChange = (e) => setProductName(e.target.value);

    // 날짜 범위 유효성 검사 함수
    // 시작일이 종료일보다 같거나 이전인지 확인
    const isValidDateRange = (start, end) => {
        if (!start || !end) return true;
        return dayjs(start).isSameOrBefore(dayjs(end), 'day');
    };

    // 판매 시작일 변경 핸들러
    const handleStartDateChange = (date, dateString) => {
        console.log('판매시작일 변경:', date, dateString);
        setStartDate(date); // date는 dayjs 객체임
        setShowDateWarning(!isValidDateRange(date, endDate));
    };

    const handleEndDateChange = (date, dateString) => {
        console.log('판매종료일 변경:', date, dateString);
        setEndDate(date);
        setShowDateWarning(!isValidDateRange(startDate, date));
    };

    // 가격 입력값 변경 핸들러
    const handlePriceChange = (e) => {
        const val = e.target.value;
        // 숫자만 허용, 공백은 허용 (입력 중인 상태)
        if (val === '' || /^[0-9]*$/.test(val)) {
            setProductPrice(val);
        }
    };

    // 필수 표시가 포함된 라벨 컴포넌트
    const RequiredLabel = ({ children }) => (
        <label
            style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}
        >
            {children} <span style={{ color: 'red' }}>*</span>
        </label>
    );


    const isFormValid =
        productName.trim() !== '' &&
        productPrice.trim() !== '' &&
        startDate !== null &&
        endDate !== null &&
        detailCodeId !== null &&
        saleQuantity > 0 &&
        minSaleUnit > 0 &&
        !showDateWarning; // 날짜 유효성도 통과해야 함

    return (
        <div>
            <h2>2. 기본정보 입력</h2>

            {/* 상품명 입력 필드 */}
            <div>
                <Input
                    label="상품명을 입력해주세요."
                    name="productName"
                    value={productName}
                    onChange={handleNameChange}
                    placeholder="상품명을 입력해주세요."
                    required
                />
            </div>

            {/* 거래유형 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>거래 유형을 선택해주세요.</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    < CustomRadio
                        value={orderType}
                        onChange={(val) => {
                            setOrderType(val);
                            onOrderTypeChange(val);
                        }}
                        options={[
                            ...(orderOptions.immediate ? [{ label: '즉시 구매', value: 'immediate' }] : []),
                            ...(orderOptions.reservation ? [{ label: '예약 구매', value: 'reservation' }] : []),
                        ]}
                        name="orderType" />
                </div>
            </div>

            {/* 카테고리 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>상품 카테고리를 선택해주세요.</RequiredLabel>
                <TwoLevelSelect
                    categoryData={categoryData}
                    onChange={handleCategoryChange}
                />
            </div>

            {/* 가격 */}
            <div style={{ marginTop: '20px' }}>
                <Input
                    label="kg당 가격을 입력해주세요."
                    name="productPrice"
                    value={productPrice}
                    onChange={handlePriceChange}
                    placeholder="예) 1250"
                    required
                />
            </div>

            {/* 판매수량 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매수량을 입력해주세요. (1~1000kg)</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <CustomInputNumber
                        defaultValue={100}
                        min={1}
                        max={1000}
                        step={1}
                        value={saleQuantity}
                        onChange={(val) => {
                            console.log('판매수량 변경:', val);
                            setSaleQuantity(val);
                        }}
                    />
                </div>
            </div>

            {/* 최소판매단위 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>최소 판매단위를 입력해주세요.</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <CustomInputNumber
                        defaultValue={10}
                        min={1}
                        max={1000}
                        step={1}
                        value={minSaleUnit}
                        onChange={(val) => {
                            console.log('최소판매단위 변경:', val);
                            setMinSaleUnit(val);
                        }}
                    />
                </div>
            </div>


            {/* 판매 시작일 입력 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매 시작일</RequiredLabel>
                <CustomDatePicker
                    style={{ marginLeft: '13px' }}
                    onChange={handleStartDateChange}
                    value={startDate}
                    needConfirm={true}
                    format="YYYY-MM-DD"
                />
            </div>

            {/* 판매 종료일 입력 */}
            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매 종료일</RequiredLabel>
                <CustomDatePicker
                    style={{ marginLeft: '13px' }}
                    onChange={handleEndDateChange}
                    value={endDate}
                    needConfirm={true}
                    format="YYYY-MM-DD"
                />
            </div>

            {/* 날짜 경고 메시지 출력 */}
            {showDateWarning && (
                <div style={{ marginTop: '12px' }}>
                    <CustomAlert
                        type="warning"
                        message="종료일은 시작일보다 이후여야 합니다."
                        description="판매 종료일은 판매 시작일보다 늦은 날짜여야 합니다."
                    />
                </div>
            )}

            {/* 버튼 오른쪽 정렬 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button
                    disabled={!isFormValid}
                    onClick={onNext}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isFormValid ? '#00a43c' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    다음
                </button>
            </div>

        </div>
    );
}
