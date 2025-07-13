import React, { useState } from 'react'
import axios from 'axios'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
// import './resetPassword.css'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('') // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState('') // 비밀번호 확인
  const [errorMessage, setErrorMessage] = useState('') // 오류 메시지 상태
  const [successMessage, setSuccessMessage] = useState('') // 성공 메시지 상태

  // 비밀번호 재설정 요청 처리
  const handleResetPassword = async (e) => {
    e.preventDefault()

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (newPassword !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      // 비밀번호 재설정 요청
      const response = await axios.put('/member/reset-password', { newPassword })

      if (response.status === 200) {
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다!')
        setErrorMessage('') // 오류 메시지 초기화
      }
    } catch (error) {
      setErrorMessage('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="reset-password-container">
      <h2>비밀번호 재설정</h2>

      {/* 새 비밀번호 입력 */}
      <form onSubmit={handleResetPassword}>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
          required
        />

        {/* 비밀번호 확인 입력 */}
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 확인"
          required
        />

        <Button className="secondary" size="md" type="submit">
          비밀번호 변경
        </Button>
      </form>

      {/* 성공 메시지 */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* 오류 메시지 */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* 뒤로가기 버튼 */}
      <div className="back-link">
        <Button className="secondary" size="md" onClick={() => window.history.back()}>
          뒤로가기
        </Button>
      </div>
    </div>
  )
}

export default ResetPassword
