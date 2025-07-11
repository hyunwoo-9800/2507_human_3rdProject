import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

function NoticeBoard(){

    // 공지리스트 담기
    const [notice,setNotice] = useState([]);
    // 최신 공지사항 2개 불러오기
    useEffect(() => {
        axios.get("/api/main/notice")
            .then(response => {
                setNotice(response.data);
            })
            .catch(error => {
                console.log("공지사항 불러오기 실패", error);
            });
    }, []);
    return(
        <div className="notice-board">
            <div className="notice-board-header">
                <h1>공지사항</h1>
                <Link to="/notice">
                    <p>더보기 <i className="fa-solid fa-plus"></i></p>
                </Link>
            </div>
            <div className="notice-board-content">
                <ul>
                    {notice.length === 0 ? (
                        <li>공지사항이 없습니다.</li>
                    ):(
                        notice.map((item, index) => (
                            <li key={index}>
                                <Link to={`/notice/${item.noticeId}`}>
                                    {item.noticeTitle.length > 30
                                    ? item.noticeTitle.substring(0, 30)+
                                    "...": item.noticeTitle}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default NoticeBoard;