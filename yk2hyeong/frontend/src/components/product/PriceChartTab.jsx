import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './productTabs.css'

export default function PriceChartTab({ product }) {
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 시세 데이터 가져오기 (실제 API 엔드포인트로 변경 필요)
    const fetchPriceData = async () => {
      try {
        setLoading(true)
        // 실제 API 호출로 변경
        // const response = await axios.get(`/api/products/${product?.productId}/price-history`)

        // 임시 데이터
        const mockData = [
          { date: '2024-01', price: 9500 },
          { date: '2024-02', price: 9800 },
          { date: '2024-03', price: 10200 },
          { date: '2024-04', price: 10500 },
          { date: '2024-05', price: 10800 },
          { date: '2024-06', price: 10500 },
        ]

        setPriceData(mockData)
      } catch (error) {
        console.error('시세 데이터 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (product) {
      fetchPriceData()
    }
  }, [product])

  if (loading) {
    return <div>시세 데이터를 불러오는 중...</div>
  }

  return (
    <div className="price-chart-tab">
      <h3>시세 추이</h3>

      <div className="price-summary">
        <div className="current-price">
          <h4>현재 가격</h4>
          <p className="price">{product?.productUnitPrice?.toLocaleString()}원</p>
        </div>

        <div className="price-change">
          <h4>가격 변동</h4>
          <p className="change positive">+500원 (5.0%)</p>
        </div>
      </div>

      <div className="price-chart">
        <h4>최근 6개월 가격 추이</h4>
        <div className="chart-container">
          {/* 실제 차트 라이브러리 사용 권장 (Chart.js, Recharts 등) */}
          <div className="mock-chart">
            {priceData.map((item, index) => (
              <div key={index} className="chart-bar">
                <div
                  className="bar"
                  style={{
                    height: `${(item.price / 12000) * 200}px`,
                    backgroundColor: item.price === 10500 ? '#1890ff' : '#d9d9d9',
                  }}
                ></div>
                <span className="price-label">{item.price.toLocaleString()}원</span>
                <span className="date-label">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="price-analysis">
        <h4>가격 분석</h4>
        <ul>
          <li>최고가: 10,800원 (2024년 5월)</li>
          <li>최저가: 9,500원 (2024년 1월)</li>
          <li>평균가: 10,300원</li>
          <li>가격 변동성: 보통</li>
        </ul>
      </div>
    </div>
  )
}
