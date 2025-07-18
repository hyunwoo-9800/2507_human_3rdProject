import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './productTabs.css'
import dayjs from 'dayjs'
import Input from '../common/Input'
import Radio from '../common/Radio'

export default function ProductNoticeTab({ product, memberId }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('create') // 'create' or 'edit'
  const [editNoticeId, setEditNoticeId] = useState(null)
  const [noticeType, setNoticeType] = useState('NOTICE')
  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')

  // 판매자 권한 체크
  const isOwner = memberId && product && memberId === product.memberId

  // fetchNotices를 useEffect 바깥으로 분리
  const fetchNotices = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products/${product?.productId}/notices`)
      const mapped = response.data.map((n) => ({
        id: n.productNoticeId,
        title: n.title,
        content: n.productNoticeContent,
        type: n.productNoticeType,
        createdDate: n.createdDate,
        updatedDate: n.updatedDate,
        memberId: n.memberId,
      }))
      setNotices(mapped)
    } catch (error) {
      console.error('공지사항 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (product) {
      fetchNotices()
    }
  }, [product])

  const getNoticeTypeColor = (type) => {
    switch (type) {
      case 'WARNING':
        return '#faad14'
      case 'NOTICE':
        return '#52c41a'
      default:
        return '#666'
    }
  }

  // 등록/수정 폼 열기
  const openForm = (type = 'create', notice = null) => {
    setFormType(type)
    setShowForm(true)
    if (type === 'edit' && notice) {
      setEditNoticeId(notice.id)
      setNoticeType(notice.type)
      setNoticeTitle(notice.title)
      setNoticeContent(notice.content)
    } else {
      setEditNoticeId(null)
      setNoticeType('NOTICE')
      setNoticeTitle('')
      setNoticeContent('')
    }
  }

  // 등록/수정 폼 닫기
  const closeForm = () => {
    setShowForm(false)
    setEditNoticeId(null)
    setNoticeType('NOTICE')
    setNoticeTitle('')
    setNoticeContent('')
  }

  // 등록/수정 핸들러 (실제 API 연동 필요)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      alert('제목과 내용을 입력하세요.')
      return
    }
    if (formType === 'create') {
      try {
        await axios.post(
          `/api/products/${product.productId}/notices`,
          {
            title: noticeTitle,
            content: noticeContent,
            type: noticeType,
          },
          {
            headers: {
              memberid: memberId,
            },
          }
        )
        await fetchNotices()
        alert('상품공지를 등록하였습니다.')
      } catch (error) {
        console.error('공지사항 등록 실패:', error)
      }
    } else if (formType === 'edit') {
      try {
        await axios.put(
          `/api/products/${product.productId}/notices/${editNoticeId}`,
          {
            title: noticeTitle,
            content: noticeContent,
            type: noticeType,
          },
          {
            headers: {
              memberid: memberId,
            },
          }
        )
        await fetchNotices()
        alert('상품공지를 수정하였습니다.')
      } catch (error) {
        console.error('공지사항 수정 실패:', error)
      }
    }
    closeForm()
  }

  // 삭제 핸들러 (실제 API 연동 필요)
  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`/api/products/${product.productId}/notices/${id}`, {
          headers: {
            memberid: memberId,
          },
        })
        await fetchNotices()
        alert('상품공지를 삭제하였습니다.')
      } catch (error) {
        console.error('공지사항 삭제 실패:', error)
      }
    }
  }

  if (loading) {
    return <div>공지사항을 불러오는 중...</div>
  }

  return (
    <div className="product-notice-tab">
      <h3>상품 공지사항</h3>

      {isOwner && (
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => openForm('create')} style={{ padding: '6px 16px', fontSize: 16 }}>
            공지 등록
          </button>
        </div>
      )}

      {showForm && (
        <form
          className="notice-form"
          onSubmit={handleSubmit}
          style={{ marginBottom: 24, background: '#f9f9f9', padding: 16, borderRadius: 8 }}
        >
          <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontWeight: 600, marginRight: 8 }}>타입</span>
            <Radio
              name="noticeType"
              value="NOTICE"
              checked={noticeType === 'NOTICE'}
              onChange={() => setNoticeType('NOTICE')}
              label="공지"
            />
            <Radio
              name="noticeType"
              value="WARNING"
              checked={noticeType === 'WARNING'}
              onChange={() => setNoticeType('WARNING')}
              label="중요"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <Input
              label="제목"
              name="noticeTitle"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              placeholder="공지 제목을 입력하세요"
              maxLength={100}
              required
              size="md"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8, verticalAlign: 'top' }}>내용</label>
            <textarea
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              style={{ width: 400, height: 80, fontSize: 16 }}
              maxLength={1000}
              placeholder="공지 내용을 입력하세요"
            />
          </div>
          <button type="submit" style={{ marginRight: 8, padding: '6px 16px', fontSize: 16 }}>
            {formType === 'create' ? '등록' : '수정'}
          </button>
          <button type="button" onClick={closeForm} style={{ padding: '6px 16px', fontSize: 16 }}>
            취소
          </button>
        </form>
      )}

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
                  {notice.type === 'WARNING' && '중요'}
                  {notice.type === 'NOTICE' && '공지'}
                </span>
                <h4 className="notice-title">{notice.title}</h4>
                <span className="notice-date">
                  {(() => {
                    // 등록/수정 날짜와 시간 모두 표시
                    const created = notice.createdDate
                    const updated = notice.updatedDate
                    // 둘 다 있으면, 수정 여부 판단
                    if (created && updated && created !== updated) {
                      return `${dayjs(updated).format('YYYY-MM-DD HH:mm')} (수정)`
                    } else if (created) {
                      return dayjs(created).format('YYYY-MM-DD HH:mm')
                    } else {
                      return ''
                    }
                  })()}
                </span>
                {isOwner && (
                  <>
                    <button style={{ marginLeft: 8 }} onClick={() => openForm('edit', notice)}>
                      수정
                    </button>
                    <button style={{ marginLeft: 4 }} onClick={() => handleDelete(notice.id)}>
                      삭제
                    </button>
                  </>
                )}
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
          <li>최신 공지사항을 확인하여 원활한 거래를 진행해 주세요.</li>
        </ul>
      </div>
    </div>
  )
}
