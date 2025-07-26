import React, { useState } from 'react'
import axios from 'axios'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import './findId.css'

function FindId() {
  const [memberName, setMemberName] = useState('')
  const [memberTel, setMemberTel] = useState('')
  const [idFound, setIdFound] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFindId = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.get('/member/find-id', {
        params: { memberName, memberTel },
      })

      const email = response.data.email
      const message = response.data.message || ''

      setIdFound(email)
      setErrorMessage('') // 이전 에러 메시지 초기화

    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message

      // 상태코드에 따라 사용자에게 보여줄 메시지 처리
      switch (status) {
        case 423: // 휴면
          setErrorMessage('해당 계정은 휴면 상태입니다. 관리자에게 문의해주세요.')
          break
        case 410: // 탈퇴
          setErrorMessage('해당 계정은 이미 탈퇴된 상태입니다.')
          break
        case 403: // 미승인
          setErrorMessage('해당 계정은 아직 승인되지 않았습니다.')
          break
        case 404: // 정보 없음
          setErrorMessage('일치하는 회원 정보가 없습니다.')
          break
        default: // 기타 서버 오류
          setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.')
      }

      // 오류가 난 경우에는 이전에 찾은 이메일 정보도 초기화
      setIdFound('')
    }
  }

  return (
    <div className="find-id-wrapper">
      <div className="back-link">
        <button className="login-back-btn" onClick={() => window.history.back()}>
          ＜ 뒤로가기
        </button>
      </div>
      <div className="find-id-container">
        <h2>아이디 찾기</h2>
        <form onSubmit={handleFindId}>
          <Input
            type="text"
            className="find-id-input"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="이름"
            required
          />
          <Input
            type="text"
            className="find-id-input"
            value={memberTel}
            onChange={(e) => setMemberTel(e.target.value)}
            placeholder="전화번호"
            required
          />
          <Button className="secondary" size="md" type="submit">
            아이디 찾기
          </Button>
        </form>

        {idFound && (
          <div className="found-id">
            <p>찾은 아이디(이메일): {idFound}</p>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  )
}

export default FindId
