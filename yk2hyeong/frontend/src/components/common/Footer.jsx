import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import CustomFloatButton from "./CustomFloatButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-left">
                <div className="notice-box">
                    <h4>공지사항</h4>
                    <p>공지사항 상품 픽업 시 배송수수료 결제 관련 안내입니다.</p>
                </div>
                <div className="footer-info">
                    [250704] 충청남도 천안시 동남구 대흥로 215 7층 <br />
                    Copyright &copy; Yk2hyeong. All Rights Reserved.
                </div>
            </div>
            <div className="footer-right">
                <Link to="/">
                    <img
                        src={process.env.PUBLIC_URL + '/static/images/logo.png'}
                        alt="로고"
                        className="logo-img"
                    />
                </Link>
            </div>
            <CustomFloatButton
                icon={<FontAwesomeIcon icon={faRobot} style={{ fontSize: '18px' }} />}
                tooltip="AI 챗봇"
                onClick={() => window.open("http://192.168.0.139:5000/", "_blank", "width=700,height=700")}
            />
        </footer>
    );
}
