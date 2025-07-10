import React, { useState, useEffect } from 'react';
import { InputNumber } from 'antd';
import '../common/common.css'

const CustomInputNumber = ({
                                    defaultValue = 0,
                                    min,
                                    max,
                                    step = 1,
                                    onChange,
                                    className = '',
                                    ...rest
                                }) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        if (onChange) onChange(value);
    }, [value, onChange]);

    const increment = () => {
        setValue((prev) => {
            const next = (prev ?? 0) + step;
            if (max !== undefined && next > max) return prev;
            return next;
        });
    };

    const decrement = () => {
        setValue((prev) => {
            const next = (prev ?? 0) - step;
            if (min !== undefined && next < min) return prev;
            return next;
        });
    };

    const onInputChange = (val) => {
        setValue(val);
    };

    return (
        <div className={`input-number-group ${className}`}>
            <button type="button" className="input-btn minus" onClick={decrement}>
                -
            </button>
            <InputNumber
                className="input-number"
                value={value}
                onChange={onInputChange}
                min={min}
                max={max}
                step={step}
                controls={false}  // 증감 버튼 숨김
                {...rest}
            />
            <button type="button" className="input-btn plus" onClick={increment}>
                +
            </button>
        </div>
    );
};

export default CustomInputNumber;
