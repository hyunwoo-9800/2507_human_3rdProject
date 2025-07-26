import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../pages/login/LoginContext';
import CustomLoading from '../../components/common/CustomLoading';
import CustomDropdown from '../../components/common/CustomDropdown';
import './header.css';

export default function Header() {
    const { loginMember, logout, isLoading } = useLogin();
    const isAdmin = loginMember?.memberRole === '001';

    if (isLoading) {
        return <CustomLoading size="small" />;
    }

    return (
        <header className="header">
            {/* 좌측 */}
            <div className="header-left">
                <Link to="/">
                    <img
                        src={process.env.PUBLIC_URL + '/static/images/logo.png'}
                        alt="로고"
                        className="logo-img"
                    />
                </Link>
                <nav className="nav">
                    <Link to="/productlist" className="nav-item">
                        상품리스트
                    </Link>
                    <Link to="/chart" className="nav-item">
                        시세추이
                    </Link>
                    <Link to="/notice" className="nav-item">
                        공지사항
                    </Link>
                    <Link to="/siteinfo" className="nav-item">
                        사이트소개
                    </Link>
                </nav>
            </div>

            {/* 우측 */}
            <div className="header-right">
                {loginMember ? (
                    <>
                        <CustomDropdown userName={loginMember.memberName}>
                            {isAdmin ? (
                                <Link to="/admin" className="dropdown-item" style={dropdownItemStyle}>
                                    관리자페이지
                                </Link>
                            ) : (
                                <Link to="/mypage" className="dropdown-item" style={dropdownItemStyle}>
                                    마이페이지
                                </Link>
                            )}
                            <Link to="/EditMember" className="dropdown-item" style={dropdownItemStyle}>
                                회원정보 수정
                            </Link>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={logout}
                                style={{
                                    ...dropdownItemStyle,
                                    background: 'none',
                                    border: 'none',
                                    width: '100%',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                로그아웃
                            </button>
                        </CustomDropdown>

                        {loginMember.memberRole === '002' && (
                            <Link to="/product/register" className="btn register">
                                상품 등록하기
                            </Link>
                        )}
                    </>
                ) : (
                    <Link to="/login" className="btn login">
                        로그인/회원가입
                    </Link>
                )}
            </div>
        </header>
    );
}

const dropdownItemStyle = {
    padding: '8px 16px',
    display: 'block',
    textDecoration: 'none',
    color: '#222',
    borderBottom: '1px solid #eee',
};
