import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";
import { v4 as uuidv4 } from "uuid";

function NoticeForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writerId, setWriterId] = useState("admin");
    const navigate = useNavigate();
    const userRole = localStorage.getItem("userRole") || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userRole !== '001') {
            alert("관리자 권한이 없습니다.");
            return;
        }

        try {
            await axios.post("/notice", {
                noticeId: uuidv4(),
                noticeTitle: title,
                noticeContent: content,
                writerId: writerId,
                createdId: writerId,
                userRole: userRole
            });
            alert("공지사항이 등록되었습니다.");
            navigate("/notice");
        } catch (error) {
            console.error("등록 오류:", error);
            alert("등록 실패");
        }
    };

    if (userRole !== '001') return null;

    return (
        <div className="notice-form-container">
            <h2>공지사항 등록</h2>
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="제목을 입력하세요." />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder="내용을 입력하세요."></textarea>
                </div>
                <div className="form-actions">
                    <Button type="submit">등록</Button>
                    <Button variant="secondary" onClick={() => navigate("/notice")}>취소</Button>
                </div>
            </form>
        </div>
    );
}

export default NoticeForm;