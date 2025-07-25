import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import CustomPagination from '../common/CustomPagination'
import './NoticeList.css'
import { useLogin } from '../../pages/login/LoginContext'
import CustomLoading from '../common/CustomLoading'

function NoticeList() {
  const [noticeList, setNoticeList] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [noticesPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  // 관리자 권한
  const { loginMember, isLoading } = useLogin()
  const isAdmin = loginMember?.memberRole === '001'

  useEffect(() => {
    fetchNotices()
  }, [])

  if (isLoading) {
    return <CustomLoading></CustomLoading>
  }

  const fetchNotices = () => {
    axios
      .get('/notice/all')
      .then((res) => setNoticeList(res.data))
      .catch((err) => console.error('공지사항 불러오기 실패:', err))
  }

  const handleCheckboxChange = (noticeId) => {
    setSelectedIds((prev) =>
      prev.includes(noticeId) ? prev.filter((id) => id !== noticeId) : [...prev, noticeId]
    )
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택해주세요.')
      return
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return

    try {
      for (const id of selectedIds) {
        await axios.delete(`/notice/delete/${id}`)
      }
      alert('공지사항이 삭제되었습니다.')
      setSelectedIds([])
      fetchNotices()
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const indexOfLast = page * noticesPerPage
  const indexOfFirst = indexOfLast - noticesPerPage
  const currentNotices = noticeList.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h2>공지사항</h2>
      </div>

      <table className="notice-table" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>번호</th>
            <th style={{ width: isAdmin ? '48%' : '62%' }}>제목</th>
            <th style={{ width: '15%' }}>작성자</th>
            <th style={{ width: '15%' }}>작성일</th>
            {isAdmin && <th style={{ width: '14%' }}>선택</th>}
          </tr>
        </thead>
        <tbody>
          {currentNotices.map((notice) => (
            <tr key={notice.noticeId}>
              <td
                style={{
                  width: '8%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {notice.bno}
              </td>
              <td
                style={{
                  width: isAdmin ? '48%' : '62%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/notice/${notice.noticeId}`)}
              >
                {notice.noticeTitle}
              </td>
              <td
                style={{
                  width: '15%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {notice.writerId}
              </td>
              <td
                style={{
                  width: '15%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {new Date(notice.createdDate).toLocaleDateString()}
              </td>
              {isAdmin && (
                <td style={{ width: '14%' }}>
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
          total={noticeList.length}
          pageSize={noticesPerPage}
          onChange={handlePageChange}
        />
      </div>

      {isAdmin && (
        <div className="button-group">
          <Button color="primary" size="sm" onClick={() => navigate('/notice/write')}>
            글쓰기
          </Button>
          <Button color="error" size="sm" onClick={handleDeleteSelected}>
            삭제하기
          </Button>
        </div>
      )}
    </div>
  )
}

export default NoticeList
