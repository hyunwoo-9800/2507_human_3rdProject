import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../common/Button'
import './NoticeDetail.css'
import CustomLoading from '../common/CustomLoading'
import { useLogin } from '../../pages/login/LoginContext'

function NoticeDetail() {
  const { id } = useParams()
  const [notice, setNotice] = useState(null)
  const navigate = useNavigate()

  const { loginMember, isLoading } = useLogin()
  const isAdmin = loginMember?.memberRole === '001'

  useEffect(() => {
    axios
      .get(`/notice/detail/${id}`, {
        withCredentials: true, // ✅ 쿠키 인증 요청
      })
      .then((res) => setNotice(res.data))
      .catch((err) => console.error('공지사항 조회 실패:', err))
  }, [id])

  if (isLoading || !notice) {
    return (
      <div className="notice-detail-container">
        <CustomLoading size="large" />
      </div>
    )
  }

  return (
    <div className="notice-detail-container">
      <div className="notice-detail-title">
        <span>{notice.noticeTitle}</span>
        <span className="notice-detail-date">
          작성일 : {new Date(notice.createdDate).toLocaleDateString()}
        </span>
      </div>

      <div className="notice-detail-box">{notice.noticeContent}</div>

      <div className="notice-detail-actions">
          {isAdmin && (
              <button
                  type="button"
                  style={{
                      backgroundColor: '#f3b30b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '18px',
                      transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c49009')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3b30b')}
                  onClick={() => navigate(`/notice/edit/${id}`)}
              >
                  수정하기
              </button>
          )}
            <button
              type="button"
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
              onClick={() => navigate('/notice')}
            >
              목록으로
            </button>
      </div>
    </div>
  )
}

export default NoticeDetail
