import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoticeList.css";


function NoticeList({ currentUser }) {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const dummy = [
            { notice_id: 5, notice_title: "안녕하세요", empl_id: "관리자", created_at: "2025-07-07"},
            { notice_id: 4, notice_title: "작물 상품 관련", empl_id: "관리자", created_at: "2025-07-07"},
            { notice_id: 3, notice_title: "2025년 VIP 상품 일정", empl_id: "관리자", created_at: "2025-07-07"},
            { notice_id: 2, notice_title: "배송지 변경 공지", empl_id: "관리자", created_at: "2025-07-07"},
            { notice_id: 1, notice_title: "2025/07/15 VIP 채용", empl_id: "관리자", created_at: "2025-07-07"},

        ];
        setNotices(dummy);
    }, []);


    return (
        <div className="notice-container">
            <h2>공지사항</h2>

            {currentUser?.role === "ADMIN" && (
                <button className="notice-write-button" onClick={() => navigate("/notice/write")}>
                    공지사항 등록
                </button>
            )}

            <table className="notice-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>등록일</th>
                </tr>
                </thead>
                <tbody>
                {notices.map((notice) => (
                    <tr key={notice.notice_id} onClick={() => navigate(`/notice/${notice.notice_id}`)}>
                        <td>{notice.notice_id}</td>
                        <td>{notice.notice_title}</td>
                        <td>{notice.empl_id}</td>
                        <td>{notice.created_at}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="notice-pagination">
                <button className="page-button">1</button>
            </div>
        </div>
    );
}

export default NoticeList;