import React from 'react';
import PropTypes from 'prop-types';
import '../common/common.css';  // 기존 스타일링 파일을 참조

/**
 * 공통 뱃지 컴포넌트
 * @param {string} color 뱃지 색상 (primary, secondary, accent, info, success, warning, error)
 * @param {string} size 뱃지 크기 (sm, md, lg)
 * @param {React.ReactNode} children 뱃지에 표시할 텍스트
 * @param {string} className 추가 클래스명 (옵션)
 * @param {*} rest 기타 props (aria-* 등)
 */
function Badge({ color = 'primary', size = 'md', children, className = '', ...rest }) {
    // color와 size에 따라 클래스명 조합, 추가 className도 함께 적용
    const classes = `badge badge-${color} badge-${size} ${className}`.trim();

    return (
        <span className={classes} {...rest}>
      {children}
    </span>
    );
}

Badge.propTypes = {
    color: PropTypes.oneOf(['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    children: PropTypes.node.isRequired,  // 뱃지에 표시할 내용
    className: PropTypes.string,
};

export default Badge;
