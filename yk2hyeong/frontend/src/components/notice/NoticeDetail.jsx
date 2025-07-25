import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../common/Button";
import "./NoticeDetail.css";
import CustomLoading from "../common/CustomLoading";
import { useLogin } from "../../pages/login/LoginContext";

function NoticeDetail() {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();

    const { loginMember, isLoading } = useLogin();
    const isAdmin = loginMember?.memberRole === "001";

    useEffect(() => {
        axios
            .get(`/notice/detail/${id}`, {
                withCredentials: true, // ✅ 쿠키 인증 요청
            })
            .then((res) => setNotice(res.data))
            .catch((err) => console.error("공지사항 조회 실패:", err));
    }, [id]);

    if (isLoading || !notice) {
        return (
            <div className="notice-detail-container">
                <CustomLoading size="large" />
            </div>
        );
    }

    return (
        <div className="notice-detail-container">
            <div className="notice-detail-title">
                <span>{notice.noticeTitle}</span>
                <span className="notice-detail-date">
                    작성일 : {new Date(notice.createdDate).toLocaleDateString()}
                </span>
            </div>

            <div className="notice-detail-box">{notice.noticeContent}</div>

            <div className="notice-detail-actions">
                <Button color="primary" size="sm" onClick={() => navigate("/notice")}>
                    목록으로
                </Button>
                {isAdmin && (
                    <Button
                        color="success"
                        size="sm"
                        onClick={() => navigate(`/notice/edit/${id}`)}
                    >
                        수정하기
                    </Button>
                )}
            </div>
        </div>
    );
}

export default NoticeDetail;
