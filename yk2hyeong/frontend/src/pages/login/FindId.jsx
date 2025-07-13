import React, { useState } from 'react'
import axios from 'axios'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
// import './findId.css'

function FindId() {
  const [memberName, setMemberName] = useState('') // 이름 상태
  const [memberTel, setMemberTel] = useState('') // 전화번호 상태
  const [idFound, setIdFound] = useState('') // 찾은 아이디(이메일) 상태
  const [errorMessage, setErrorMessage] = useState('') // 오류 메시지 상태

  // 아이디 찾기 요청 처리
  const handleFindId = async (e) => {
    e.preventDefault() // 기본 폼 제출 방지

    try {
      const response = await axios.get('/member/find-id', {
        params: { memberName, memberTel }, // 이름과 전화번호를 서버로 전송
      })

      if (response.data.email) {
        setIdFound(response.data.email) // 이메일(아이디) 반환 받기
        setErrorMessage('') // 오류 메시지 초기화
      } else {
        setErrorMessage('해당 정보로는 아이디를 찾을 수 없습니다.') // 아이디가 없을 경우
        setIdFound('') // 아이디 상태 초기화
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.') // 서버 오류 처리
    }
  }

  return (
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

      <div className="back-link">
        <Button className="secondary" size="md" onClick={() => window.history.back()}>
          뒤로가기
        </Button>
      </div>
    </div>
  )
}

export default FindId
