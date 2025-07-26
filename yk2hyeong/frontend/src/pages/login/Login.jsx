import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useLogin } from '../../pages/login/LoginContext'
import './login.css'

function LoginPage() {
  const [email, setEmail] = useState('') // 이메일 상태
  const [password, setPassword] = useState('') // 비밀번호 상태
  const navigate = useNavigate() // 페이지 이동 함수
  const { loginMember, setLoginMember } = useLogin() // 로그인 상태 업데이트 함수

  // 로그인 요청 처리
  const handleLogin = async (e) => {
    e.preventDefault() // 기본 폼 제출 방지
    try {
      // 서버로 로그인 요청
      const response = await axios.post('/go/login', { email, password }, { withCredentials: true })
      if (response.status === 200) {

        const member = response.data
        setLoginMember(member) // 로그인 상태 업데이트

        alert(member.memberName + '님 환영합니다!')
        navigate('/') // 홈으로 리디렉션
      }
    } catch (error) {
      // 오류 처리
      if (error.response?.status === 401) alert('이메일 또는 비밀번호가 잘못되었습니다')
      else alert('서버 오류 발생')
    }
  }

  return (
      <div className="login-wrapper">
        <div className="back-link">
          <button className="login-back-btn" onClick={() => navigate(-1)}>
            ＜ 뒤로가기
          </button>
        </div>
        <div className="login-container">
          <h2>로그인</h2>
          <form onSubmit={handleLogin}>
            <Input
                type="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                required
            />

            <Input
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                required
            />

            <div className="login-button-wrapper">

              <Button className="secondary" size="md" type="submit">
                로그인
              </Button>
            </div>
          </form>

          <div>
            <p>
              <a href="/findId">아이디를 잊으셨나요?</a> | <a href="/findPwd">비밀번호를 잊으셨나요?</a>
            </p>
            <p>
              아직 계정이 없으신가요? <a href="/signup">회원가입</a>
            </p>
          </div>
        </div>
      </div>
  )
}

export default LoginPage
