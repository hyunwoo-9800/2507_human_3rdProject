import React, { useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Button, Space } from 'antd';
import PropTypes from 'prop-types';

export default function CustomDropdown({ userName, children }) {
  const [isVisible, setIsVisible] = useState(false)

  const handleVisibleChange = (flag) => {
    setIsVisible(flag)
  }

  return (
    <Space size={0} style={{ display: 'inline-flex' }}>
      <div className="custom-dropdown-icon-box">
        <UserOutlined style={{ fontSize: 20, color: 'rgba(0,0,0,0.65)' }} />
      </div>

      <Dropdown
        visible={isVisible}
        onVisibleChange={handleVisibleChange}
        overlay={
          <div className="custom-dropdown-menu">
            {React.Children.map(children, (child) =>
              React.cloneElement(child, {
                onClick: () => {
                  setIsVisible(false)
                  if (child.props.onClick) child.props.onClick()
                },
              })
            )}
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
  )
}
