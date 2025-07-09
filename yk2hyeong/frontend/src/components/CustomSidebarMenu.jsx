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
                           }) => {
    const [collapsed, setCollapsed] = useState(initialCollapsed);

    const toggleCollapsed = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        if (onToggle) onToggle(newState);
    };

    return (
        <div style={style}>
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
                defaultSelectedKeys={defaultSelectedKeys}
                defaultOpenKeys={defaultOpenKeys}
                mode="inline"
                theme={theme}
                inlineCollapsed={collapsed}
                items={items}
            />
        </div>
    );
};

export default CustomSidebarMenu;
