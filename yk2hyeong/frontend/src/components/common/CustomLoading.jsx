import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import PropTypes from 'prop-types'

const defaultStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
}

const CustomLoading = ({ size, tipMessage, children }) => {
  const messages = [
    '당근을 뽑는 중...',
    '씨앗을 심는 중...',
    '물을 주는 중...',
    '영근이 형이 춤을 추는 중...',
    '땅을 고르는 중...',
    '비료를 주는 중...',
    '슬롯머신을 돌리는 중...',
    '잡초를 제거하는 중...',
    '영근이야기에 가입하는 중...',
    '두리쥐를 교육하는 중...',
    '수박게임을 즐기는 중...',
  ]

  const [randomMessage, setRandomMessage] = useState(() => {
    const idx = Math.floor(Math.random() * messages.length)
    return messages[idx]
  })

  useEffect(() => {
    if (tipMessage) return

    const interval = setInterval(() => {
      let next
      do {
        next = messages[Math.floor(Math.random() * messages.length)]
      } while (next === randomMessage)
      setRandomMessage(next)
    }, 2000)

    return () => clearInterval(interval)
  }, [randomMessage, tipMessage])

  return (
    <Spin tip={tipMessage || randomMessage} size={size}>
      {children || <div style={defaultStyle} />}
    </Spin>
  )
}

CustomLoading.propTypes = {
  size: PropTypes.oneOf(['small', 'default', 'large']),
  tipMessage: PropTypes.string,
  children: PropTypes.node,
}

CustomLoading.defaultProps = {
  size: 'default',
}

export default CustomLoading
