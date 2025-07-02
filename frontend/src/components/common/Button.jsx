import React from 'react';
import './common.css';

/**
 * 공통 버튼 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */

export default function Button({ children, onClick, style ,type = 'button', variant = 'primary', disabled = false }) {
    // 버튼 스타일을 props에 따라 동적으로 적용
    const className = `common-button ${variant} ${disabled ? 'disabled' : ''}`;

    return (
        <button
            type={type}
            onClick={onClick}
            style={style}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );

}
