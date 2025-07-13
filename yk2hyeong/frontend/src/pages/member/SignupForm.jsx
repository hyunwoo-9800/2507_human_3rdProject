import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import './signupForm.css';
import axios from 'axios';

function SignupForm({ role }) {
    const navigate = useNavigate();
    const location = useLocation();
    const roleCode = location.state?.roleCode;

    const [businessCertFile, setBusinessCertFile] = useState(null);
    const [bankBookFile, setBankBookFile] = useState(null);

    const [emailMessage, setEmailMessage] = useState('');
    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [userInputCode, setUserInputCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const [isSendingCode, setIsSendingCode] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [codeExpireCountdown, setCodeExpireCountdown] = useState(0);
    const [codeExpired, setCodeExpired] = useState(false);

    const [form, setForm] = useState({
        memberEmail: '',
        memberPwd: '',
        memberName: '',
        memberTel: '',
        memberAddr: '',
        memberDetailAddr: '',
        memberBname: '',
        memberBnum: '',
        memberShipperName: '',
        memberBankCode: '',
        memberAccountNum: '',
        memberRole: '',
    });

    const [bankOptions, setBankOptions] = useState([]);

    useEffect(() => {
        if (roleCode) {
            setForm(prev => ({ ...prev, memberRole: roleCode }));
        }
    }, [roleCode]);

    useEffect(() => {
        axios.get('/common/bank').then(res => {
            const options = res.data.map(code => ({
                value: code.lowCodeValue,
                label: code.lowCodeName,
            }));
            setBankOptions(options);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e, setter) => {
        setter(e.target.files[0]);
    };

    const checkEmailDuplicate = async () => {
        try {
            const res = await axios.get(`/member/checkEmail?email=${form.memberEmail}`);
            if (res.data.exists) {
                setEmailMessage("이미 사용 중인 이메일입니다.");
                setIsEmailAvailable(false);
            } else {
                setEmailMessage("사용 가능한 이메일입니다.");
                setIsEmailAvailable(true);
            }
        } catch (err) {
            setEmailMessage("중복 확인 중 오류 발생");
            setIsEmailAvailable(false);
        }
    };

    const isValidPassword = (password) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    const requestCode = () => {
        if (!isEmailAvailable || resendCountdown > 0) return;

        if (!isValidEmail(form.memberEmail)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }
        setIsSendingCode(true);
        setResendCountdown(30);         // 재전송 30초 제한
        setCodeExpireCountdown(180);    // 인증번호 유효기간 3분
        setCodeExpired(false);

        axios.post("/member/send-code", null, { params: { email: form.memberEmail } })
            .then(() => {
                alert("인증번호가 발송되었습니다.");
                setShowCodeInput(true);
            })
            .catch(() => {
                alert("메일 발송 실패");
                setResendCountdown(0);
                setCodeExpireCountdown(0);
                setCodeExpired(true);
            })
            .finally(() => {
                setIsSendingCode(false);
            });
    };

    useEffect(() => {
        if (resendCountdown <= 0) return;
        const timer = setInterval(() => {
            setResendCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCountdown]);

    useEffect(() => {
        if (codeExpireCountdown <= 0) return;
        const timer = setInterval(() => {
            setCodeExpireCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCodeExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [codeExpireCountdown]);

    const verifyCode = () => {
        if (codeExpired) {
            alert("인증번호가 만료되었습니다. 다시 요청해주세요.");
            return;
        }

        axios.get("/member/verify-code", {
            params: { email: form.memberEmail, code: userInputCode }
        }).then(() => {
            alert("인증 성공!");
            setIsVerified(true);
            setShowCodeInput(false);
        }).catch(() => alert("인증 실패!"));
    };

    const handleBankSelect = (value) => {
        setForm(prev => ({ ...prev, memberBankCode: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("member", new Blob([JSON.stringify(form)], { type: "application/json" }));
        if (businessCertFile) formData.append("businessCertImage", businessCertFile);
        if (bankBookFile) formData.append("bankBookImage", bankBookFile);

        try {
            await axios.post("/member/signup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("회원가입 성공");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("회원가입 실패");
        }
    };

    return (
        <div className="signup-form-container">
            <h2>{role === 'SELLER' ? '판매자' : '구매자'} 회원가입</h2>

            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label className="input-label">이메일</label>
                    <Input
                        name="memberEmail"
                        value={form.memberEmail}
                        onChange={handleChange}
                        placeholder="이메일"
                        type="email"
                        required
                    />
                    {emailMessage && (
                        <div style={{ color: isEmailAvailable ? 'green' : 'red', fontSize: '12px', marginTop: '4px' }}>
                            {emailMessage}
                        </div>
                    )}
                </div>

                {/* 인증번호 관련 코드 */}
                <div className="email-input-btn-wrapper">
                    <Button
                        type="button"
                        size="sm"
                        onClick={requestCode}
                        disabled={!isEmailAvailable || resendCountdown > 0}
                    >
                        {resendCountdown > 0 ? `다시 요청 (${resendCountdown}s)` : "인증번호 발송"}
                    </Button>
                </div>

                {showCodeInput && !isVerified && (
                    <div className="email-code-section">
                        <div className="code-input-wrapper">
                            <Input
                                placeholder="인증번호 입력"
                                value={userInputCode}
                                onChange={(e) => setUserInputCode(e.target.value)}
                                size="sm"
                            />
                        </div>
                        <Button type="button" size="sm" onClick={verifyCode}>
                            인증 확인
                        </Button>
                        {codeExpireCountdown > 0 ? (
                            <span style={{ fontSize: '12px', color: '#555' }}>
                                남은 시간: {Math.floor(codeExpireCountdown / 60)}:{(codeExpireCountdown % 60).toString().padStart(2, '0')}
                            </span>
                        ) : (
                            <span style={{ fontSize: '12px', color: 'red' }}>
                                인증번호가 만료되었습니다.
                            </span>
                        )}
                    </div>
                )}

                {isVerified && (
                    <p style={{ fontSize: '12px', color: 'green', marginTop: '4px' }}> 인증 완료되었습니다.</p>
                )}

                {/* 기타 입력 필드들 */}
                <Input label="비밀번호" name="memberPwd" value={form.memberPwd} onChange={handleChange} placeholder="비밀번호" type="password" required />
                <Input label="이름" name="memberName" value={form.memberName} onChange={handleChange} placeholder="이름" required />
                <Input label="전화번호" name="memberTel" value={form.memberTel} onChange={handleChange} placeholder="연락처" required />
                <Input label="상세 주소" name="memberAddr" value={form.memberAddr} onChange={handleChange} placeholder="주소" />
                <Input label="상세 주소" name="memberDetailAddr" value={form.memberDetailAddr} onChange={handleChange} placeholder="상세주소" />
                <Input label="사업자명" name="memberBname" value={form.memberBname} onChange={handleChange} placeholder="사업자명" required />
                <Input label="사업자 등록번호" name="memberBnum" value={form.memberBnum} onChange={handleChange} placeholder="사업자등록번호" required />
                <div className="custom-file-input">
                    <label>사업자 등록증</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBusinessCertFile)} />
                </div>
                {role === 'SELLER' && (
                    <Input label="출하자(상호)명" name="memberShipperName" value={form.memberShipperName} onChange={handleChange} placeholder="출하자명" required />
                )}
                <div className="signup-btn-row">
                    <Button type="button" size="md" color="secondary" onClick={() => navigate('/')}>취소하기</Button>
                    <Button type="submit" size="md" color="primary">회원가입</Button>
                </div>
            </form>
        </div>
    );
}

export default SignupForm;
