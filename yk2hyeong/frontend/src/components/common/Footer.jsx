import React, { useEffect, useState, useRef } from 'react'
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

  // 챗봇 버튼 애니메이션/툴팁 상태
  const [showTooltip, setShowTooltip] = useState(true)
  const [isBouncing, setIsBouncing] = useState(false)
  const phaseRef = useRef(0) // 0: 말풍선, 1: 바운스

  useEffect(() => {
    let timer
    const runSequence = () => {
      if (phaseRef.current === 0) {
        setShowTooltip(true)
        setIsBouncing(false)
        timer = setTimeout(() => {
          setShowTooltip(false)
          phaseRef.current = 1
          timer = setTimeout(runSequence, 5000) // 10초 후 바운스
        }, 3000)
      } else {
        setIsBouncing(true)
        timer = setTimeout(() => {
          setIsBouncing(false)
          phaseRef.current = 0
          timer = setTimeout(runSequence, 5000) // 10초 후 말풍선
        }, 2000)
      }
    }
    runSequence()
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    axios
      .get('/notice/latest')
      .then((res) => setLatestNotice(res.data))
      .catch((err) => console.error('공지사항 불러오기 실패:', err))
  }, [])
  return (
    <footer className="footer-container" style={{ position: 'relative' }}>
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
      <div style={{ position: 'fixed', right: 40, bottom: 40, zIndex: 1000 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {showTooltip && <div className="chatbot-tooltip">챗봇에게 물어보세요!</div>}
          <CustomFloatButton
            icon={<FontAwesomeIcon icon={faRobot} style={{ fontSize: '32px' }} />}
            tooltip="AI 챗봇"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              fontSize: 32,
              right: 0,
              bottom: 0,
              position: 'relative',
            }}
            className={isBouncing ? 'bounce-anim' : ''}
            onClick={() =>
              window.open('http://192.168.0.139:5000/', '_blank', 'width=700,height=700')
            }
          />
        </div>
      </div>
    </footer>
  )
}
