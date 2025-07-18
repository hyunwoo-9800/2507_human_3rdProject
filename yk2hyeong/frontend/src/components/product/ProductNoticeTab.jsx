import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './productTabs.css'

export default function ProductNoticeTab({ product }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        // 실제 API 호출로 변경
        // const response = await axios.get(`/api/products/${product?.productId}/notices`)

        // 임시 데이터
        const mockNotices = [
          {
            id: 1,
            title: '2024년 7월 4일 출하 안내',
            content:
              '7월 4일 출하 예정인 스테비아 방울토마토의 품질이 우수하여 예상 수량보다 10% 증가된 수량으로 출하됩니다.',
            date: '2024-07-01',
            type: 'info',
          },
          {
            id: 2,
            title: '품질 관리 강화 안내',
            content: '더욱 엄격한 품질 관리를 통해 고객님께 최고 품질의 상품을 제공하겠습니다.',
            date: '2024-06-28',
            type: 'notice',
          },
          {
            id: 3,
            title: '배송 일정 변경 안내',
            content: '기상 상황으로 인해 배송 일정이 1-2일 지연될 수 있습니다. 양해 부탁드립니다.',
            date: '2024-06-25',
            type: 'warning',
          },
        ]

        setNotices(mockNotices)
      } catch (error) {
        console.error('공지사항 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    if (product) {
      fetchNotices()
    }
  }, [product])

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case 'info':
        return '#1890ff'
      case 'warning':
        return '#faad14'
      case 'notice':
        return '#52c41a'
      default:
        return '#666'
    }
  }

  if (loading) {
    return <div>공지사항을 불러오는 중...</div>
  }

  return (
    <div className="product-notice-tab">
      <h3>상품 공지사항</h3>

      <div className="notice-list">
        {notices.length === 0 ? (
          <div className="no-notices">
            <p>등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="notice-item">
              <div className="notice-header">
                <span
                  className="notice-type"
                  style={{ backgroundColor: getNoticeTypeColor(notice.type) }}
                >
                  {notice.type === 'info' && '정보'}
                  {notice.type === 'warning' && '주의'}
                  {notice.type === 'notice' && '공지'}
                </span>
                <h4 className="notice-title">{notice.title}</h4>
                <span className="notice-date">{notice.date}</span>
              </div>
              <div className="notice-content">
                <p>{notice.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notice-info">
        <h4>공지사항 안내</h4>
        <ul>
          <li>상품 관련 중요한 정보는 이곳에서 확인하실 수 있습니다.</li>
          <li>출하 일정, 품질 관련 정보, 배송 안내 등이 포함됩니다.</li>
          <li>최신 공지사항을 확인하여 원활한 거래를 진행해 주세요.</li>
        </ul>
      </div>
    </div>
  )
}
