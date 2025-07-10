// components/RollingAlert.jsx
import React from 'react';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';
import PropTypes from 'prop-types';

const RollingAlert = ({ message }) => {
    return (
        <Alert
            banner
            showIcon
            message={
                <Marquee pauseOnHover gradient={false}>
                    {message}
                </Marquee>
            }
        />
    );
};

RollingAlert.propTypes = {
    message: PropTypes.string.isRequired,
};

export default RollingAlert;
