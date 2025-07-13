import React from 'react'
import DaumPostcode from 'react-daum-postcode'
import './AddressSearchModal.css'

export default function AddressSearchModal({ onClose, onComplete }) {
  // 주소 검색이 완료된 후 호출되는 함수
  const handleComplete = (data) => {
    let fullAddress = data.address // 기본 주소
    let extraAddress = '' // 추가 주소 (상세 주소)

    // 주소 타입이 'R'인 경우, 추가 주소 정보가 있을 수 있음
    if (data.addressType === 'R') {
      if (data.bname) extraAddress += data.bname // 법정동 정보
      if (data.buildingName)
        extraAddress += extraAddress ? `, ${data.buildingName}` : data.buildingName // 건물명
      fullAddress += extraAddress ? ` (${extraAddress})` : '' // 기본 주소 + 추가 주소
    }

    // 부모 컴포넌트로 선택된 주소를 전달
    onComplete(fullAddress)
    // 모달 닫기
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {/* Daum Postcode API 컴포넌트 */}
        <DaumPostcode onComplete={handleComplete} />
        {/* 모달 닫기 버튼 */}
        <button onClick={onClose} className="close-btn">
          닫기
        </button>
      </div>
    </div>
  )
}
