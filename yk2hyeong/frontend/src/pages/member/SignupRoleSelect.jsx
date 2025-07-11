import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import axios from "axios";

function SignupRoleSelect() {
    const navigate = useNavigate();
    const [roleMap, setRoleMap] = useState({}); // 판매자/구매자 역할 코드 상태 관리

    // 컴포넌트 마운트 시 역할 코드 가져오기
    useEffect(() => {
        axios.get('/common/memberRole')
            .then(res => {
                const map = {};
                res.data.forEach(code => {
                    // '판매자'와 '구매자' 코드 찾아서 roleMap에 저장
                    if (code.lowCodeName.includes('판매자')) map.seller = code.lowCodeValue;
                    if (code.lowCodeName.includes('구매자')) map.buyer = code.lowCodeValue;
                });
                setRoleMap(map); // 상태에 역할 코드 저장
            })
            .catch(err => console.error('ROLE 코드 불러오기 실패:', err));
    }, []);

    // 회원가입 클릭 시 역할에 맞는 폼으로 이동
    const handleSignupClick = (type) => {
        const selectedRoleCode = roleMap[type];
        if (!selectedRoleCode) {
            alert('역할 코드가 없습니다.');
            return;
        }
        navigate(`/signup/${type}/form`, { state: { roleCode: selectedRoleCode } }); // 선택된 역할로 폼 이동
    };

    // 가입 안내 클릭 시 팝업 알림
    const handleGuideClick = (type) => {
        alert(`${type === 'seller' ? '판매자' : '구매자'} 가입 안내 팝업 뜰 예정!`);
    };

    return (
        <div className="signup-select-container">
            <h2>회원가입</h2>
            <div className="role-card-wrapper">
                {/* 판매자 회원가입 카드 */}
                <div className="role-card">
                    <h3>판매자 회원가입</h3>
                    <p>
                        대상<br />
                        - 직접판매자(APC, RPC, 산지조직 등)<br />
                        - 위탁판매자(도매시장법인, 공판장)<br />
                        - 매수판매자(시장도매인)
                    </p>
                    <div className="btn-group">
                        <Button size="sm" onClick={() => handleGuideClick('seller')}>가입안내</Button>
                        <Button size="sm" color="success" onClick={() => handleSignupClick('seller')}>회원가입</Button>
                    </div>
                </div>

                {/* 구매자 회원가입 카드 */}
                <div className="role-card">
                    <h3>구매자 회원가입</h3>
                    <p>
                        대상<br />
                        - 중도매인<br />
                        - 직접구매자(유통업체, 식자재업체, 가공업체 등)
                    </p>
                    <div className="btn-group">
                        <Button size="sm" onClick={() => handleGuideClick('buyer')}>가입안내</Button>
                        <Button size="sm" color="success" onClick={() => handleSignupClick('buyer')}>회원가입</Button>
                    </div>
                </div>
            </div>

            {/* 로그인 링크 */}
            <p className="login-link">계정이 있으신가요? <a href="/login">로그인</a></p>
        </div>
    );
}

export default SignupRoleSelect;
