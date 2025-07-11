import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CustomSelect from '../../components/common/CustomSelect';
import axios from 'axios';

function SignupForm({ role }) {
    const navigate = useNavigate();
    const location = useLocation();

    const roleCode = location.state?.roleCode; // 페이지 이동 시 전달된 역할 코드

    // 폼 상태 관리
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

    // 은행 옵션 상태
    const [bankOptions, setBankOptions] = useState([]);

    // 입력값 변경 시 폼 업데이트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // 은행 선택 시 업데이트
    const handleBankSelect = (value) => {
        setForm(prev => ({ ...prev, memberBankCode: value }));
    };

    // 서버에서 은행 목록 가져오기
    useEffect(() => {
        axios.get('/common/bank')
            .then(res => {
                const options = res.data.map(code => ({
                    value: code.lowCodeValue,
                    label: code.lowCodeName,
                }));
                setBankOptions(options);
            });
    }, []);

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...form,
            memberRole: roleCode,
            role, // BUYER or SELLER
        };

        try {
            const response = await axios.post('/member/signup', dataToSend);

            if (response.status === 200) {
                alert('회원가입 성공!');
                navigate('/login'); // 로그인 페이지로 이동
            } else {
                alert('회원가입 실패');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
        }
    };

    return (
        <div className="signup-form-container">
            <h2>{role === 'SELLER' ? '판매자' : '구매자'} 회원가입</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                {/* 이메일 입력 */}
                <Input label="이메일" name="memberEmail" value={form.memberEmail} onChange={handleChange} placeholder="이메일" type="email" required />
                {/* 비밀번호 입력 */}
                <Input label="비밀번호" name="memberPwd" value={form.memberPwd} onChange={handleChange} placeholder="비밀번호" type="password" required />
                {/* 이름 입력 */}
                <Input label="이름" name="memberName" value={form.memberName} onChange={handleChange} placeholder="이름" required />
                {/* 전화번호 입력 */}
                <Input label="전화번호" name="memberTel" value={form.memberTel} onChange={handleChange} placeholder="연락처" required />
                {/* 주소 입력 */}
                <Input label="주소" name="memberAddr" value={form.memberAddr} onChange={handleChange} placeholder="주소" required />
                <Input label="상세 주소" name="memberDetailAddr" value={form.memberDetailAddr} onChange={handleChange} placeholder="상세주소" />

                {/* 사업자명 입력 */}
                <Input label="사업자명" name="memberBname" value={form.memberBname} onChange={handleChange} placeholder="사업자명" required />
                {/* 사업자 등록번호 입력 */}
                <Input label="사업자 등록번호" name="memberBnum" value={form.memberBnum} onChange={handleChange} placeholder="사업자등록번호" required />

                {/* 판매자일 경우만 출하자명 입력 */}
                {role === 'SELLER' && (
                    <Input label="출하자(상호)명" name="memberShipperName" value={form.memberShipperName} onChange={handleChange} placeholder="출하자명" required />
                )}

                {/* 은행 선택 */}
                <div className="input-group">
                    <label htmlFor="memberBankCode" className="input-label">은행</label>
                    <CustomSelect
                        placeholder="은행을 선택하세요"
                        onChange={handleBankSelect}
                        options={bankOptions}
                    />
                </div>

                {/* 계좌번호 입력 */}
                <Input label="계좌번호" name="memberAccountNum" value={form.memberAccountNum} onChange={handleChange} placeholder="계좌번호" required />

                {/* 회원가입 버튼 */}
                <Button type="submit" size="md" color="primary">회원가입</Button>
            </form>
        </div>
    );
}

export default SignupForm;
