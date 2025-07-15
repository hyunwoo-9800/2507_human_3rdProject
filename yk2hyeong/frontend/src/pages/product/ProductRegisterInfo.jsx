import React, { useEffect } from 'react';
import Input from "../../components/common/Input";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import CustomAlert from "../../components/common/CustomAlert";
import TwoLevelSelect from "../../components/common/TwoLevelSelect";
import axios from "axios";
import CustomInputNumber from "../../components/common/CustomInputNumber";
import CustomRadio from "../../components/common/CustomRadio";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export default function ProductRegisterInfo({ form, setForm, onNext }) {
    const orderOptions = {
        immediate: true,
        reservation: true,
    };

    const isValidDateRange = (start, end) => {
        if (!start || !end) return true;
        return dayjs(start).isSameOrBefore(dayjs(end), 'day');
    };

    const handleNameChange = (e) => {
        setForm(prev => ({ ...prev, productName: e.target.value }));
    };

    const handleStartDateChange = (date) => {
        setForm(prev => ({
            ...prev,
            startDate: date,
            showDateWarning: !isValidDateRange(date, form.endDate)
        }));
    };

    const handleEndDateChange = (date) => {
        setForm(prev => ({
            ...prev,
            endDate: date,
            showDateWarning: !isValidDateRange(form.startDate, date)
        }));
    };

    const handlePriceChange = (e) => {
        const val = e.target.value;
        if (val === '' || /^[0-9]*$/.test(val)) {
            setForm(prev => ({ ...prev, productPrice: val }));
        }
    };

    const onOrderTypeChange = (val) => {
        setForm(prev => ({ ...prev, orderType: val }));
    };

    const handleCategoryChange = ([category, subCategory, detailCodeId]) => {
        setForm(prev => ({
            ...prev,
            selectedCategory: category,
            selectedSubCategory: subCategory,
            detailCodeId: detailCodeId
        }));
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/category')
            .then(res => {
                const filtered = res.data.filter(cat => ['100', '200', '300', '400'].includes(cat.midCodeValue));
                const formatted = {};
                filtered.forEach(cat => {
                    formatted[cat.midCodeName] = cat.subCategories.map(sub => ({
                        lowCodeName: sub.lowCodeName,
                        detailCodeId: sub.detailCodeId
                    }));
                });
                setForm(prev => ({ ...prev, categoryData: formatted }));
            })
            .catch(err => {
                console.error('카테고리 불러오기 실패:', err);
            });
    }, [setForm]);

    if (!form.categoryData || Object.keys(form.categoryData).length === 0) {
        return <div>카테고리 데이터를 불러오는 중입니다...</div>;
    }

    const RequiredLabel = ({ children }) => (
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
            {children} <span style={{ color: 'red' }}>*</span>
        </label>
    );

    const isFormValid =
        form.productName?.trim() !== '' &&
        form.productPrice?.trim() !== '' &&
        form.startDate !== null &&
        form.endDate !== null &&
        form.detailCodeId !== null &&
        form.saleQuantity > 0 &&
        form.minSaleUnit > 0 &&
        !form.showDateWarning;

    return (
        <div>
            <h2>2. 기본정보 입력</h2>

            <Input
                label="상품명을 입력해주세요."
                name="productName"
                value={form.productName}
                onChange={handleNameChange}
                placeholder="상품명을 입력해주세요."
                required
            />

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>거래 유형을 선택해주세요.</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <CustomRadio
                        value={form.orderType}
                        onChange={onOrderTypeChange}
                        options={[
                            ...(orderOptions.immediate ? [{ label: '즉시 구매', value: 'immediate' }] : []),
                            ...(orderOptions.reservation ? [{ label: '예약 구매', value: 'reservation' }] : []),
                        ]}
                        name="orderType"
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>상품 카테고리를 선택해주세요.</RequiredLabel>
                <TwoLevelSelect
                    categoryData={form.categoryData}
                    onChange={handleCategoryChange}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <Input
                    label="kg당 가격을 입력해주세요."
                    name="productPrice"
                    value={form.productPrice}
                    onChange={handlePriceChange}
                    placeholder="예) 1250"
                    required
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매수량을 입력해주세요. (1~1000kg)</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <CustomInputNumber
                        defaultValue={100}
                        min={1}
                        max={1000}
                        step={1}
                        value={form.saleQuantity}
                        onChange={(val) => setForm(prev => ({ ...prev, saleQuantity: val }))}
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>최소 판매단위를 입력해주세요.</RequiredLabel>
                <div style={{ marginLeft: '13px' }}>
                    <CustomInputNumber
                        defaultValue={10}
                        min={1}
                        max={1000}
                        step={1}
                        value={form.minSaleUnit}
                        onChange={(val) => setForm(prev => ({ ...prev, minSaleUnit: val }))}
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매 시작일</RequiredLabel>
                <CustomDatePicker
                    style={{ marginLeft: '13px' }}
                    onChange={handleStartDateChange}
                    value={form.startDate}
                    needConfirm={true}
                    format="YYYY-MM-DD"
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <RequiredLabel>판매 종료일</RequiredLabel>
                <CustomDatePicker
                    style={{ marginLeft: '13px' }}
                    onChange={handleEndDateChange}
                    value={form.endDate}
                    needConfirm={true}
                    format="YYYY-MM-DD"
                />
            </div>

            {form.showDateWarning && (
                <div style={{ marginTop: '12px' }}>
                    <CustomAlert
                        type="warning"
                        message="종료일은 시작일보다 이후여야 합니다."
                        description="판매 종료일은 판매 시작일보다 늦은 날짜여야 합니다."
                    />
                </div>
            )}

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
