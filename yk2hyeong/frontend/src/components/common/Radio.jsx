import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../../common/common.css';

function Radio({
                   value,
                   checked,
                   onChange,
                   name,
                   disabled = false,
                   required = false,
                   color = 'primary',
                   className = '',
                   label,
                   ...rest
               }) {
    const inputRef = useRef();

    // 강제 동기화: checked 상태 변경될 때마다 DOM에 반영되게
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.checked = checked;
        }
    }, [checked]);

    const classes = `input-radio ${color} ${className}`.trim();

    return (
        <label className="radio-label">
            <input
                ref={inputRef}
                type="radio"
                value={value}
                onChange={onChange}
                name={name}
                disabled={disabled}
                required={required}
                className={classes}
                {...rest}
            />
            <span>{label || value}</span>
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
    color: PropTypes.oneOf(['primary', 'black']),
    label: PropTypes.string,
};

export default Radio;
