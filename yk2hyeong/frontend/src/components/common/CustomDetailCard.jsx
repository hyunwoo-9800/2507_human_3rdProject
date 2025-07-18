import React, { useState } from 'react'
import CustomInputNumber from './CustomInputNumber'
import { StarFilled, StarOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import CustomRadio from './CustomRadio'
import CustomModal from './CustomModal'

const CustomDetailCard = ({
  productName = '',
  productCode = '',
  quantity = 0,
  shippingRegion = '',
  availableDate = '',
  price = 0,
  releaseDate = '',
  minOrder = 100,
  favorite = false,
  orderOptions = { immediate: false, reservation: false, reserveRate: 30 },
  defaultQuantity = 100,
  defaultOrderType = '',
  onQuantityChange = () => {},
  onOrderTypeChange = () => {},
  onOrder = () => {},
  images = [],
  imageStyle = {},
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
  const [isFavorite, setIsFavorite] = useState(favorite)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleOrderTypeChange = (value) => {
    setOrderType(value)
    onOrderTypeChange(value)
  }

  const handleQuantityChange = (value) => {
    setOrderQuantity(value)
    onQuantityChange(value)
  }

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev)
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
            <CustomModal
              type="warning"
              title="상품 신고"
              content={
                <div>
                  <p>
                    <strong>신고 사유를 선택해주세요:</strong>
                  </p>
                  <ul style={{ marginTop: 10, paddingLeft: 20 }}>
                    <li>부정확한 상품 정보</li>
                    <li>부적절한 상품 이미지</li>
                    <li>허위 광고</li>
                    <li>가격 조작 의심</li>
                    <li>기타</li>
                  </ul>
                  <p style={{ marginTop: 15, color: '#666', fontSize: '14px' }}>
                    신고 내용은 검토 후 처리됩니다. 신고하신 내용이 확인되면 해당 상품이 조치될 수
                    있습니다.
                  </p>
                </div>
              }
              buttonLabel="신고하기"
              buttonColor="warning"
              buttonSize="sm"
              successMessage="신고가 접수되었습니다. 검토 후 처리하겠습니다."
              onOk={() => {
                console.log('상품 신고 처리:', productCode)
              }}
            />
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

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>상품번호:</span>
            <span>{productCode}</span>
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
            <span>{quantity.toLocaleString()}개</span>
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
            <div>수량 (최소구매수량 {minOrder}개)</div>
            <div>
              <CustomInputNumber
                defaultValue={defaultQuantity}
                min={minOrder}
                max={quantity}
                step={1}
                onChange={handleQuantityChange}
              />
            </div>
          </div>

          <div style={{ width: '100%' }}>
            {/* 예약금액 영역 - 높이 고정 */}
            <div
              style={{
                color: 'blue',
                fontSize: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '40px', // 고정 높이
                visibility: orderType === 'reservation' ? 'visible' : 'hidden', // 텍스트만 숨김/표시
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
            onClick={() => onOrder({ orderType, orderQuantity })}
            style={{
              backgroundColor: '#666',
              color: 'white',
              fontSize: 18,
              padding: '10px 20px',
              borderRadius: 8,
              width: '100%',
              height: '50px',
              border: 'none',
              cursor: 'pointer',
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
