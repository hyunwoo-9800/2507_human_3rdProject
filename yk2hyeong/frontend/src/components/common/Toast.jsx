import React, { useEffect } from 'react';
import './common.css';

/**
 * 공통 토스트 알림 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
    // duration 후 자동 닫기
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`common-toast ${type}`}>
            {message}
        </div>
    );
}
