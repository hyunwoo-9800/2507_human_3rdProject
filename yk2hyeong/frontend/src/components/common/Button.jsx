import React from 'react';
import PropTypes from 'prop-types';
import '../../common/common.css';

/**
 * 공통 버튼 컴포넌트
 * @param {React.ReactNode} children 버튼 내부에 들어갈 내용 (텍스트, 아이콘 등)
 * @param {string} color 버튼 색상 (primary, secondary, accent, info, success, warning, error)
 * @param {string} size 버튼 크기 (sm, md, lg)
 * @param {function} onClick 클릭 이벤트 핸들러
 * @param {boolean} disabled 비활성화 여부
 * @param {string} type 버튼 타입 (button, submit, reset)
 * @param {string} className 추가 클래스명 (옵션)
 * @param {*} rest 기타 props (aria-* 등)
 */
function Button({
                    children,
                    color = 'primary',
                    size = 'md',
                    onClick,
                    disabled = false,
                    type = 'button',
                    className = '',
                    ...rest
                }) {
    // color와 size에 따라 클래스명 조합, 추가 className도 함께 적용
    const classes = `btn btn-${color} btn-${size} ${className}`.trim();

    return (
        <button
            type={type}         // 버튼 타입 (기본: button)
            className={classes} // 클래스명 (색상, 크기 등)
            onClick={onClick}   // 클릭 핸들러
            disabled={disabled} // 비활성화 처리
            {...rest}           // 기타 속성 (aria-label, id 등)
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,                    // 버튼 내용 (필수)
    color: PropTypes.oneOf([                                // 색상 종류
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error',
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),             // 크기 종류
    onClick: PropTypes.func,                                // 클릭 이벤트 핸들러
    disabled: PropTypes.bool,                               // 비활성화 여부
    type: PropTypes.oneOf(['button', 'submit', 'reset']),  // 버튼 타입
    className: PropTypes.string,                            // 추가 클래스명
};

export default Button;
