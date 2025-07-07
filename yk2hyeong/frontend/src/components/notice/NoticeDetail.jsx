import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NoticeDetail.css";

function NoticeDetail({ currentUser }) {
    const { id } = useParams(); // URL에서 notice ID 추출
    const navigate = useNavigate();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        // 더미 데이터 (나중에 백엔드 연결 시 API로 대체)
        const dummyData = [
            {
                notice_id: 1,
                notice_title: "2025년 VIP 채용 공고",
                notice_content: "채용 공고 내용입니다. 많은 지원 바랍니다.",
                empl_id: "관리자",
                created_at: "2025-07-07",
            },
            {
                notice_id: 2,
                notice_title: "작물 상품 관련 안내",
                notice_content: "작물 관련 상품 정보 안내드립니다.",
                empl_id: "관리자",
                created_at: "2025-07-06",
            },
        ];

        const found = dummyData.find((n) => n.notice_id === parseInt(id));
        setNotice(found);
    }, [id]);

    if (!notice) {
        return <div style={{ padding: "20px" }}>공지사항을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="notice-detail-container">
            <div className="notice-detail-title">{notice.notice_title}</div>
            <div className="notice-detail-meta">
                작성자: {notice.empl_id} | 등록일: {notice.created_at}
            </div>
            <div className="notice-detail-content">{notice.notice_content}</div>

            {currentUser?.role === "ADMIN" && (
                <div className="notice-detail-actions">
                    <button onClick={() => navigate(`/notice/${notice.notice_id}/edit`)}>수정</button>
                    <button onClick={() => alert("삭제 기능은 백엔드 연동 후 구현됩니다.")}>삭제</button>
                </div>
            )}
        </div>
    );
}

export default NoticeDetail;
