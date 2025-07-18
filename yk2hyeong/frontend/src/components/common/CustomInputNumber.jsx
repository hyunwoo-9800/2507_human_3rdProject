import React from 'react'
import { InputNumber } from 'antd'
import '../common/common.css'

const CustomInputNumber = ({ value, onChange, min, max, step = 1, className = '', ...rest }) => {
  const increment = () => {
    const next = (value ?? 0) + step
    if (max !== undefined && next > max) return
    onChange?.(next)
  }

  const decrement = () => {
    const next = (value ?? 0) - step
    if (min !== undefined && next < min) return
    onChange?.(next)
  }

  const onInputChange = (val) => {
    onChange?.(val)
  }

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
        controls={false}
        {...rest}
      />
      <button type="button" className="input-btn plus" onClick={increment}>
        +
      </button>
    </div>
  )
}

export default CustomInputNumber
