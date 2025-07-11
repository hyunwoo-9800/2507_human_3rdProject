import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../pages/login/LoginContext';
import CustomLoading from '../../components/common/CustomLoading';
import "./header.css";

export default function Header() {
    const navigate = useNavigate();
    const { loginMember, logout, isLoading } = useLogin();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (isLoading) {
        return <CustomLoading size="small" />;
    }

    return (
        <header className="header">
            {/* 좌측 */}
            <div className="header-left">
                <Link to="/">
                    <img src={process.env.PUBLIC_URL + "/images/sample.jpg"} alt="로고" className="logo-img" />
                </Link>
                <nav className="nav">
                    <Link to="/admin" className="nav-item">상품리스트</Link>
                    <Link to="/member" className="nav-item">시세추이</Link>
                    <Link to="/product" className="nav-item">사이트소개</Link>
                </nav>
            </div>

            {/* 우측 */}
            <div className="header-right">
                {loginMember ? (
                    <>
                        <div className="dropdown-wrapper">
                            <button onClick={() => setDropdownOpen(p => !p)} className="btn dropdown-toggle">
                                {loginMember.memberName} ▼
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/mypage" className="dropdown-item">회원정보 수정</Link>
                                    <button className="dropdown-item" onClick={logout}>로그아웃</button>
                                </div>
                            )}
                        </div>
                        {loginMember.memberRole === "002" && (
                            <Link to="/product/register" className="btn register">상품 등록하기</Link>
                        )}
                    </>
                ) : (
                    <Link to="/login" className="btn login">로그인/회원가입</Link>
                )}
            </div>
        </header>
    );
}
