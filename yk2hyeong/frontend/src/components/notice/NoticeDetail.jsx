import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function NoticeDetail() {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/notice/${id}`)
                .then(res => setNotice(res.data))
                .catch(err => console.error(err));
        }
    }, [id]);

    if (!notice) return <div>공지사항을 선택해주세요.</div>;

    return (
        <div>
            <h3>{notice.notice_Title}</h3>
            <p><strong>작성자:</strong> {notice.writer_Id}</p>
            <p>{notice.notice_Content}</p>
            <p><small>{new Date(notice.created_date).toLocaleString()}</small></p>
        </div>
    );
}

export default NoticeDetail;
