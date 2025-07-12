import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";

function NoticeEdit() {

    // 공지사항 수정 화면에서 사용할 상태 정의

    // 제목 상태
    const [title, setTitle] = useState("");
    // 내용 상태
    const [content, setContent] = useState("");
    // 작성자 ID상태(기본값 admin)
    const [writerId, setWriterId] = useState("admin");
    // 페이지 이동용 Hook
    const navigate = useNavigate();
    // URL 파라미터에서 공지사항 ID 가져오기
    const { id } = useParams();
    // 로컬스토리지에서 권한 값 가져오기
    const memberRole = localStorage.getItem("memberRole") || "";    //

    useEffect(() => {
        // 컴포넌트 마운트 시 공지사항 데이터 조회
        axios.get(`/notice/${id}`)
            .then(res => {
                // 제목, 내용, 작성자ID 각각 설정
                setTitle(res.data.noticeTitle);
                setContent(res.data.noticeContent);
                setWriterId(res.data.writerId || "admin");
            })
            .catch(err => console.error("공지사항 불러오기 실패", err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지

        // 권한 체크: 관리자가 아니면 작업 금지
        if (memberRole !== '001') {
            alert("관리자 권한이 없습니다.");
            return;
        }

        try {
            // 수정 요청
            await axios.put(`/notice/${id}`, {
                noticeTitle: title,
                noticeContent: content,
                writerId: writerId,
                updatedId: writerId,
                memberRole: memberRole
            });
            alert("공지사항이 수정되었습니다.");
            navigate("/notice");    // 수정 완료 후 목록이로 이동
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 실패");
        }
    };

    // 권한 없을 때는 화면 자체를 렌더링하지 않음
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
