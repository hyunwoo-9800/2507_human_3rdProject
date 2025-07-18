import React, { useEffect } from 'react'
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
    const val = e.target.value
    if (val === '' || /^[0-9]*$/.test(val)) {
      setForm((prev) => ({ ...prev, productPrice: val }))
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
