import React, { useState } from 'react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import axios from 'axios'

// 이메일 인증 섹션 컴포넌트
export default function EmailVerificationSection({ email }) {
  // 인증번호 발송 여부 (true일 경우 입력창 노출)
  const [codeSent, setCodeSent] = useState(false)

  // 사용자가 입력한 인증번호
  const [code, setCode] = useState('')

  // 인증 완료 여부
  const [verified, setVerified] = useState(false)

  // 인증번호 발송 요청
  const handleSendCode = async () => {
    try {
      await axios.post('/member/send-code', null, { params: { email } })
      alert('인증번호가 발송되었습니다.')
      setCodeSent(true)
    } catch (err) {
      alert('인증번호 발송 실패')
    }
  }

  // 인증번호 확인 요청
  const handleVerifyCode = async () => {
    try {
      const res = await axios.get('/member/verify-code', { params: { email, code } })
      alert('인증 성공')
      setVerified(true)
    } catch (err) {
      alert('인증 실패')
    }
  }

  return (
    <div className="email-verification-section">
      {/* 인증되지 않은 경우에만 인증 UI 표시 */}
      {!verified && (
        <>
          {/* 인증번호 발송 버튼 */}
          <Button onClick={handleSendCode}>인증번호 발송</Button>

          {/* 인증번호 입력창은 발송 후 표시 */}
          {codeSent && (
            <div style={{ marginTop: '12px' }}>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 입력"
                size="md"
              />
              <Button onClick={handleVerifyCode} style={{ marginLeft: '8px' }}>
                인증 확인
              </Button>
            </div>
          )}
        </>
      )}

      {/* 인증 완료 메시지 */}
      {verified && <p style={{ color: 'green' }}> 인증 완료</p>}
    </div>
  )
}
