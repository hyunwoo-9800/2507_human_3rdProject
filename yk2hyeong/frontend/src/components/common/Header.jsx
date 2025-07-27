import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../../pages/login/LoginContext'
import CustomLoading from '../../components/common/CustomLoading'
import CustomDropdown from '../../components/common/CustomDropdown'
import axios from 'axios'
import './header.css'

export default function Header() {
  const { loginMember, logout, isLoading } = useLogin()
  const isAdmin = loginMember?.memberRole === '001'
  const [unreadCount, setUnreadCount] = useState(0)

  // 읽지 않은 알림 개수 가져오기
  const fetchUnreadCount = () => {
    if (loginMember) {
      axios
        .get('/api/mypage/notification/unread-count')
        .then((response) => {
          setUnreadCount(response.data)
        })
        .catch((error) => {
          console.error('읽지 않은 알림 개수 조회 실패:', error)
        })
    }
  }

  useEffect(() => {
    fetchUnreadCount()
  }, [loginMember])

  // 전역에서 알림 개수 업데이트를 위한 함수를 window 객체에 추가
  useEffect(() => {
    window.updateNotificationCount = fetchUnreadCount
    return () => {
      delete window.updateNotificationCount
    }
  }, [loginMember])

  if (isLoading) {
    return <CustomLoading size="small" />
  }

  return (
    <header className="header">
      {/* 좌측 */}
      <div className="header-left">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/static/images/logo.png'}
            alt="로고"
            className="logo-img"
          />
        </Link>
        <nav className="nav">
          <Link to="/productlist" className="nav-item">
            상품리스트
          </Link>
          <Link to="/chart" className="nav-item">
            시세추이
          </Link>
          <Link to="/notice" className="nav-item">
            공지사항
          </Link>
          <Link to="/siteinfo" className="nav-item">
            사이트소개
          </Link>
        </nav>
      </div>

      {/* 우측 */}
      <div className="header-right">
        {loginMember ? (
          <>
            <CustomDropdown userName={loginMember.memberName} unreadCount={unreadCount}>
              {isAdmin ? (
                <Link to="/admin" className="dropdown-item" style={dropdownItemStyle}>
                  관리자페이지
                </Link>
              ) : (
                <Link to="/mypage" className="dropdown-item" style={dropdownItemStyle}>
                  마이페이지
                </Link>
              )}
              <Link to="/EditMember" className="dropdown-item" style={dropdownItemStyle}>
                회원정보 수정
              </Link>
              <button
                type="button"
                className="dropdown-item"
                onClick={logout}
                style={{
                  ...dropdownItemStyle,
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                로그아웃
              </button>
            </CustomDropdown>

            {loginMember.memberRole === '002' && (
              <Link to="/product/register" className="btn register">
                상품 등록하기
              </Link>
            )}
          </>
        ) : (
          <Link to="/login" className="btn login">
            로그인/회원가입
          </Link>
        )}
      </div>
    </header>
  )
}

const dropdownItemStyle = {
  padding: '8px 16px',
  display: 'block',
  textDecoration: 'none',
  color: '#222',
  borderBottom: '1px solid #eee',
}
