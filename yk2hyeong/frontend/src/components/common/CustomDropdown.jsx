import React from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Button, Space } from 'antd';
import PropTypes from 'prop-types';

export default function CustomDropdown({ userName, children }) {
    // children은 <Link>, <button> 같은 메뉴 아이템들

    // AntD Dropdown용 메뉴 아이템 변환
    // children 배열을 items 배열로 바꿔줘야 하는데,
    // 여기서는 children을 그대로 menu 안에 넣는 대신,
    // Dropdown overlay로 쓰는 방식으로 변경합니다.

    // Dropdown에 overlay(메뉴)를 직접 JSX로 줄 때는 menu 대신 overlay 속성 사용
    return (
        <Space size={0} style={{ display: 'inline-flex' }}>
            {/* 유저 아이콘 */}
            <div className="custom-dropdown-icon-box">
                <UserOutlined style={{ fontSize: 20, color: 'rgba(0,0,0,0.65)' }} />
            </div>

            <Dropdown
                overlay={
                    <div className="custom-dropdown-menu">
                        {children}
                    </div>
                }
                trigger={['click']}
                placement="bottomRight"
            >
                <Button className="custom-dropdown-btn">
                    <span id="custom-dropdown-username">{userName}</span>
                    <DownOutlined />
                </Button>
            </Dropdown>
        </Space>
    );
}

CustomDropdown.propTypes = {
    userName: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
