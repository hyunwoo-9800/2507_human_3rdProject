import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

/**
 * 헤더 컴포넌트
 * @author 조현우
 * @since 2025-07-05
 */

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/">
          <img
            src={process.env.PUBLIC_URL + "/images/sample.jpg"}
            alt="로고"
            className="logo-img"
            onClick={() => console.log("clicked!")}
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

      <div className="header-right">
        <Link to="/login" className="btn login">
          로그인/회원가입
        </Link>
        <Link to="/product/register" className="btn register">
          상품 등록하기
        </Link>
      </div>
    </header>
  );
}
