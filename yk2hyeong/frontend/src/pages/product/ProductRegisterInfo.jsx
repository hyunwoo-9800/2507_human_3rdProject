import React, { useEffect, useState } from 'react'
import Input from '../../components/common/Input'
import CustomDatePicker from '../../components/common/CustomDatePicker'
import CustomAlert from '../../components/common/CustomAlert'
import TwoLevelSelect from '../../components/common/TwoLevelSelect'
import axios from 'axios'
import CustomInputNumber from '../../components/common/CustomInputNumber'
import CustomRadio from '../../components/common/CustomRadio'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

export default function ProductRegisterInfo({ form, setForm, onNext, onBack }) {
  const [showZeroPriceAlert, setShowZeroPriceAlert] = useState(false)
  const isValidDateRange = (start, end) => {
    if (!start || !end) return true
    return dayjs(start).isSameOrBefore(dayjs(end), 'day')
  }

  const handleNameChange = (e) => {
    setForm((prev) => ({ ...prev, productName: e.target.value }))
  }

  const handleStartDateChange = (date) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : ''
    setForm((prev) => ({
      ...prev,
      startDate: formattedDate,
      showDateWarning: !isValidDateRange(formattedDate, form.endDate),
    }))
  }

  const handleEndDateChange = (date) => {
    const formattedDate = date ? date.format('YYYY-MM-DD') : ''
    setForm((prev) => ({
      ...prev,
      endDate: formattedDate,
      showDateWarning: !isValidDateRange(form.startDate, formattedDate),
    }))
  }

  const handlePriceChange = (e) => {
    let val = e.target.value
    // 숫자만 허용
    if (/^[0-9]*$/.test(val)) {
      // 8자리 초과 입력 시 잘라내기
      if (val.length > 8) {
        val = val.slice(0, 8)
      }
      // 99999999 초과 입력 시 자동으로 최대값으로 설정
      if (Number(val) > 99999999) {
        val = '99999999'
      }
      // 빈 값도 허용 (입력란 비우기 가능)
      setForm((prev) => ({ ...prev, productPrice: val }))
      // 가격이 0이면 경고 상태 true, 아니면 false
      if (val === '0') {
        setShowZeroPriceAlert(true)
      } else {
        setShowZeroPriceAlert(false)
      }
    }
  }

  const onOrderTypeChange = (val) => {
    setForm((prev) => ({ ...prev, orderType: val }))
  }

  const handleCategoryChange = ([category, subCategory, detailCodeId]) => {
    console.log('카테고리 변경', category, subCategory, detailCodeId)
    setForm((prev) => ({
      ...prev,
      selectedCategory: category,
      selectedSubCategory: subCategory,
      detailCodeId: detailCodeId,
    }))
  }

  const orderOptions = [
    { label: '즉시구매 + 예약구매', value: 'immediate/reservation' },
    { label: '즉시구매만', value: 'immediate' },
    { label: '예약구매만', value: 'reservation' },
  ]

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/category')
      .then((res) => {
        const filtered = res.data.filter((cat) =>
          ['100', '200', '300', '400'].includes(cat.midCodeValue)
        )
        const formatted = {}
        filtered.forEach((cat) => {
          formatted[cat.midCodeName] = cat.subCategories.map((sub) => ({
            lowCodeName: sub.lowCodeName,
            detailCodeId: sub.detailCodeId,
          }))
        })
        setForm((prev) => ({ ...prev, categoryData: formatted }))
      })
      .catch((err) => {
        console.error('카테고리 불러오기 실패:', err)
      })
  }, [setForm])

  useEffect(() => {
    if (
      form.categoryData &&
      Object.keys(form.categoryData).length > 0 &&
      (!form.selectedCategory || !form.selectedSubCategory || !form.detailCodeId)
    ) {
      const firstCategory = Object.keys(form.categoryData)[0]
      const firstSub = form.categoryData[firstCategory][0]
      setForm((prev) => ({
        ...prev,
        selectedCategory: firstCategory,
        selectedSubCategory: firstSub.lowCodeName,
        detailCodeId: firstSub.detailCodeId,
      }))
    }
  }, [
    form.categoryData,
    form.selectedCategory,
    form.selectedSubCategory,
    form.detailCodeId,
    setForm,
  ])

  if (!form.categoryData || Object.keys(form.categoryData).length === 0) {
    return <div>카테고리 데이터를 불러오는 중입니다...</div>
  }

  const RequiredLabel = ({ children }) => (
    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 20 }}>
      {children} <span style={{ color: 'red' }}>*</span>
    </label>
  )

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
            options={orderOptions}
            name="orderType"
          />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <RequiredLabel>상품 카테고리를 선택해주세요.</RequiredLabel>
        <TwoLevelSelect
          categoryData={form.categoryData}
          value={[form.selectedCategory, form.selectedSubCategory, form.detailCodeId]}
          onChange={handleCategoryChange}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <Input
          label="kg당 가격을 입력해주세요. (1원 ~ 99,999,999원)"
          name="productPrice"
          value={form.productPrice}
          onChange={handlePriceChange}
          placeholder="예) 1250"
          required
        />
        {showZeroPriceAlert && (
          <div style={{ color: 'red', marginLeft: '2px', marginTop: 6, fontSize: 14 }}>
            가격은 0원으로 등록할 수 없습니다.
          </div>
        )}
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
            onChange={(val) => setForm((prev) => ({ ...prev, saleQuantity: Number(val) || 0 }))}
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
            onChange={(val) => setForm((prev) => ({ ...prev, minSaleUnit: Number(val) || 0 }))}
          />
        </div>
        {form.minSaleUnit > form.saleQuantity && (
          <div style={{ color: 'red', marginLeft: '13px', marginTop: 6, fontSize: 14 }}>
            최소 판매 단위는 판매 수량보다 많을 수 없습니다.
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <RequiredLabel>판매 시작일</RequiredLabel>
        <CustomDatePicker
          style={{ marginLeft: '13px' }}
          onChange={handleStartDateChange}
          value={form.startDate ? dayjs(form.startDate) : null}
          needConfirm={true}
          format="YYYY-MM-DD"
          minDate={dayjs()}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        <RequiredLabel>판매 종료일</RequiredLabel>
        <CustomDatePicker
          style={{ marginLeft: '13px' }}
          onChange={handleEndDateChange}
          value={form.endDate ? dayjs(form.endDate) : null}
          needConfirm={true}
          format="YYYY-MM-DD"
          minDate={dayjs()}
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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#888',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          이전
        </button>
        <button
          onClick={onNext}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00a43c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          다음
        </button>
      </div>
    </div>
  )
}
