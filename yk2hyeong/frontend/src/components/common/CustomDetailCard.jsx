import React, {useState, useEffect} from 'react'
import CustomInputNumber from './CustomInputNumber'
import {StarFilled, StarOutlined} from '@ant-design/icons'
import CustomRadio from './CustomRadio'
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
                              orderOptions = {immediate: false, reservation: false, reserveRate: 30},
                              defaultQuantity = 100,
                              defaultOrderType = '',
                              onQuantityChange = () => {
                              },
                              onOrderTypeChange = () => {
                              },
                              onOrder = () => {
                              },
                              images = [],
                              imageStyle = {},
                              onFavoriteToggle = () => {
                              },
                              memberId = '',
                              favoriteProductIds = [],
                              setFavoriteProductIds = () => {
                              },
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

    // 수량 경계값 동기화
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

    const toggleFavorite = async () => {
        if (!memberId) {
            alert('로그인이 필요합니다.')
            return
        }

        try {
            if (!isFavorite) {
                await axios.post('/api/favorites', {memberId, productId})
                setFavoriteProductIds([...favoriteProductIds, productId])
                alert('관심상품에 등록되었습니다!')
            } else {
                await axios.delete('/api/favorites', {data: {memberId, productId}})
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
                successUrl: `${window.location.origin}/payment/success`
                    + `?orderNumber=${orderId}`
                    + `&orderType=${orderType}`
                    + `&productId=${productId}`
                    + `&memberId=${memberId}`
                    + `&buyQty=${orderQuantity}`
                    + `&buyUnitPrice=${unitPrice}`
                    + `&buyTotalPrice=${totalPrice}`
                    + `&buyDeliveryDate=${deliveryDate}`
                    + `&createdId=${memberId}`,
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
    if (orderOptions.immediate) radioOptions.push({label: '즉시 구매', value: 'immediate'})
    if (orderOptions.reservation) radioOptions.push({label: '예약 구매', value: 'reservation'})

    const defaultImageStyle = {
        width: '100%',
        borderRadius: 8,
        border: '1px solid black',
        height: '510px',
        objectFit: 'cover',
    }

    const mergedImageStyle = {...defaultImageStyle, ...imageStyle}

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
            <div style={{width: '600px', marginRight: 20}}>
                <img src={images[selectedImageIndex]} alt="상품 이미지" style={mergedImageStyle}/>
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
                    <div style={{fontSize: 20, fontWeight: 'bold'}}>{productName}</div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <div
                            onClick={toggleFavorite}
                            style={{
                                fontSize: 28,
                                cursor: 'pointer',
                            }}
                        >
                            {isFavorite ? (
                                <StarFilled style={{color: '#faad14'}}/>
                            ) : (
                                <StarOutlined style={{color: '#aaa'}}/>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>상품카테고리:</span>
                        <span>{productCodeName}</span>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>출하자:</span>
                        <span>{shippingRegion}</span>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>남은수량:</span>
                        <span>{quantity.toLocaleString()}개</span>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>판매종료일자:</span>
                        <span>{availableDate}</span>
                    </div>
                </div>
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>단가:</span>
                        <span>{price.toLocaleString()}원</span>
                    </div>
                </div>
                <div style={{color: 'red', fontWeight: 'bold', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>출하예정일:</span>
                        <span>{releaseDate}</span>
                    </div>
                </div>
                <hr style={{margin: '20px 0', width: '100%'}}/>

                <div style={{width: '100%', textAlign: 'center'}}>
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
                                value={orderQuantity}
                                min={minOrder}
                                max={quantity}
                                step={1}
                                onChange={handleQuantityChange}
                            />
                        </div>
                    </div>

                    <div style={{width: '100%'}}>
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
                            onOrder({orderType, orderQuantity})  // 필요하면 유지
                            handleOrder()                           // 결제 요청
                        }}
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
