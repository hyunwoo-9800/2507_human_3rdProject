import React from "react";
import TableTab from "./TableTab";
import FormTab from "./FormTab";

const AdminContent = ({ activeItem }) => {
    const isFormTab = activeItem === '상품등록승인' || activeItem === '회원가입승인';

    //FormTab 어떤 탭을 렌더링할지 결정하는 변수
    let tabType = '';
    if(activeItem === '상품등록승인'){
        tabType = 'product';
    }else if(activeItem === '회원가입승인'){
        tabType = 'user';
    }else if(activeItem === '유저관리'){
        tabType = 'member';
    }else if(activeItem === '신고확인'){
        tabType = 'report';
    }else if(activeItem === '상품관리'){
        tabType = 'products';
    }

    return (
        <div className="admin-content">
            <h1 className="admin-title">관리자 페이지</h1>

            {isFormTab ? <FormTab tabType={tabType}/> : <TableTab tabType = {tabType}/>}

        </div>
    );
};

export default AdminContent;
