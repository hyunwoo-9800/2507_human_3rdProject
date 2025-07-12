import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import CustomPagination from "../common/CustomPagination";
import "./NoticeList.css";

function NoticeList() {

    // 공지사항 리스트 데이터를 저장하는 상태값
    const [noticeList, setNoticeList] = useState([]);
    // 체크박스로 선택된 공지사항 ID 목록을 저장하는 상태값
    const [selectedIds, setSelectedIds] = useState([]);
    // 한 페이지에 보여줄 공지사항 개수 (고정값)
    const [noticesPerPage] = useState(10);
    // React Router 페이지 이동을 위한 Hook
    const navigate = useNavigate();
    // 로그인한 사용자의 권한 정보 가져오기 (로컬스토리지에서 가져옴)
    const memberRole = localStorage.getItem("memberRole") || "";

    // 페이지네이션은 별도 상태값
    const [page, setPage] = useState(1);



    // 컴포넌트가 처음 렌더링될 때 실행 :  공지사항 목록 조회
    useEffect(() => {
        fetchNotices();
    }, []);

    // 공지사항 목록 조회 함수 : axios로 백엔드에 요청
    const fetchNotices = () => {
        axios.get("/notice/all")
            .then(res => setNoticeList(res.data))
            .catch(err => console.error("공지사항 불러오기 실패:", err));
    };

    // 체크박스 클릭 시 선택된 ID 상태값 업데이트
    const handleCheckboxChange = (noticeId) => {
        setSelectedIds(prev =>
            prev.includes(noticeId)
                ? prev.filter(id => id !== noticeId)
                : [...prev, noticeId]
        );
    };

    // 선택된 공지사항 삭제 처리 함수
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert("삭제할 항목을 선택해주세요.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            for (const id of selectedIds) {
                await axios.delete(`/notice/${id}`, {
                    data: { memberRole }
                });
            }
            alert("공지사항이 삭제되었습니다.");
            setSelectedIds([]);
            fetchNotices();
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 페이지별 데이터 나누기 위한 인덱스 계산
    const indexOfLast = page * noticesPerPage;
    const indexOfFirst = indexOfLast - noticesPerPage;
    const currentNotices = noticeList.slice(indexOfFirst, indexOfLast);

    // 페이지 변경 시 호출될 함수 : 페이지 상태값 업데이트
    const handlePageChange = (newPage) => {
        setPage(newPage);
    }

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
                    {memberRole === '001' && <th>선택</th>}
                </tr>
                </thead>
                <tbody>
                {currentNotices.map((notice) => (
                    <tr key={notice.noticeId}>
                        <td>{notice.bno}</td>
                        <td onClick={() => navigate(`/notice/${notice.noticeId}`)}>{notice.noticeTitle}</td>
                        <td>{notice.writerId}</td>
                        <td>{new Date(notice.createdDate).toLocaleDateString()}</td>
                        {memberRole === '001' && (
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(notice.noticeId)}
                                    onChange={() => handleCheckboxChange(notice.noticeId)}
                                />
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="notice-pagination">
                <CustomPagination
                defaultCurrent={page}
                total={100}
                pageSize={10}
                onChange={handlePageChange}
                />
            </div>

            {memberRole === '001' && (
                <div className="button-group">
                    <Button color="primary" size="sm" onClick={() => navigate("/notice/write")}>글쓰기</Button>
                    <Button color="error" size="sm" onClick={handleDeleteSelected}>삭제하기</Button>
                </div>
            )}
        </div>
    );
}

export default NoticeList;
