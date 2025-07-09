import React from 'react';
import { FloatButton } from 'antd';

const CustomFloatButton = ({
                               onClick = () => {},
                               icon,
                               tooltip,
                               type = 'default',
                               className = '',
                               style = {},
                           }) => {
    return (
        <FloatButton
            onClick={onClick}
            icon={icon}
            tooltip={tooltip}
            type={type}
            className={className}
            style={style}
        />
    );
};

export default CustomFloatButton;
