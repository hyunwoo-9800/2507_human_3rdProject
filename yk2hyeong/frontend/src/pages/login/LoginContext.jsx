// src/contexts/LoginContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginContext = createContext() // LoginContext 생성

// 로그인 상태를 사용할 수 있게 하는 커스텀 훅
export const useLogin = () => useContext(LoginContext)

export const LoginProvider = ({ children }) => {
  const [loginMember, setLoginMember] = useState(null) // 로그인된 사용자 정보
  const [isLoading, setIsLoading] = useState(true) // 로딩 상태
  const navigate = useNavigate() // 경로 이동

  useEffect(() => {
    // 초기 로드 시 로그인 상태 확인
    axios
      .get('/auth/me', { withCredentials: true })
      .then((res) => setLoginMember(res.data)) // 로그인된 사용자 정보 설정
      .catch(() => setLoginMember(null)) // 로그인되지 않으면 null 설정
      .finally(() => setIsLoading(false)) // 로딩 상태 종료
  }, [])

  // 로그아웃 함수
  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true }) // 서버로 로그아웃 요청
    } catch (err) {
      console.error('로그아웃 실패:', err) // 로그아웃 실패 시 에러 로그
    } finally {
      setLoginMember(null) // 로그아웃 후 상태 초기화
      navigate('/') // 로그아웃 후 메인 페이지로 이동
    }
  }

  // 로그인 상태와 관련된 값들을 Context.Provider로 제공
  return (
    <LoginContext.Provider value={{ loginMember, setLoginMember, logout, isLoading }}>
      {children}
    </LoginContext.Provider>
  )
}
