import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";
import {v4 as uuidv4} from "uuid";
import {useLogin} from "../../pages/login/LoginContext";
import CustomLoading from "../common/CustomLoading";

function NoticeForm() {

    // 제목,내용,작성자 상태값 선언
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [writerId, setWriterId] = useState("admin");

    const navigate = useNavigate();

    // 관리자 권한
    const {loginMember, isLoading} = useLogin();
    const isAdmin = loginMember?.memberRole === '001';

    if (isLoading) {
        return <CustomLoading></CustomLoading>;
    };

    if (!isAdmin) {
        return null
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 관리자 권한 확인
        if (!loginMember) {
            alert("관리자 권한이 없습니다.");
            return;
        }

        try {
            await axios.post("/notice/reg", {
                noticeTitle: title,
                noticeContent: content,
                createdId: writerId,
            }
            );
            alert("공지사항이 등록되었습니다.");
            navigate("/notice");
        } catch (error) {
            console.error("등록 오류:", error);
            alert("등록 실패");
        }
    };

    // 권한 없는 사용자는 폼을 아예 렌더링하지 않음
    if (!loginMember) {
        return null
    }
    ;

    return (
        <div className="notice-form-container">
            <h2>공지사항 등록</h2>
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                           placeholder="제목을 입력하세요."/>
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required
                              placeholder="내용을 입력하세요."></textarea>
                </div>
                <div className="form-actions">
                    <Button color="primary" size="sm" type="submit">등록</Button>
                    <Button color="success" size="sm" onClick={() => navigate("/notice")}>취소</Button>
                </div>
            </form>
        </div>
    );
}

export default NoticeForm;
