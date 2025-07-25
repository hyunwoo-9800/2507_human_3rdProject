import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common/Button";
import "./NoticeForm.css";
import { useLogin } from "../../pages/login/LoginContext";
import CustomLoading from "../common/CustomLoading";

function NoticeEdit() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    const { loginMember, isLoading } = useLogin();
    const isAdmin = loginMember?.memberRole === "001";
    const writerId = loginMember?.memberId || "";

    // 기존 공지사항 불러오기
    useEffect(() => {
        if (isLoading || !isAdmin) return;

        axios
            .get(`/notice/detail/${id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setTitle(res.data.noticeTitle);
                setContent(res.data.noticeContent);
            })
            .catch((err) => console.error("공지사항 불러오기 실패:", err));
    }, [id, isLoading, isAdmin]);

    if (isLoading) {
        return <CustomLoading />;
    }

    if (!isAdmin) {
        return <div>관리자 권한이 없습니다.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `/notice/edit/${id}`,
                {
                    noticeTitle: title,
                    noticeContent: content,
                    writerId: writerId,
                    updatedId: writerId,
                },
                {
                    withCredentials: true,
                }
            );
            alert("공지사항이 수정되었습니다.");
            navigate("/notice");
        } catch (err) {
            console.error("공지사항 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="notice-form-container">
            <h2>공지사항 수정</h2>
            <form onSubmit={handleSubmit} className="notice-form">
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#f3b30b',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c49009')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3b30b')}
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
                        onClick={() => navigate("/notice")}
                    >
                        목록으로
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NoticeEdit;
