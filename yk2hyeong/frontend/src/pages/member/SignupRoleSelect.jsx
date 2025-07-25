import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MemberCustomCard from '../../components/member/MemberCustomCard'
import Button from '../../components/common/Button'
import './signupRoleSelect.css'
import GuideModal from './GuideModal'

function SignupRoleSelect() {
  const navigate = useNavigate()
  const [roleMap, setRoleMap] = useState({})

  //   role 상태 관리
  const [guideType, setGuideType] = useState(null)

  // 버튼 hover 상태 관리
  const [sellerGuideHover, setSellerGuideHover] = useState(false)
  const [sellerSignupHover, setSellerSignupHover] = useState(false)
  const [buyerGuideHover, setBuyerGuideHover] = useState(false)
  const [buyerSignupHover, setBuyerSignupHover] = useState(false)

  useEffect(() => {
    axios
      .get('/common/memberRole')
      .then((res) => {
        const map = {}
        res.data.forEach((code) => {
          if (code.lowCodeName.includes('판매자')) map.seller = code.lowCodeValue
          if (code.lowCodeName.includes('구매자')) map.buyer = code.lowCodeValue
        })
        setRoleMap(map)
      })
      .catch((err) => console.error('ROLE 코드 불러오기 실패:', err))
  }, [])

  const handleSignupClick = (type) => {
    const selectedRoleCode = roleMap[type]
    if (!selectedRoleCode) {
      alert('역할 코드가 없습니다.')
      return
    }
    navigate(`/signup/${type}/form`, { state: { roleCode: selectedRoleCode } })
  }

  const handleGuideClick = (type) => {
    setGuideType(type)
  }
  const handleCloseModal = () => {
    setGuideType(null)
  }

  return (
    <div className="signup-role-page">
      <h2 className="signup-title">회원가입</h2>
      <div className="signup-card-container">
        {/* 판매자 카드 */}
        <MemberCustomCard
          image="/static/images/seller.png"
          company="판매자 회원가입"
          productName="직접판매자, 위탁판매자, 매수판매자 대상"
          layout="column"
          width={500}
          footer={
            <div className="signup-btn-group">
              <button
                type="button"
                className="signup-guide-btn"
                style={{
                  backgroundColor: sellerGuideHover ? '#1878c9' : '#1d8ff8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={() => setSellerGuideHover(true)}
                onMouseLeave={() => setSellerGuideHover(false)}
                onClick={() => handleGuideClick('seller')}
              >
                가입안내
              </button>
              <button
                type="button"
                className="signup-signup-btn"
                style={{
                  backgroundColor: sellerSignupHover ? '#218838' : '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={() => setSellerSignupHover(true)}
                onMouseLeave={() => setSellerSignupHover(false)}
                onClick={() => handleSignupClick('seller')}
              >
                회원가입
              </button>
            </div>
          }
        />

        {/* 구매자 카드 */}
        <MemberCustomCard
          image="/static/images/buyer.png"
          company="구매자 회원가입"
          productName="중도매인, 유통업체, 식자재업체, 가공업체 대상"
          layout="column"
          width={500}
          footer={
            <div className="signup-btn-group">
              <button
                type="button"
                className="signup-guide-btn"
                style={{
                  backgroundColor: buyerGuideHover ? '#1878c9' : '#1d8ff8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={() => setBuyerGuideHover(true)}
                onMouseLeave={() => setBuyerGuideHover(false)}
                onClick={() => handleGuideClick('buyer')}
              >
                가입안내
              </button>
              <button
                type="button"
                className="signup-signup-btn"
                style={{
                  backgroundColor: buyerSignupHover ? '#218838' : '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={() => setBuyerSignupHover(true)}
                onMouseLeave={() => setBuyerSignupHover(false)}
                onClick={() => handleSignupClick('buyer')}
              >
                회원가입
              </button>
            </div>
          }
        />
      </div>

      {/* 하단 로그인 링크 */}
      <p className="signup-login-link">
        계정이 있으신가요? <a href="/login">로그인</a>
      </p>
      {guideType && <GuideModal type={guideType} onClose={handleCloseModal} />}
    </div>
  )
}

export default SignupRoleSelect
