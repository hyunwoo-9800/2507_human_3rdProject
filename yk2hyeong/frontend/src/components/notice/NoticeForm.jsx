// components/notice/NoticeForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";

function NoticeForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writerId, setWriterId] = useState("admin"); // 추후 로그인 정보 연동 가능
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/notice", {
                noticeTitle: title,
                noticeContent: content,
                writerId: writerId,
                createdId: writerId,
            });
            alert("등록 완료!");
            navigate("/notice");
        } catch (error) {
            console.error("등록 오류:", error);
            alert("등록 실패");
        }
    };

    return (
        <div className="notice-form-container">
            <h2>공지사항 등록</h2>
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="내용을 입력하세요"
                    ></textarea>
                </div>
                <div className="form-actions">
                    <Button type="submit">등록</Button>
                    <Button variant="secondary" onClick={() => navigate("/notice")}>
                        취소
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default NoticeForm;
