import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import './common.css';

const iconMap = {
    success: <CheckCircleOutlined />,
    processing: <SyncOutlined spin />,
    error: <CloseCircleOutlined />,
    warning: <ExclamationCircleOutlined />,
    waiting: <ClockCircleOutlined />,
    stop: <MinusCircleOutlined />,
    twitter: <TwitterOutlined />,
    youtube: <YoutubeOutlined />,
    facebook: <FacebookOutlined />,
    linkedin: <LinkedinOutlined />,
};


// 커스텀 색상만 맵핑 (antd 기본 색상은 따로 처리)
const colorStyleMap = {
    customPrimary: { backgroundColor: '#00a43c', color: 'white' },
    customSecondary: { backgroundColor: '#d5d0cd', color: 'black' },
    customAccent: { backgroundColor: '#ffdd1a', color: 'black' },
    customInfo: { backgroundColor: '#b6f250', color: 'black' },
    customSuccess: { backgroundColor: '#005f43', color: 'white' },
    customWarning: { backgroundColor: '#fa9600', color: 'black' },
    customError: { backgroundColor: '#f82833', color: 'white' },
};

const customColors = Object.keys(colorStyleMap);

const CustomTag = ({ color, label, icon, iconName, size = 'default' }) => {
    const isCustomColor = customColors.includes(color);

    // size에 따라 className 지정
    const sizeClass =
        size === 'small' ? 'custom-tag-small' :
            size === 'large' ? 'custom-tag-large' :
                'custom-tag-default';

    return (
        <Tag
            icon={icon || iconMap[iconName]}
            color={isCustomColor ? undefined : color}
            style={isCustomColor ? colorStyleMap[color] : undefined}
            className={sizeClass}   // className으로 사이즈 적용
        >
            {label}
        </Tag>
    );
};

CustomTag.propTypes = {
    color: PropTypes.oneOf([
        'customPrimary',
        'customSecondary',
        'customAccent',
        'customInfo',
        'customSuccess',
        'customWarning',
        'customError',
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
        'success',
        'processing',
        'error',
        'warning',
        'default',
        // 혹시 더 필요하면 여기에 추가 가능
    ]),
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    iconName: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
};

export default CustomTag;
