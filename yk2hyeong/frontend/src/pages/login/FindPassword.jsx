import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import './findPassword.css'

function FindPasswordPage() {
  const navigate = useNavigate()
  const [memberEmail, setMemberEmail] = useState('') // 이메일 상태
  const [userInputCode, setUserInputCode] = useState('') // 입력한 인증번호 상태
  const [isVerified, setIsVerified] = useState(false) // 인증 여부 상태
  const [codeSent, setCodeSent] = useState(false) // 인증번호 발송 여부
  const [newPassword, setNewPassword] = useState('') // 새 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState('') // 오류 메시지 상태
  const [isSendingCode, setIsSendingCode] = useState(false) // 인증번호 발송 중 상태
  const [resendCountdown, setResendCountdown] = useState(0) // 재전송 대기시간
  const [codeExpireCountdown, setCodeExpireCountdown] = useState(180) // 인증번호 만료 시간 (3분)
  const [codeExpired, setCodeExpired] = useState(false) // 인증번호 만료 여부
  const [passwordHint, setPasswordHint] = useState('') // 비밀번호 힌트 상태

  // 인증번호 발송 요청
  const handleSendCode = async (e) => {
    e.preventDefault()

    if (isSendingCode || resendCountdown > 0) return // 중복 클릭 방지

    setIsSendingCode(true) // 인증번호 발송 중 상태 설정
    setResendCountdown(30) // 재전송 대기시간 30초 설정
    setCodeExpireCountdown(180) // 3분 타이머 설정
    setCodeExpired(false) // 인증번호 만료 초기화

    try {
      const response = await axios.post('/member/send-code-password-reset', {
        email: memberEmail, // 이메일을 요청 본문에 포함하여 보내기
      })

      if (response.status === 200) {
        setCodeSent(true) // 인증번호 발송 성공
        setErrorMessage('')
        alert('인증번호가 이메일로 발송되었습니다!')
      }
    } catch (error) {
      setErrorMessage('이메일을 확인해 주세요!')
    } finally {
      setIsSendingCode(false) // 인증번호 발송 후 상태 초기화
    }
  }

  // 인증번호 검증 요청
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('/member/verify-code-password-reset', {
        params: { email: memberEmail, code: userInputCode }, // 이메일과 입력한 인증번호 전달
      })
      if (response.status === 200) {
        setIsVerified(true) // 인증 성공
        setErrorMessage('')
        alert('인증이 완료되었습니다! 비밀번호를 재설정해주세요.')
      } else {
        setErrorMessage('인증번호가 잘못되었습니다. 다시 시도해주세요.') // 인증 실패 메시지 추가
      }
    } catch (error) {
      setErrorMessage('인증번호가 잘못되었습니다. 다시 시도해주세요.')
    }
  }

  // 비밀번호 변경 요청
  const handleResetPassword = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/member/reset-password', {
        email: memberEmail,
        newPassword: newPassword,
      })
      if (response.status === 200) {
        alert('비밀번호가 변경되었습니다!')
        navigate('/login')
      }
    } catch (error) {
      setErrorMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }

  // 재전송 타이머 관리
  useEffect(() => {
    if (resendCountdown <= 0) return
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev <= 1 ? clearInterval(timer) || 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCountdown])

  // 인증번호 만료 타이머 관리
  useEffect(() => {
    if (codeExpireCountdown <= 0) return
    const timer = setInterval(() => {
      setCodeExpireCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCodeExpired(true) // 인증번호 만료
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [codeExpireCountdown])

  // 비밀번호 유효성 검사 (영문, 숫자, 특수문자 포함 8자 이상)
  const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return regex.test(password)
  }

  // 비밀번호 힌트 표시
  useEffect(() => {
    if (newPassword) {
      setPasswordHint(
        isValidPassword(newPassword)
          ? '비밀번호가 안전합니다.'
          : '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'
      )
    }
  }, [newPassword])

  return (
      <div className="find-id-wrapper">
        <div className="back-link">
          <button className="login-back-btn" onClick={() => navigate(-1)}>
            ＜ 뒤로가기
          </button>
        </div>
        <div className="find-id-container">
          <h2>비밀번호 찾기</h2>

          {/* 이메일 입력 폼 */}
          <form onSubmit={handleSendCode}>
            <Input
                type="email"
                name="memberEmail"
                value={memberEmail}
                className="find-id-input"
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="가입한 이메일 주소를 입력하세요"
                required
            />
            <Button
                className="secondary password-btn"
                size="md"
                type="submit"
                disabled={isSendingCode || resendCountdown > 0}
            >
              {resendCountdown > 0 ? `다시 요청 (${resendCountdown}s)` : '인증번호 발송'}
            </Button>
          </form>

          {/* 인증번호 입력 폼 */}
          {codeSent && !isVerified && (
              <form onSubmit={handleVerifyCode}>
                <Input
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                    placeholder="인증번호를 입력하세요"
                    required
                />
                <Button className="secondary find-id-input" size="md" type="submit">
                  인증 확인
                </Button>
              </form>
          )}

          {/* 인증 성공 후 비밀번호 재설정 안내 */}
          {isVerified && (
              <div>
                <p>인증이 완료되었습니다! 비밀번호를 재설정해주세요.</p>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호"
                    required
                />
                <p>{passwordHint}</p> {/* 비밀번호 힌트 표시 */}
                <Button className="secondary" size="md" onClick={handleResetPassword}>
                  비밀번호 재설정
                </Button>
              </div>
          )}

          {/* 오류 메시지 */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>

  )
}

export default FindPasswordPage
