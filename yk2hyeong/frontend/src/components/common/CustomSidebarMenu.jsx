import React, { useState } from 'react';
import { Button, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const CustomSidebarMenu = ({
                               items = [],
                               defaultSelectedKeys = ['1'],
                               defaultOpenKeys = ['sub1'],
                               theme = 'light',
                               style = { width: 256 },
                               showToggleButton = false,
                               initialCollapsed = false,
                               onToggle,
                               onSelectItem,
                               className = '',
                           }) => {
    const [collapsed, setCollapsed] = useState(initialCollapsed);

    // openKeys를 상태로 관리하고 고정 (토글 방지)
    const [openKeys] = useState(defaultOpenKeys);

    const toggleCollapsed = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        if (onToggle) onToggle(newState);
    };

    const handleClick = (e) => {
        const clickedKey = e.key;
        const parentKeys = items.map(item => item.key);

        if (parentKeys.includes(clickedKey)) {
            // 상위 메뉴 클릭 시 아무 처리 안 함 (선택 불가)
            return;
        }

        const findLabel = (items) => {
            for (const item of items) {
                if (item.key === clickedKey) return item.label;
                if (item.children) {
                    const child = findLabel(item.children);
                    if (child) return child;
                }
            }
            return null;
        };

        const label = findLabel(items);
        if (onSelectItem && label) onSelectItem(label);
    };

    return (
        <div style={style} className={className}>
            {showToggleButton && (
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{ marginBottom: 16 }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
            )}
            <Menu
                className="admin-sidebar custom-menu"
                defaultSelectedKeys={defaultSelectedKeys}
                openKeys={openKeys}
                mode="inline"
                theme={theme}
                items={items}
                onClick={handleClick}
                selectable={true}
                expandIcon={null}
                onOpenChange={() => {}}
            />
        </div>
    );
};

export default CustomSidebarMenu;
