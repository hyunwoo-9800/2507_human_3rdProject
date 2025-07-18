// 기존 Radio.jsx는 이제 삭제하거나 사용 안 해도 됩니다
// 아래는 antd의 Radio.Group & Radio.Button 구조 예시

import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'

/**
 * 공통 RadioGroup 컴포넌트
 * @param {string} value 현재 선택된 값
 * @param {function} onChange 선택값 변경 시 호출
 * @param {Array} options 라디오 옵션 배열 [{ label: '즉시 구매', value: 'immediate' }, ...]
 * @param {string} name name 속성 (옵션)
 * @param {string} className 추가 클래스
 */
const CustomRadio = ({ value, onChange, options, name = '', className = '' }) => {
  return (
    <Radio.Group
      onChange={(e) => onChange(e.target.value)}
      value={value}
      name={name}
      className={className}
      optionType="default" // button으로 바꾸고 싶으면 'button'\
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '100px', // marginRight 대신 gap 사용
      }}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          style={{
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {opt.label}
        </Radio>
      ))}
    </Radio.Group>
  )
}

CustomRadio.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
}

export default CustomRadio
