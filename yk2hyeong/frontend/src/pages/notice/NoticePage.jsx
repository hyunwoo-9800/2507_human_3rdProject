import React from "react";
import NoticeList from "../../components/notice/NoticeList";

function NoticePage() {
    const currentUser = {
        username: "admin",
        role: "ADMIN",
    };

    return (
        <div>
            <NoticeList currentUser={currentUser} />
        </div>
    );
}

export default NoticePage;
