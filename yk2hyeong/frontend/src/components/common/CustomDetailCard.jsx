import React, { useState, useEffect } from 'react'
import CustomInputNumber from './CustomInputNumber'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import CustomRadio from './CustomRadio'
import CustomModal from './CustomModal'
import axios from 'axios'

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
                              orderOptions = { immediate: false, reservation: false, reserveRate: 30 },
                              defaultQuantity = 100,
                              defaultOrderType = '',
                              onQuantityChange = () => {},
                              onOrderTypeChange = () => {},
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

    useEffect(() => {
        setOrderQuantity((q) => {
            let next = q
            if (next < minOrder) next = minOrder
            if (next > quantity) next = quantity
            return next
        })
    }, [minOrder, quantity])

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

    const totalPrice = price * orderQuantity
    const reservePrice = Math.floor((totalPrice * (orderOptions.reserveRate || 30)) / 100)

    const radioOptions = []
    if (orderOptions.immediate) radioOptions.push({ label: '즉시 구매', value: 'immediate' })
    if (orderOptions.reservation) radioOptions.push({ label: '예약 구매', value: 'reservation' })

    const mergedImageStyle = {
        width: '100%',
        borderRadius: 8,
        border: '1px solid black',
        height: '510px',
        objectFit: 'cover',
        ...imageStyle,
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
        const amount = price * orderQuantity
        const customerName = memberId || '비회원'

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
                successUrl: `${window.location.origin}/payment/success?orderId=${orderId}&orderType=${orderType}&productId=${productId}&quantity=${orderQuantity}`,
                failUrl: `${window.location.origin}/payment/fail`,
                customerName,
            })
        } catch (error) {
            alert('결제 실패: ' + error.message)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row', background: '#f5f5f5', borderRadius: 16, padding: 24, width: '100%', margin: '0 auto' }}>
            <div style={{ width: '600px', marginRight: 20 }}>
                <img src={images[selectedImageIndex]} alt="상품 이미지" style={mergedImageStyle} />
            </div>

            <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{productName}</div>

                <div style={{ marginBottom: 10 }}>
                    <div>카테고리: {productCodeName}</div>
                    <div>출하자: {shippingRegion}</div>
                    <div>남은 수량: {quantity.toLocaleString()}개</div>
                    <div>판매 종료일: {availableDate}</div>
                    <div>단가: {price.toLocaleString()}원</div>
                    <div style={{ color: 'red', fontWeight: 'bold' }}>출하 예정일: {releaseDate}</div>
                </div>

                <CustomRadio
                    value={orderType}
                    onChange={handleOrderTypeChange}
                    options={radioOptions}
                    name="orderType"
                />

                <div style={{ marginTop: 15 }}>
                    <div style={{ marginBottom: 10 }}>수량 (최소 {minOrder}개)</div>
                    <CustomInputNumber
                        value={orderQuantity}
                        min={minOrder}
                        max={quantity}
                        step={1}
                        onChange={handleQuantityChange}
                    />
                </div>

                {orderType === 'reservation' && (
                    <div style={{ color: 'blue', fontSize: 18, marginTop: 15 }}>
                        예약금액 ({orderOptions.reserveRate}%): {reservePrice.toLocaleString()}원
                    </div>
                )}

                <div style={{ color: 'red', fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>
                    총금액: {totalPrice.toLocaleString()}원
                </div>

                <button
                    onClick={handleOrder}
                    style={{
                        marginTop: 20,
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
    )
}

export default CustomDetailCard
