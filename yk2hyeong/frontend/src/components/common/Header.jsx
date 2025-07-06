// 헤더 컴포넌트
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
  const navigate = useNavigate();

  // localStorage에서 로그인 정보 불러오기
  const loginMember = JSON.parse(localStorage.getItem("loginMember"));

  const [dropdownOpen, setDropdownOpen] = useState(false);

  console.log("현재 로그인 정보:", loginMember);

  // 로그아웃 시 localStorage에서 삭제 및 /login으로 이동
  const handleLogout = () => {
    localStorage.removeItem("loginMember");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* 좌측: 로고 + 메뉴 */}
      <div className="header-left">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + "/images/sample.jpg"}
            alt="로고"
            className="logo-img"
          />
        </Link>
        <nav className="nav">
          <Link to="/admin" className="nav-item">
            상품리스트
          </Link>
          <Link to="/member" className="nav-item">
            시세추이
          </Link>
          <Link to="/product" className="nav-item">
            사이트소개
          </Link>
        </nav>
      </div>

      {/* 우측: 로그인 정보 표시 */}
      <div className="header-right">
        {loginMember ? (
          <div className="dropdown-wrapper">
            {/* 사용자 이름 클릭 시 드롭다운 */}
            <button
              className="btn dropdown-toggle"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {loginMember.memberName} ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/mypage" className="dropdown-item">
                  회원정보 수정
                </Link>
                <button className="dropdown-item" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          // 비로그인 상태
          <Link to="/login" className="btn login">
            로그인/회원가입
          </Link>
        )}

        {/* 로그인 상태 + 판매자만 보이도록 조건부 처리 */}
        {loginMember?.memberRole === "SELLER" && (
          <Link to="/product/register" className="btn register">
            상품 등록하기
          </Link>
        )}
      </div>
    </header>
  );
}
