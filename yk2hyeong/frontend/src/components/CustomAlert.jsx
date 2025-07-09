// components/CustomAlert.jsx
import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

const CustomAlert = ({ type, message, description, closable = false }) => {
    return (
        <Alert
            type={type}
            message={message}
            description={description}
            showIcon
            closable={closable}
        />
    );
};

CustomAlert.propTypes = {
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired,
    message: PropTypes.string.isRequired,
    description: PropTypes.string,
    closable: PropTypes.bool,
};

export default CustomAlert;
