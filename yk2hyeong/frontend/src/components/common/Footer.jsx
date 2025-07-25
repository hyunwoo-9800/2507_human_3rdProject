import React, { useEffect, useState } from 'react'
import './footer.css'
import { Link } from 'react-router-dom'
import CustomFloatButton from './CustomFloatButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const [latestNotice, setLatestNotice] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get('/notice/latest')
      .then((res) => setLatestNotice(res.data))
      .catch((err) => console.error('공지사항 불러오기 실패:', err))
  }, [])
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <div
          className="notice-box"
          onClick={() => {
            if (latestNotice) {
              navigate(`/notice/${latestNotice.noticeId}`)
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <h4>공지사항</h4>
          <p>{latestNotice?.noticeTitle || '공지사항이 없습니다.'}</p>
        </div>
        <div className="footer-info">
          [250704] 충청남도 천안시 동남구 대흥로 215 7층 <br />
          Copyright &copy; Yk2hyeong. All Rights Reserved.
        </div>
      </div>
      <div className="footer-right">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + '/static/images/logo.png'}
            alt="로고"
            className="logo-img"
          />
        </Link>
      </div>
      <CustomFloatButton
        icon={<FontAwesomeIcon icon={faRobot} style={{ fontSize: '32px' }} />} // 아이콘 크기 키움
        tooltip="AI 챗봇"
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          fontSize: 32,
          right: 40,
          bottom: 40,
        }}
        onClick={() => window.open('http://192.168.0.139:5000/', '_blank', 'width=700,height=700')}
      />
    </footer>
  )
}
