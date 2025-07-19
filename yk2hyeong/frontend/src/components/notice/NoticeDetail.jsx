import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../common/Button";
import "./NoticeDetail.css";
import CustomLoading from "../common/CustomLoading";

function NoticeDetail() {

    // URL 파라미터에서 공지사항 ID 추출
    const { id } = useParams();
    // 공지사항 데이터 상태 관리
    const [notice, setNotice] = useState(null);
    // 페이지 이동을 위한 navigate 훅 사용
    const navigate = useNavigate();
    // 권한 값 가져오기 (로컬스토리지 사용)
    const memberRole = localStorage.getItem("memberRole") || "";

    // 페이지 마운트 및 ID 변경 시 데이터 요청
    useEffect(() => {
        axios.get(`/notice/${id}`)
            .then(res => setNotice(res.data))// 데이터 저장
            .catch(err => console.error("공지사항 조회 실패:", err));
    }, [id]);

    // 데이터 로딩 중 표시
    if (!notice) return (
        <div className="notice-detail-container">
            <CustomLoading size="large" />
        </div>
    );


    // 데이터 렌더링
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
                <Button color="primary" size="sm" onClick={() => navigate("/notice")}>목록으로</Button>
                {memberRole === '001' && (
                    <Button color="success" size="sm" onClick={() => navigate(`/notice/edit/${id}`)}>수정하기</Button>
                )}
            </div>
        </div>
    );
}

export default NoticeDetail;
