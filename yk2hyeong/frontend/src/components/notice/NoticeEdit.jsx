import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";

function NoticeEdit() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writerId, setWriterId] = useState("admin");
    const navigate = useNavigate();
    const { id } = useParams();
    const memberRole = localStorage.getItem("memberRole") || "";

    useEffect(() => {
        axios.get(`/notice/${id}`)
            .then(res => {
                setTitle(res.data.noticeTitle);
                setContent(res.data.noticeContent);
                setWriterId(res.data.writerId || "admin");
            })
            .catch(err => console.error("공지사항 불러오기 실패", err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (memberRole !== '001') {
            alert("관리자 권한이 없습니다.");
            return;
        }

        try {
            await axios.put(`/notice/${id}`, {
                noticeTitle: title,
                noticeContent: content,
                writerId: writerId,
                updatedId: writerId,
                memberRole: memberRole
            });
            alert("공지사항이 수정되었습니다.");
            navigate("/notice");
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 실패");
        }
    };

    if (memberRole !== '001') return null;

    return (
        <div className="notice-form-container">
            <h2>공지사항 수정</h2>
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div className="form-actions">
                    <Button color="primary" size="sm" onClick={() => navigate("/notice")}>목록으로</Button>
                    <Button color="success" size="sm" type="submit">수정</Button>
                </div>
            </form>
        </div>
    );
}

export default NoticeEdit;
