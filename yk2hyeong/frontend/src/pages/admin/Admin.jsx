import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import AdminContent from "../../components/admin/AdminContent";
import './Admin.css';
import CustomSidebarMenu from '../../components/common/CustomSidebarMenu';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import {useLogin} from "../login/LoginContext";

const menuItems = [
    {
        key: 'sub1',
        label: '상품관리',
        icon: <MailOutlined />,
        children: [
            { key: '1', label: '상품등록승인' },
            { key: '5', label: '상품관리'}
        ],
    },
    {
        key: 'sub2',
        label: '유저관리',
        icon: <AppstoreOutlined />,
        children: [
            { key: '2', label: '유저관리' },
            { key: '3', label: '회원가입승인' },
        ],
    },
    {
        key: 'sub3',
        label: '신고관리',
        icon: <AppstoreOutlined />,
        children: [
            { key: '4', label: '신고확인' },
        ],
    },
];

const Admin = () => {
    const [activeItem, setActiveItem] = useState("상품등록승인");
    const navigate = useNavigate();

    // 관리자 권한
    const {loginMember, isLoading} = useLogin();
    const isAdmin = loginMember?.memberRole === '001';

    // 관리자페이지 관리자만 접근 가능
    useEffect(() => {

        if(!isAdmin){

            alert("관리자만 접근 가능한 페이지입니다.");
            navigate("/", {replace:true});

        }

    }, []);

    // 상위 메뉴 선택 방지 (선택적으로 적용)
    const handleMenuSelect = (label) => {
        const allSubLabels = menuItems.flatMap(item =>
            item.children ? item.children.map(child => child.label) : []
        );
        if (allSubLabels.includes(label)) {
            setActiveItem(label);
        }
    };

    return (
        <div className="admin-container">
            <CustomSidebarMenu
                key="always-open" // 🔑 리렌더 방지용 고정값
                className="admin-sidebar"
                items={menuItems}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1', 'sub2', 'sub3']}
                onToggle={() => {}} // ✅ 토글 콜백 무효화
                onSelectItem={handleMenuSelect}
            />
            <AdminContent activeItem={activeItem} />
        </div>
    );
};

export default Admin;
