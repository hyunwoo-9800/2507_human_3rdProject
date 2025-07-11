import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../common/Button";
import "./NoticeDetail.css";
import CustomLoading from "../common/CustomLoading";

function NoticeDetail() {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem("userRole") || "";

    useEffect(() => {
        axios.get(`/notice/${id}`)
            .then(res => setNotice(res.data))
            .catch(err => console.error("공지사항 조회 실패:", err));
    }, [id]);

    if (!notice) return (
        <div className="notice-detail-container">
            <CustomLoading size="large" />
        </div>
    );

    return (
        <div className="notice-detail-container">
            <div className="notice-detail-title">{notice.noticeTitle}</div>
            <div className="notice-detail-box">{notice.noticeContent}</div>
            <div className="notice-detail-actions">
                <Button variant="secondary" onClick={() => navigate("/notice")}>이전으로</Button>
                {userRole === '001' && (
                    <Button onClick={() => navigate(`/notice/edit/${id}`)}>수정하기</Button>
                )}
            </div>
        </div>
    );
}

export default NoticeDetail;