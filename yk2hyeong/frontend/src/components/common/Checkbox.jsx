import React from 'react';
import PropTypes from 'prop-types';
import '../../common/common.css';  // 기존 스타일링 파일을 참조

/**
 * 공통 Checkbox 컴포넌트
 * @param {string} value 선택값
 * @param {boolean} checked 선택 여부
 * @param {function} onChange 선택값이 변경될 때 호출되는 함수
 * @param {boolean} disabled checkbox를 비활성화할지 여부
 * @param {boolean} required 필수 입력 필드 여부
 * @param {string} color 체크박스 색상 (primary, black)
 * @param {string} className 추가 클래스명 (옵션)
 * @param {*} rest 기타 props (aria-* 등)
 */
function Checkbox({ value, checked, onChange, disabled = false, required = false, color = 'primary', className = '', ...rest }) {
    const classes = `input-checkbox ${color} ${className}`.trim();

    return (
        <label>
            <input
                type="checkbox"
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={classes}
                {...rest}
            />
            <span>{value}</span> {/* Option Text */}
        </label>
    );
}

Checkbox.propTypes = {
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    color: PropTypes.oneOf(['primary', 'black']), // 색상 추가
    className: PropTypes.string,
};

export default Checkbox;
