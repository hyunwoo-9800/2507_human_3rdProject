import React from "react";
import "./footer.css";
import {Link} from "react-router-dom";

/**
 * 푸터 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */

export default function Footer() {
  return (
    <footer className="footer-container">
        <div className="footer-left">
            <div className="notice-box">
                <h4>공지사항</h4>
                <p>공지사항 상품 픽업 시 배송수수료 결제 관련 안내입니다.</p>
            </div>
            <div className="footer-info">
                [250704] 충청남도 천안시 동남구 대흥로 215 7층 <br/>
                Copyrignt &copy; Yk2hyeong. All Right Reserved.
            </div>
        </div>
        <div className="footer-rignt">
            <Link to="/">
                <img
                    src={process.env.PUBLIC_URL + '/static/images/logo.png'}
                    alt="로고"
                    className="logo-img"
                />
            </Link>
        </div>
    </footer>
  );
}
