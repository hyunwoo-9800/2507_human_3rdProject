import React, { useState, useEffect } from 'react'
import CustomSelect from '../../components/common/CustomSelect'
import ForecastChart from '../../components/chart/ForecastChart'
import './productTabs.css'

export default function PriceChartTab({ product }) {
  // 폼 데이터 저장
  const [form, setForm] = useState({
    timeFrame: 'week',
  })

  // 기간 선택 처리
  const handlePeriodChange = (value) => {
    setForm((prev) => ({ ...prev, timeFrame: value }))
  }

  return (
    <div className="price-chart-tab">
      <label htmlFor="selectedPeriod" className="input-label">
        기간
      </label>
      <CustomSelect
        placeholder="검색 기간을 선택하세요"
        onChange={handlePeriodChange}
        defaultValue="week"
        options={[
          { value: 'week', label: '주간' },
          { value: 'month', label: '월간' },
          { value: 'year', label: '연간' },
        ]}
      />

      <div>
        <h3>실거래 가격(도매)</h3>
        <ForecastChart detailCodeId={product.lowCodeValue} timeFrame={form.timeFrame} />
      </div>
    </div>
  )
}
