import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'

function SellerTerms() {
  // 약관 체크 상태 관리
  const [checked, setChecked] = useState({
    terms: false,
    privacy: false,
    thirdparty: false,
  })

  // 약관 펼침/접힘 상태 관리
  const [expanded, setExpanded] = useState({
    terms: false,
    privacy: false,
    thirdparty: false,
  })

  const navigate = useNavigate() // 페이지 이동을 위한 navigate 함수

  // 모든 약관에 동의했는지 확인
  const allAgreed = Object.values(checked).every(Boolean)

  // 약관 펼침/접힘 토글
  const handleToggleExpand = (key) => {
    setExpanded({ ...expanded, [key]: !expanded[key] })
  }

  // 체크박스 상태 변경
  const handleCheck = (key) => {
    setChecked({ ...checked, [key]: !checked[key] })
  }

  // '다음' 버튼 클릭 시
  const handleNext = () => {
    if (!allAgreed) {
      alert('모든 약관에 동의하셔야 다음으로 진행할 수 있습니다.')
      return
    }
    navigate('/signup/seller/form') // 모든 약관에 동의하면 다음 페이지로 이동
  }

  return (
    <div className="terms-container">
      <h2>구매자 회원가입</h2>

      {/* 서비스 이용 약관 */}
      <div className="terms-box">
        <div className="terms-header" onClick={() => handleToggleExpand('terms')}>
          <label>
            <input type="checkbox" checked={checked.terms} onChange={() => handleCheck('terms')} />
            서비스 이용 약관 (필수)
          </label>
          <span className="toggle-btn">{expanded.terms ? '▲' : '▼'}</span>
        </div>
        {expanded.terms && (
          <div className="terms-content">
            <p>[서비스 이용약관 내용입니다...]</p>
          </div>
        )}
      </div>

      {/* 개인정보 수집 */}
      <div className="terms-box">
        <div className="terms-header" onClick={() => handleToggleExpand('privacy')}>
          <label>
            <input
              type="checkbox"
              checked={checked.privacy}
              onChange={() => handleCheck('privacy')}
            />
            개인정보 수집 및 동의 (필수)
          </label>
          <span className="toggle-btn">{expanded.privacy ? '▲' : '▼'}</span>
        </div>
        {expanded.privacy && (
          <div className="terms-content">
            <p>[개인정보 수집 및 동의 내용입니다...]</p>
          </div>
        )}
      </div>

      {/* 제3자 제공 동의 */}
      <div className="terms-box">
        <div className="terms-header" onClick={() => handleToggleExpand('thirdparty')}>
          <label>
            <input
              type="checkbox"
              checked={checked.thirdparty}
              onChange={() => handleCheck('thirdparty')}
            />
            제3자 정보제공 동의 (필수)
          </label>
          <span className="toggle-btn">{expanded.thirdparty ? '▲' : '▼'}</span>
        </div>
        {expanded.thirdparty && (
          <div className="terms-content">
            <p>[제3자 정보제공 동의 내용입니다...]</p>
          </div>
        )}
      </div>

      {/* '다음' 버튼 */}
      <div className="terms-btn">
        <Button size="md" color="secondary" onClick={handleNext} disabled={!allAgreed}>
          다음
        </Button>
      </div>
    </div>
  )
}

export default SellerTerms
