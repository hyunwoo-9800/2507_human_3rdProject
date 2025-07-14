import React, { useState } from 'react';
import Sidebar from "../../components/admin/Sidebar";
import AdminContent from "../../components/admin/AdminContent";
import './Admin.css';
import CustomSidebarMenu from '../../components/common/CustomSidebarMenu';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';

const menuItems = [
    {
        key: 'sub1',
        label: '게시글 관리',
        icon: <MailOutlined />,
        children: [
            { key: '1', label: '상품등록승인' },
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

    // ✅ 상위 메뉴 선택 방지 (선택적으로 적용)
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
