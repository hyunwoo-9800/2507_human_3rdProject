import React from "react";
import {Link} from "react-router-dom";

function NoticeBoard(){
    return(
        <div className="notice-board">
            <div className="notice-board-header">
                <h1>공지사항</h1>
                <Link to="/noticeList">
                    <p>더보기 <i className="fa-solid fa-plus"></i></p>
                </Link>
            </div>
            <div className="notice-board-content">
                <ul>
                    <li>농산물 거래 시 주의사항 안내입니다.</li>
                    <li>상품 직거래 시 배송수단 결제 관련 안내입니다.</li>
                </ul>
            </div>
        </div>
    );
}

export default NoticeBoard;