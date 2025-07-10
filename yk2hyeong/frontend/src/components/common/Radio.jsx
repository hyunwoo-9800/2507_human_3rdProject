import React from 'react';
import PropTypes from 'prop-types';
import '../../common/common.css';  // 기존 스타일링 파일을 참조

/**
 * 공통 Radio 컴포넌트
 * @param {string} value 선택값
 * @param {boolean} checked 선택 여부
 * @param {function} onChange 선택값이 변경될 때 호출되는 함수
 * @param {string} name 그룹 이름 (같은 name을 가진 radio는 하나만 선택됨)
 * @param {boolean} disabled radio를 비활성화할지 여부
 * @param {boolean} required 필수 입력 필드 여부
 * @param {string} className 추가 클래스명 (옵션)
 * @param {*} rest 기타 props (aria-* 등)
 */
function Radio({
                   value,
                   checked,
                   onChange,
                   name,
                   disabled = false,
                   required = false,
                   color = 'primary', // ← 추가
                   className = '',
                   ...rest
               }) {
    const classes = `input-radio ${color} ${className}`.trim(); // ← color 포함

    return (
        <label>
            <input
                type="radio"
                value={value}
                checked={checked}
                onChange={onChange}
                name={name}
                disabled={disabled}
                required={required}
                className={classes}
                {...rest}
            />
            <span>{value}</span>
        </label>
    );
}


Radio.propTypes = {
    value: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'black']), // ← 추가
};

export default Radio;
