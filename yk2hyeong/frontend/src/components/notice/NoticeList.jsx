import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Pagination from "../common/Pagination";
import "./NoticeList.css";

function NoticeList() {
    const [noticeList, setNoticeList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [noticesPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = () => {
        axios.get("/notice/all")
            .then(res => setNoticeList(res.data))
            .catch(err => console.error("공지사항 불러오기 실패:", err));
    };

    const handleCheckboxChange = (noticeId) => {
        setSelectedIds(prev =>
            prev.includes(noticeId)
                ? prev.filter(id => id !== noticeId)
                : [...prev, noticeId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            for (const id of selectedIds) {
                await axios.delete(`/notice/${id}`);
            }
            alert("삭제 완료");
            setSelectedIds([]);
            fetchNotices(); // 목록 갱신
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 페이지 계산
    const indexOfLast = currentPage * noticesPerPage;
    const indexOfFirst = indexOfLast - noticesPerPage;
    const currentNotices = noticeList.slice(indexOfFirst, indexOfLast);

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h2>공지사항</h2>

            </div>

            <table className="notice-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>
                        <input
                            type="checkbox"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    const ids = currentNotices.map(n => n.noticeId);
                                    setSelectedIds(ids);
                                } else {
                                    setSelectedIds([]);
                                }
                            }}
                            checked={
                                currentNotices.length > 0 &&
                                currentNotices.every(n => selectedIds.includes(n.noticeId))
                            }
                        />
                    </th>
                </tr>
                </thead>

                <tbody>
                {currentNotices.map((notice, index) => (
                    <tr key={notice.noticeId}>

                        <td>{notice.bno}</td>
                        <td
                            className="notice-title-link"
                            onClick={() => navigate(`/notice/${notice.noticeId}`)}
                        >
                            {notice.noticeTitle}
                        </td>
                        <td>{notice.writerId}</td>
                        <td>{new Date(notice.createdDate).toLocaleDateString()}</td>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(notice.noticeId)}
                                onChange={() => handleCheckboxChange(notice.noticeId)}
                            />
                        </td>

                    </tr>
                ))}
                </tbody>
            </table>

            <div className="notice-pagination">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(noticeList.length / noticesPerPage)}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <div className="button-group">
                <Button onClick={() => navigate("/notice/write")} className="write-btn">글쓰기</Button>
                <Button variant="secondary" onClick={handleDeleteSelected}>
                    삭제하기
                </Button>
            </div>
        </div>
    );
}

export default NoticeList;
