import React from 'react';
import PropTypes from 'prop-types';
import '../common/common.css';  // 기존 스타일링 파일을 참조

/**
 * 공통 Textarea 컴포넌트
 * @param {string} value 입력값
 * @param {function} onChange 입력값이 변경될 때 호출되는 함수
 * @param {string} placeholder 입력 필드에 표시될 힌트 텍스트
 * @param {boolean} disabled 입력 필드를 비활성화할지 여부
 * @param {boolean} required 필수 입력 필드 여부
 * @param {string} size 입력 필드 크기 (sm, md, lg)
 * @param {string} className 추가 클래스명 (옵션)
 * @param {*} rest 기타 props (aria-* 등)
 */
function Textarea({
                      value,
                      onChange,
                      placeholder,
                      disabled = false,
                      required = false,
                      size = 'md',
                      className = '',
                      ...rest
                  }) {
    // 크기별 클래스명 추가
    const classes = `input-textarea input-${size} ${className}`.trim();

    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={classes}
            {...rest}
        />
    );
}

Textarea.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Textarea;
