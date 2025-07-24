import React, { useState, useEffect, useRef } from 'react'
import CustomInputNumber from './CustomInputNumber'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import CustomRadio from './CustomRadio'
import axios from 'axios'
// CustomModal import 제거

const CustomDetailCard = ({
  productName = '',
  productCode = '',
  quantity = 0,
  shippingRegion = '',
  availableDate = '',
  price = 0,
  releaseDate = '',
  minOrder = 100,
  isFavorite = false,
  orderOptions = { immediate: false, reservation: false, reserveRate: 50 },
  defaultQuantity = 100,
  defaultOrderType = '',
  onQuantityChange = () => {},
  onOrderTypeChange = () => {},
  onOrder = () => {},
  images = [],
  imageStyle = {},
  onFavoriteToggle = () => {},
  memberId = '',
  favoriteProductIds = [],
  setFavoriteProductIds = () => {},
  productId = '',
  productCodeName = '',
}) => {
  const [orderType, setOrderType] = useState(() => {
    if (defaultOrderType && orderOptions[defaultOrderType]) {
      return defaultOrderType
    }
    if (orderOptions.immediate) return 'immediate'
    if (orderOptions.reservation) return 'reservation'
    return ''
  })

  const [orderQuantity, setOrderQuantity] = useState(defaultQuantity)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isReportOpen, setReportOpen] = useState(false)
  const [isBanListOpen, setBanListOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const reportOptions = [
    { label: '부정확한 상품 정보/이미지', value: '부정확한 상품 정보/이미지' },
    { label: '스팸 혹은 중복 게시물', value: '스팸 혹은 중복 게시물' },
    { label: '금지 품목 등록', value: '금지 품목 등록' },
    { label: '허위 광고', value: '허위 광고' },
    { label: '기타', value: '기타' },
  ]

  const [reportModalPos, setReportModalPos] = useState({
    x: window.innerWidth / 2 - 170,
    y: window.innerHeight / 2 - 160,
  })
  const [banModalPos, setBanModalPos] = useState({
    x: window.innerWidth / 2 + 220,
    y: window.innerHeight / 2 - 130,
  })
  const [dragging, setDragging] = useState(null) // { type: 'report'|'ban', offsetX, offsetY }
  const modalRefs = { report: useRef(null), ban: useRef(null) }

  // 수량 경계값 동기화
  useEffect(() => {
    setOrderQuantity((q) => {
      let next = q
      if (next < minOrder) next = minOrder
      if (next > quantity) next = quantity
      return next
    })
  }, [minOrder, quantity])

  // 드래그 이벤트 핸들러
  const handleMouseDown = (type, e) => {
    const modalRect = modalRefs[type].current.getBoundingClientRect()
    setDragging({
      type,
      offsetX: e.clientX - modalRect.left,
      offsetY: e.clientY - modalRect.top,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return
      if (dragging.type === 'report') {
        setReportModalPos({ x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY })
      } else if (dragging.type === 'ban') {
        setBanModalPos({ x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY })
      }
    }
    const handleMouseUp = () => setDragging(null)
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging])

  const handleOrderTypeChange = (value) => {
    setOrderType(value)
    onOrderTypeChange(value)
  }

  const handleQuantityChange = (value) => {
    if (value === null || value === undefined || isNaN(value)) {
      setOrderQuantity(minOrder)
      onQuantityChange(minOrder)
    } else {
      setOrderQuantity(value)
      onQuantityChange(value)
    }
  }

  const toggleFavorite = async () => {
    if (!memberId) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      if (!isFavorite) {
        await axios.post('/api/favorites', { memberId, productId })
        setFavoriteProductIds([...favoriteProductIds, productId])
        alert('관심상품에 등록되었습니다!')
      } else {
        await axios.delete('/api/favorites', { data: { memberId, productId } })
        setFavoriteProductIds(favoriteProductIds.filter((id) => id !== productId))
        alert('관심상품에서 삭제되었습니다!')
      }
    } catch (e) {
      alert('즐겨찾기 처리 중 오류가 발생했습니다.')
    }
  }

  const handleOrder = async () => {
    const orderId = `order-${Date.now()}`
    const orderName = `${productName} (${orderQuantity}개)`
    const unitPrice = price // 단가
    const totalPrice = price * orderQuantity // 총액
    const deliveryDate = releaseDate // 출하 예정일
    const amount = totalPrice
    const customerName = memberId

    if (!window.TossPayments) {
      alert('TossPayments SDK 로드 실패')
      return
    }

    const toss = new window.TossPayments('test_ck_LkKEypNArWd0xNQA9oaA8lmeaxYG')

    try {
      await toss.requestPayment('카드', {
        amount,
        orderId,
        orderName,
        successUrl:
          `${window.location.origin}/payment/success` +
          `?orderNumber=${orderId}` +
          `&orderType=${orderType}` +
          `&productId=${productId}` +
          `&memberId=${memberId}` +
          `&buyQty=${orderQuantity}` +
          `&buyUnitPrice=${unitPrice}` +
          `&buyTotalPrice=${totalPrice}` +
          `&buyDeliveryDate=${deliveryDate}` +
          `&createdId=${memberId}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerName,
      })
    } catch (error) {
      alert('결제 실패: ' + error.message)
    }
  }

  const totalPrice = price * orderQuantity
  const reservePrice = Math.floor((totalPrice * (orderOptions.reserveRate || 30)) / 100)

  const radioOptions = []
  if (orderOptions.immediate) radioOptions.push({ label: '즉시 구매', value: 'immediate' })
  if (orderOptions.reservation) radioOptions.push({ label: '예약 구매', value: 'reservation' })

  const defaultImageStyle = {
    width: '100%',
    borderRadius: 8,
    border: '1px solid black',
    height: '510px',
    objectFit: 'cover',
  }

  const mergedImageStyle = { ...defaultImageStyle, ...imageStyle }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#f5f5f5',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div style={{ width: '600px', marginRight: 20 }}>
        <img src={images[selectedImageIndex]} alt="상품 이미지" style={mergedImageStyle} />
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '509px',
          minHeight: '509px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
            width: '100%',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{productName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* 신고하기 버튼을 별 왼쪽에 위치 */}
            {memberId && (
              <button
                style={{
                  backgroundColor: '#E5402E',
                  color: 'white',
                  border: '1px solid #E5402E',
                  borderRadius: 4,
                  padding: '4px 10px',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                onClick={() => setReportOpen(true)}
              >
                신고하기
              </button>
            )}
            <div
              onClick={toggleFavorite}
              style={{
                fontSize: 28,
                cursor: 'pointer',
              }}
            >
              {isFavorite ? (
                <StarFilled style={{ color: '#faad14' }} />
              ) : (
                <StarOutlined style={{ color: '#aaa' }} />
              )}
            </div>
          </div>
        </div>

        {/* 신고 모달 */}
        {isReportOpen && (
          <div
            ref={modalRefs.report}
            style={{
              position: 'fixed',
              left: reportModalPos.x,
              top: reportModalPos.y,
              background: '#fffbe6',
              border: '2px solid #ffe58f',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              zIndex: 1001,
              minWidth: 340,
              padding: 32,
              minHeight: 320,
              cursor: dragging && dragging.type === 'report' ? 'move' : 'default',
            }}
          >
            {/* 드래그 핸들러: 제목줄 */}
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 16,
                color: '#d48806',
                cursor: 'move',
                userSelect: 'none',
              }}
              onMouseDown={(e) => handleMouseDown('report', e)}
            >
              상품 신고
              <button
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  fontSize: 30,
                  color: 'black',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                onClick={() => setReportOpen(false)}
                aria-label="신고 모달 닫기"
              >
                ×
              </button>
            </div>
            <div>
              <p>
                <span
                  style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setBanListOpen(true)}
                >
                  금지 품목 확인하기
                </span>
              </p>
              <p>
                <strong>신고 사유를 선택해주세요:</strong>
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                {reportOptions.map((option) => (
                  <label
                    key={option.value}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 4 }}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={option.value}
                      checked={reportReason === option.value}
                      onChange={() => setReportReason(option.value)}
                      style={{ marginRight: 4 }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <p style={{ marginTop: 15, color: '#666', fontSize: '14px' }}>
                신고 내용은 검토 후 처리됩니다. 신고하신 내용이 확인되면 해당 상품이 조치될 수
                있습니다.
              </p>
            </div>
          </div>
        )}

        {/* 금지 품목 모달 (신고 모달 오른쪽에 위치) */}
        {isBanListOpen && (
          <div
            ref={modalRefs.ban}
            style={{
              position: 'fixed',
              left: banModalPos.x,
              top: banModalPos.y,
              background: '#e6f7ff',
              border: '2px solid #91d5ff',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              zIndex: 1002,
              minWidth: 320,
              padding: 32,
              minHeight: 260,
              cursor: dragging && dragging.type === 'ban' ? 'move' : 'default',
            }}
          >
            {/* 드래그 핸들러: 제목줄 */}
            <div
              style={{
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 16,
                color: '#1890ff',
                cursor: 'move',
                userSelect: 'none',
              }}
              onMouseDown={(e) => handleMouseDown('ban', e)}
            >
              금지 품목 안내
              <button
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  fontSize: 30,
                  color: 'black',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                onClick={() => setBanListOpen(false)}
                aria-label="금지 품목 모달 닫기"
              >
                ×
              </button>
            </div>
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
              <li>반찬류, 탕류 등 가공식품(곶감 제외)</li>
              <li>작물씨앗, 묘목, 농약, 비료</li>
              <li>고기, 생선, 계란, 유제품 등 동물성 식품</li>
              <li>동물, 생명체</li>
              <li>그 외 상품 카테고리에 없는 품목</li>
            </ul>
            <p style={{ marginTop: 15, color: '#666', fontSize: '14px' }}>
              위 품목은 등록 및 판매가 금지되어 있습니다.
              <br /> 위반 시 상품이 삭제될 수 있습니다.
            </p>
          </div>
        )}

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>상품카테고리:</span>
            <span>{productCodeName}</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>출하자:</span>
            <span>{shippingRegion}</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>남은수량:</span>
            <span>{quantity.toLocaleString()}kg</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>판매종료일자:</span>
            <span>{availableDate}</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>단가:</span>
            <span>{price.toLocaleString()}원</span>
          </div>
        </div>
        <div style={{ color: 'red', fontWeight: 'bold', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>출하예정일:</span>
            <span>{releaseDate}</span>
          </div>
        </div>
        <hr style={{ margin: '20px 0', width: '100%' }} />

        <div style={{ width: '100%', textAlign: 'center' }}>
          <CustomRadio
            value={orderType}
            onChange={handleOrderTypeChange}
            options={radioOptions}
            name="orderType"
          />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            padding: 15,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginLeft: 'auto',
            marginTop: 15,
            width: '100%',
            minHeight: '200px',
          }}
        >
          <div
            style={{
              fontSize: 16,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>수량 (최소구매수량 {minOrder}kg)</div>
            <div>
              <CustomInputNumber
                value={orderQuantity}
                min={minOrder}
                max={quantity}
                step={1}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

          <div style={{ width: '100%' }}>
            {/* 예약금액 영역 */}
            <div
              style={{
                color: 'blue',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '40px',
                visibility: orderType === 'reservation' ? 'visible' : 'hidden',
              }}
            >
              <span>예약금액 ({orderOptions.reserveRate}%)</span>
              <span>{reservePrice.toLocaleString()}원</span>
            </div>

            {/* 총금액 영역 */}
            <div
              style={{
                color: 'red',
                fontSize: 24,
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: 20,
              }}
            >
              <span>총금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          <button
            onClick={() => {
              onOrder({ orderType, orderQuantity }) // 필요하면 유지
              handleOrder() // 결제 요청
            }}
            style={{
              backgroundColor: orderType === 'reservation' ? '#3067ce' : '#fe6799',
              color: 'white',
              fontSize: 20,
              padding: '10px 20px',
              borderRadius: 8,
              width: '100%',
              height: '50px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {orderType === 'reservation' ? '예약하기' : '구매하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomDetailCard
