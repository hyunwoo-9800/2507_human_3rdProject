import React from 'react'
import './productTabs.css'

export default function DeliveryInfoTab({ product }) {
  return (
    <div className="delivery-info-tab">
      <h3>배송/반품 정보</h3>

      <div className="delivery-section">
        <h4>배송 정보</h4>
        <div className="delivery-details">
          <div className="detail-item">
            <strong>배송 지역:</strong>
            <span>전국 (일부 도서산간 지역 제외)</span>
          </div>
          <div className="detail-item">
            <strong>배송 방법:</strong>
            <span>택배 (CJ대한통운, 로젠택배)</span>
          </div>
          <div className="detail-item">
            <strong>배송 기간:</strong>
            <span>주문 후 1-3일 (영업일 기준)</span>
          </div>
          <div className="detail-item">
            <strong>배송비:</strong>
            <span>3,000원 (5만원 이상 구매 시 무료)</span>
          </div>
          <div className="detail-item">
            <strong>출하 예정일:</strong>
            <span>2024년 7월 4일</span>
          </div>
        </div>
      </div>

      <div className="return-section">
        <h4>반품/교환 정보</h4>
        <div className="return-details">
          <div className="detail-item">
            <strong>반품 기간:</strong>
            <span>수령일로부터 7일 이내</span>
          </div>
          <div className="detail-item">
            <strong>반품 조건:</strong>
            <span>상품 불량, 오배송, 상품 상이 시</span>
          </div>
          <div className="detail-item">
            <strong>반품 불가:</strong>
            <span>고객 변심, 상품 사용/훼손</span>
          </div>
          <div className="detail-item">
            <strong>반품비:</strong>
            <span>판매자 부담 (단순 변심 시 구매자 부담)</span>
          </div>
        </div>
      </div>

      <div className="storage-section">
        <h4>보관 방법</h4>
        <div className="storage-details">
          <div className="detail-item">
            <strong>보관 온도:</strong>
            <span>0-4°C (냉장 보관)</span>
          </div>
          <div className="detail-item">
            <strong>보관 기간:</strong>
            <span>수령일로부터 7일 이내 섭취 권장</span>
          </div>
          <div className="detail-item">
            <strong>보관 방법:</strong>
            <span>비닐 포장 제거 후 냉장고 보관</span>
          </div>
        </div>
      </div>

      <div className="contact-section">
        <h4>문의 연락처</h4>
        <div className="contact-details">
          <div className="detail-item">
            <strong>판매자:</strong>
            <span>(주)천안청과</span>
          </div>
          <div className="detail-item">
            <strong>연락처:</strong>
            <span>041-123-4567</span>
          </div>
          <div className="detail-item">
            <strong>이메일:</strong>
            <span>customer@cheonanfruit.co.kr</span>
          </div>
          <div className="detail-item">
            <strong>운영시간:</strong>
            <span>평일 09:00-18:00 (주말/공휴일 휴무)</span>
          </div>
        </div>
      </div>

      <div className="notice-section">
        <h4>배송 관련 안내사항</h4>
        <ul>
          <li>신선식품 특성상 출하일 기준으로 배송됩니다.</li>
          <li>기상 상황에 따라 배송 일정이 변경될 수 있습니다.</li>
          <li>수령 후 즉시 냉장 보관해 주시기 바랍니다.</li>
          <li>배송 중 상품 손상 시 즉시 연락 주시기 바랍니다.</li>
        </ul>
      </div>
    </div>
  )
}
