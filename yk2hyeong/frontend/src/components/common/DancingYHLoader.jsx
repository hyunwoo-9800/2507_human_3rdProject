import React from 'react'
import './DancingYHLoader.css'

const DancingYHLoader = () => {
  return (
    <div className="dancing-yh-loader-container">
      <img
        src="/static/images/sidebanner.gif"
        alt="영근이 형이 춤을 추는 중..."
        className="dancing-yh-gif"
        loop="infinite"
      />
      <div className="dancing-yh-text">영근이 형이 춤을 추는 중...</div>
    </div>
  )
}

export default DancingYHLoader
