import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import CustomSelect from '../../components/common/CustomSelect'
import AddressSearchModal from '../../components/common/AddressSearchModal'
import './signupForm.css'
import axios from 'axios'

function SignupForm({ role }) {
  const navigate = useNavigate()
  const location = useLocation()
  const roleCode = location.state?.roleCode // 역할 코드(판매자/구매자) 가져오기

  // 파일 업로드 상태 관리
  const [businessCertFile, setBusinessCertFile] = useState(null)
  const [bankBookFile, setBankBookFile] = useState(null)

  // 이메일 중복 확인 메시지 및 상태
  const [emailMessage, setEmailMessage] = useState('')
  const [isEmailAvailable, setIsEmailAvailable] = useState(null)
  const [showCodeInput, setShowCodeInput] = useState(false) // 인증번호 입력창 상태
  const [userInputCode, setUserInputCode] = useState('') // 사용자가 입력한 인증번호
  const [isVerified, setIsVerified] = useState(false) // 인증 여부

  // 인증 요청 상태 및 타이머 관리
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0) // 재전송 대기시간
  const [codeExpireCountdown, setCodeExpireCountdown] = useState(0) // 인증번호 만료 시간
  const [codeExpired, setCodeExpired] = useState(false) // 인증번호 만료 여부

  // 주소 입력 상태
  const [address, setAddress] = useState('')
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false) // 주소 검색 모달 열기/닫기

  // 폼 데이터 상태
  const [form, setForm] = useState({
    memberEmail: '',
    memberPwd: '',
    memberName: '',
    memberTel: '',
    memberAddr: '', // 도로명 주소
    memberDetailAddr: '',
    memberBname: '',
    memberBnum: '',
    memberShipperName: '',
    memberBankCode: '',
    memberAccountNum: '',
    memberRole: '',
  })

  const [bankOptions, setBankOptions] = useState([]) // 은행 옵션 목록

  // 역할 코드가 있으면 폼에 역할값 추가
  useEffect(() => {
    if (roleCode) {
      setForm((prev) => ({ ...prev, memberRole: roleCode }))
    }
  }, [roleCode])

  // 은행 코드 리스트 불러오기
  useEffect(() => {
    axios.get('/common/bank').then((res) => {
      const options = res.data.map((code) => ({
        value: code.lowCodeValue,
        label: code.lowCodeName,
      }))
      setBankOptions(options)
    })
  }, [])

  // 입력 값 변경 시 폼 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  // 파일 업로드 상태 관리
  const handleFileChange = (e, setter) => {
    setter(e.target.files[0])
  }

  // 이메일 중복 확인 함수
  const checkEmailDuplicate = async () => {
    try {
      const res = await axios.get(`/member/checkEmail?email=${form.memberEmail}`)
      if (res.data.exists) {
        setEmailMessage('이미 사용 중인 이메일입니다.')
        setIsEmailAvailable(false)
      } else {
        setEmailMessage('사용 가능한 이메일입니다.')
        setIsEmailAvailable(true)
      }
    } catch (err) {
      setEmailMessage('중복 확인 중 오류 발생')
      setIsEmailAvailable(false)
    }
  }

  // 이메일 입력값 변경 시 중복 확인
  useEffect(() => {
    if (form.memberEmail) {
      checkEmailDuplicate()
    }
  }, [form.memberEmail])

  // 비밀번호 유효성 검사 (영문, 숫자, 특수문자 포함 8자 이상)
  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
  }

  // 인증번호 요청 함수
  const requestCode = () => {
    if (!isEmailAvailable || resendCountdown > 0) return

    if (!form.memberEmail || !isEmailAvailable) {
      alert('이메일을 올바르게 입력해주세요.')
      return
    }
    setIsSendingCode(true)
    setResendCountdown(30)
    setCodeExpireCountdown(180)
    setCodeExpired(false)

    axios
      .post('/member/send-code', null, { params: { email: form.memberEmail } })
      .then(() => {
        alert('인증번호가 발송되었습니다.')
        setShowCodeInput(true)
      })
      .catch(() => {
        alert('메일 발송 실패')
        setResendCountdown(0)
        setCodeExpireCountdown(0)
        setCodeExpired(true)
      })
      .finally(() => setIsSendingCode(false))
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
          setCodeExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [codeExpireCountdown])

  // 인증번호 확인 함수
  const verifyCode = () => {
    if (codeExpired) {
      alert('인증번호가 만료되었습니다. 다시 요청해주세요.')
      return
    }

    axios
      .get('/member/verify-code', {
        params: { email: form.memberEmail, code: userInputCode },
      })
      .then(() => {
        alert('인증 성공!')
        setIsVerified(true)
        setShowCodeInput(false)
      })
      .catch(() => alert('인증 실패!'))
  }

  // 은행 선택 처리
  const handleBankSelect = (value) => {
    setForm((prev) => ({ ...prev, memberBankCode: value }))
  }

  // 회원가입 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('member', new Blob([JSON.stringify(form)], { type: 'application/json' }))
    if (businessCertFile) formData.append('businessCertImage', businessCertFile)
    if (bankBookFile) formData.append('bankBookImage', bankBookFile)

    try {
      await axios.post('/member/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('회원가입 성공')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('회원가입 실패')
    }
  }

  return (
    <div className="signup-form-container">
      <h2>{role === 'SELLER' ? '판매자' : '구매자'} 회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        {/* 이메일 입력 */}
        <div className="input-group">
          <label className="input-label">이메일</label>
          <Input
            name="memberEmail"
            value={form.memberEmail}
            onChange={handleChange}
            placeholder="이메일"
            type="email"
            maxLength={50}
            required
          />
          {emailMessage && (
            <div
              style={{
                color: isEmailAvailable ? 'green' : 'red',
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              {emailMessage}
            </div>
          )}
        </div>

        {/* 인증번호 발송 버튼 */}
        <div className="email-input-btn-wrapper">
          <Button
            type="button"
            size="sm"
            onClick={requestCode}
            disabled={!isEmailAvailable || resendCountdown > 0}
          >
            {resendCountdown > 0 ? `다시 요청 (${resendCountdown}s)` : '인증번호 발송'}
          </Button>
        </div>

        {/* 인증번호 입력 */}
        {showCodeInput && !isVerified && (
          <div className="email-code-section">
            <Input
              placeholder="인증번호 입력"
              value={userInputCode}
              onChange={(e) => setUserInputCode(e.target.value)}
              size="sm"
              maxLength={6}
            />
            <Button type="button" size="sm" onClick={verifyCode}>
              인증 확인
            </Button>
            {codeExpireCountdown > 0 ? (
              <span style={{ fontSize: '12px', color: '#555' }}>
                남은 시간: {Math.floor(codeExpireCountdown / 60)}:
                {(codeExpireCountdown % 60).toString().padStart(2, '0')}
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: 'red' }}>인증번호가 만료되었습니다.</span>
            )}
          </div>
        )}

        {isVerified && <p style={{ fontSize: '12px', color: 'green' }}>인증 완료되었습니다.</p>}

        {/* 비밀번호, 이름, 전화번호 등의 필드 */}
        <Input
          label="비밀번호"
          name="memberPwd"
          value={form.memberPwd}
          onChange={handleChange}
          placeholder="비밀번호"
          type="password"
          maxLength={20}
          required
        />
        <Input
          label="이름"
          name="memberName"
          value={form.memberName}
          onChange={handleChange}
          placeholder="이름"
          maxLength={30}
          required
        />
        <Input
          label="전화번호"
          name="memberTel"
          value={form.memberTel}
          onChange={handleChange}
          placeholder="연락처"
          maxLength={13}
          required
        />

        {/* 주소 입력 */}
        <div className="input-group">
          <label className="input-label">주소</label>
          <div className="address-search-input-container">
            <input
              type="text"
              placeholder="주소 검색"
              value={address}
              readOnly
              className="address-input"
              onClick={() => setIsAddressModalOpen(true)}
            />
            <button
              type="button"
              className="search-icon-button"
              onClick={() => setIsAddressModalOpen(true)}
            >
              🔍
            </button>
          </div>
        </div>

        {isAddressModalOpen && (
          <AddressSearchModal
            onClose={() => setIsAddressModalOpen(false)} // 모달 닫기
            onComplete={(selectedAddress) => {
              setAddress(selectedAddress) // 선택된 주소 상태 설정
              setForm((prev) => ({ ...prev, memberAddr: selectedAddress }))
              setIsAddressModalOpen(false) // 모달 닫기
            }}
          />
        )}

        {/* 상세 주소, 사업자명, 사업자등록번호 등의 필드 */}
        <Input
          label="상세 주소"
          name="memberDetailAddr"
          value={form.memberDetailAddr}
          onChange={handleChange}
          placeholder="상세주소"
          maxLength={100}
        />
        <Input
          label="사업자명"
          name="memberBname"
          value={form.memberBname}
          onChange={handleChange}
          placeholder="사업자명"
          maxLength={60}
          required
        />
        <Input
          label="사업자 등록번호"
          name="memberBnum"
          value={form.memberBnum}
          onChange={handleChange}
          placeholder="사업자등록번호"
          maxLength={30}
          required
        />

        {/* 파일 업로드: 사업자 등록증 및 통장 사본 */}
        <div className="custom-file-input">
          <label>사업자 등록증</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBusinessCertFile)}
          />
        </div>

        {/* 은행 선택 */}
        <div className="input-group">
          <label htmlFor="memberBankCode" className="input-label">
            은행
          </label>
          <CustomSelect
            placeholder="은행을 선택하세요"
            onChange={handleBankSelect}
            options={bankOptions}
          />
        </div>

        <Input
          label="계좌번호"
          name="memberAccountNum"
          value={form.memberAccountNum}
          onChange={handleChange}
          placeholder="계좌번호"
          maxLength={30}
          required
        />

        <div className="custom-file-input">
          <label>통장 사본</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setBankBookFile)}
          />
        </div>

        {/* 회원가입 버튼 */}
        <div className="signup-btn-row">
          <Button type="button" size="md" color="secondary" onClick={() => navigate('/')}>
            취소하기
          </Button>
          <Button type="submit" size="md" color="primary">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
