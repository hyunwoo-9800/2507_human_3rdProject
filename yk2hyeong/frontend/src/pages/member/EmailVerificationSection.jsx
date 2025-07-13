import React, { useState } from 'react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import axios from 'axios';

export default function EmailVerificationSection({ email }) {
    const [codeSent, setCodeSent] = useState(false);      // 인증창 노출 여부
    const [code, setCode] = useState('');                 // 사용자가 입력한 인증번호
    const [verified, setVerified] = useState(false);      // 인증 성공 여부

    const handleSendCode = async () => {
        try {
            await axios.post('/member/send-code', null, { params: { email } });
            alert('인증번호가 발송되었습니다.');
            setCodeSent(true);  // 입력창 표시 시작
        } catch (err) {
            alert('인증번호 발송 실패');
        }
    };

    const handleVerifyCode = async () => {
        try {
            const res = await axios.get('/member/verify-code', { params: { email, code } });
            alert('인증 성공');
            setVerified(true);
        } catch (err) {
            alert('인증 실패');
        }
    };

    return (
        <div className="email-verification-section">
            {!verified && (
                <>
                    <Button onClick={handleSendCode}>인증번호 발송</Button>

                    {codeSent && (
                        <div style={{ marginTop: '12px' }}>
                            <Input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="인증번호 입력"
                                size="md"
                            />
                            <Button onClick={handleVerifyCode} style={{ marginLeft: '8px' }}>인증 확인</Button>
                        </div>
                    )}
                </>
            )}
            {verified && <p style={{ color: 'green' }}>✅ 인증 완료</p>}
        </div>
    );
}
