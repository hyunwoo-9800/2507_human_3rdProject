import React from "react";
import TableTab from "./TableTab";
import FormTab from "./FormTab";

const AdminContent = ({ activeItem }) => {
    const isFormTab = activeItem === '상품등록승인' || activeItem === '회원가입승인';

    return (
        <div className="admin-content">
            <h1 className="admin-title">관리자 페이지</h1>
            <button className="exit-btn">나가기</button>

            {isFormTab ? <FormTab /> : <TableTab />}

        </div>
    );
};

export default AdminContent;
