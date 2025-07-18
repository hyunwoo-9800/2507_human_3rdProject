import React from 'react'
import { Card } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'

const CustomCard = ({
  id,
  title = '',
  description = '',
  image = '',
  layout = 'column',
  width = 320,
  company = '',
  productName = '',
  price = 0,
  minQuantity = 0,
  immediatePurchase = false,
  reservationPurchase = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  ...rest
}) => {
  const isRow = layout === 'row'

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        position: 'relative',
        display: isRow ? 'flex' : 'block',
        flexDirection: isRow ? 'row' : 'column',
        alignItems: isRow ? 'center' : 'stretch',
        width: isRow ? 'auto' : width,
        padding: isRow ? 12 : undefined,
        maxWidth: isRow ? '100%' : undefined,
      }}
      bodyStyle={{
        display: isRow ? 'flex' : 'block',
        flexDirection: isRow ? 'row' : 'column',
        alignItems: isRow ? 'center' : 'stretch',
        padding: isRow ? '0 0 0 12px' : undefined,
        flexGrow: 1,
      }}
      {...rest}
    >
      {image && (
        <img
          src={image}
          alt="card-img"
          style={{
            width: isRow ? 100 : '100%',
            objectFit: 'contain',
            borderRadius: 4,
          }}
        />
      )}
      <div style={{ flexGrow: 1, marginLeft: isRow ? 16 : 0, marginTop: isRow ? 0 : 12 }}>
        {/* 즐겨찾기 아이콘 */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            if (onFavoriteToggle) onFavoriteToggle()
          }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          {isFavorite ? (
            <StarFilled style={{ color: '#faad14' }} />
          ) : (
            <StarOutlined style={{ color: '#aaa' }} />
          )}
        </div>

        {/* 회사명 + 상품명 */}
        <div style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 1.4 }}>
          {company && <div>{company}</div>}
          {productName && <div>{productName}</div>}
        </div>

        {/* 가격 + 라벨 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold' }}>{price.toLocaleString()}원</div>
          <div>
            {immediatePurchase && (
              <span
                style={{
                  backgroundColor: '#ff6699',
                  color: 'white',
                  borderRadius: 4,
                  padding: '4px 8px',
                  marginLeft: 4,
                  fontSize: 14,
                }}
              >
                즉시
              </span>
            )}
            {reservationPurchase && (
              <span
                style={{
                  backgroundColor: '#3366cc',
                  color: 'white',
                  borderRadius: 4,
                  padding: '4px 8px',
                  marginLeft: 4,
                  fontSize: 14,
                }}
              >
                예약
              </span>
            )}
          </div>
        </div>

        {/* 최소 구매수량 */}
        <div style={{ marginTop: 10, fontSize: 14, color: '#555' }}>
          최소구매수량 <b>{minQuantity}</b>
        </div>
      </div>
    </Card>
  )
}

export default CustomCard
