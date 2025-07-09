import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import Button from './Button';

const iconMap = {
    confirm: ExclamationCircleOutlined,
    info: InfoCircleOutlined,
    warning: WarningOutlined,
    error: CloseCircleOutlined,
    success: CheckCircleOutlined,
};

const colorMap = {
    primary: '#00a43c',    // 초록
    secondary: '#d5d0cd',
    accent: '#ffdd1a',
    info: '#b6f250',       // 연두
    success: '#005f43',    // 진한 초록
    warning: '#fa9600',
    error: '#f82833',
};

const iconColorMap = {
    confirm: '#00a43c',
    info: '#b6f250',
    warning: '#fa9600',
    error: '#f82833',
    success: '#00a43c',
};

const okButtonStyle = {
    backgroundColor: colorMap.primary,
    borderColor: colorMap.primary,
    color: 'white',
};

const CustomModal = ({
                         type = 'info',
                         title,
                         content,
                         onOk,
                         onCancel,
                         buttonLabel,
                         buttonColor = 'primary',
                         buttonSize = 'md',
                         successMessage,
                         cancelMessage,
                         showOk = true,
                         showCancel = true,
                     }) => {
    const [modal, contextHolder] = Modal.useModal();

    const showModal = () => {
        const IconComponent = iconMap[type] || InfoCircleOutlined;
        const iconColor = iconColorMap[type] || colorMap.primary;
        const iconElement = <IconComponent style={{ color: iconColor }} />;

        const config = {
            title,
            content,
            icon: iconElement,
        };

        if (showOk) {
            config.okText = '확인';
            config.okButtonProps = { style: okButtonStyle };
            config.onOk = () => {
                if (onOk) onOk();
                if (successMessage) {
                    modal.success({
                        title: '완료',
                        content: successMessage,
                        icon: React.createElement(CheckCircleOutlined, {
                            style: { color: colorMap.primary },
                        }),
                        okText: '확인',
                        okButtonProps: { style: okButtonStyle },
                    });
                }
            };
        }

        if (showCancel) {
            config.cancelText = '취소';
            config.onCancel = () => {
                if (onCancel) onCancel();
                if (cancelMessage) {
                    modal.info({
                        title: '취소됨',
                        content: cancelMessage,
                        icon: React.createElement(InfoCircleOutlined, {
                            style: { color: colorMap.info },
                        }),
                        okText: '확인',
                        okButtonProps: { style: okButtonStyle },
                    });
                }
            };
        }

        // 모달 호출 조건 분기
        const useConfirm =
            type === 'confirm' || showCancel === true || type === 'error';

        if (useConfirm && (showCancel || type === 'confirm')) {
            modal.confirm(config);
        } else {
            // 단일 확인 버튼만 있는 경우
            switch (type) {
                case 'info':
                    modal.info(config);
                    break;
                case 'success':
                    modal.success(config);
                    break;
                case 'warning':
                    modal.warning(config);
                    break;
                case 'error':
                    modal.error(config);
                    break;
                default:
                    modal.info(config);
            }
        }
    };

    return (
        <>
            <Button color={buttonColor} size={buttonSize} onClick={showModal}>
                {buttonLabel || type}
            </Button>
            {contextHolder}
        </>
    );
};

CustomModal.propTypes = {
    type: PropTypes.oneOf(['confirm', 'info', 'warning', 'error', 'success']),
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    buttonLabel: PropTypes.string,
    buttonColor: PropTypes.oneOf([
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error',
    ]),
    buttonSize: PropTypes.oneOf(['sm', 'md', 'lg']),
    successMessage: PropTypes.string,
    cancelMessage: PropTypes.string,
    showOk: PropTypes.bool,
    showCancel: PropTypes.bool,
};

export default CustomModal;
