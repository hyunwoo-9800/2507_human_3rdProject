import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MemberCustomCard from '../../components/member/MemberCustomCard'
import Button from '../../components/common/Button'
import './signupRoleSelect.css'

function SignupRoleSelect() {
  const navigate = useNavigate()
  const [roleMap, setRoleMap] = useState({})

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
    alert(`${type === 'seller' ? '판매자' : '구매자'} 가입 안내 팝업 뜰 예정!`)
  }

  return (
    <div className="signup-role-page">
      <h2 className="signup-title">회원가입</h2>
      <div className="signup-card-container">
        {/* 판매자 카드 */}
        <MemberCustomCard
          image="/images/seller.png"
          company="판매자 회원가입"
          productName="직접판매자, 위탁판매자, 매수판매자 대상"
          layout="column"
          width={500}
          footer={
            <div className="signup-btn-group">
              <Button size="sm" onClick={() => handleGuideClick('seller')}>
                가입안내
              </Button>
              <Button size="sm" color="success" onClick={() => handleSignupClick('seller')}>
                회원가입
              </Button>
            </div>
          }
        />

        {/* 구매자 카드 */}
        <MemberCustomCard
          image="/images/buyer.png"
          company="구매자 회원가입"
          productName="중도매인, 유통업체, 식자재업체, 가공업체 대상"
          layout="column"
          width={500}
          footer={
            <div className="signup-btn-group">
              <Button size="sm" onClick={() => handleGuideClick('buyer')}>
                가입안내
              </Button>
              <Button size="sm" color="success" onClick={() => handleSignupClick('buyer')}>
                회원가입
              </Button>
            </div>
          }
        />
      </div>

      {/* 하단 로그인 링크 */}
      <p className="signup-login-link">
        계정이 있으신가요? <a href="/login">로그인</a>
      </p>
    </div>
  )
}

export default SignupRoleSelect
