import React, { useState } from 'react';
import CustomInputNumber from './CustomInputNumber'; // 수량 입력 컴포넌트 경로 명시

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
                              defaultOrderType = 'reservation',
                              defaultQuantity = 100,
                              onQuantityChange = () => {},
                              onOrderTypeChange = () => {},
                              onOrder = () => {},
                              images = [],
                          }) => {
    const [orderType, setOrderType] = useState(defaultOrderType);
    const [orderQuantity, setOrderQuantity] = useState(defaultQuantity);

    const handleOrderTypeChange = (e) => {
        const value = e.target.value;
        setOrderType(value);
        onOrderTypeChange(value);
    };

    const handleQuantityChange = (value) => {
        setOrderQuantity(value);
        onQuantityChange(value);
    };

    const totalPrice = price * orderQuantity;
    const reservePrice = Math.floor(totalPrice * 0.3); // 30% 예약금

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            background: '#f5f5f5',
            borderRadius: 16,
            padding: 24,
            maxWidth: 1200,
            margin: '0 auto',
        }}>
            {/* 이미지 */}
            <div style={{ width: '250px', marginRight: 20 }}>
                <img
                    src={images[0]}
                    alt="상품 이미지"
                    style={{ width: '100%', borderRadius: 8, border: '1px solid black' }}
                />
                <div style={{ display: 'flex', marginTop: 8 }}>
                    {images.slice(1).map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`thumb-${idx}`}
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 4,
                                marginRight: 6,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 상세정보 */}
            <div style={{ width: '600px' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{productName}</div>
                <div style={{ marginBottom: 8 }}>상품번호: {productCode}</div>
                <div>남은수량: {quantity.toLocaleString()}개</div>
                <div>배송가능지역: {shippingRegion}</div>
                <div>구매가능일자: {availableDate}</div>
                <div>단가: {price.toLocaleString()}원</div>
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    출하예정일: {releaseDate}
                </div>

                {/* 주문방식 */}
                <div style={{ marginTop: 12 }}>
                    <label style={{ marginRight: 16 }}>
                        <input
                            type="radio"
                            name="orderType"
                            value="immediate"
                            checked={orderType === 'immediate'}
                            onChange={handleOrderTypeChange}
                        /> 즉시 구매
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="orderType"
                            value="reservation"
                            checked={orderType === 'reservation'}
                            onChange={handleOrderTypeChange}
                        /> 예약 구매
                    </label>
                </div>

                {/* 수량 선택 */}
                <div style={{ marginTop: 16, fontSize: 16 }}>
                    <div>
                        수량 (최소구매수량 {minOrder}개)
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <CustomInputNumber
                            defaultValue={defaultQuantity}
                            min={minOrder}
                            max={quantity} // 👈 최대 주문 수량 제한
                            step={1}
                            onChange={handleQuantityChange}
                        />
                    </div>
                </div>

                {/* 가격 정보 */}
                <div style={{ marginTop: 16 }}>
                    <div style={{ color: 'blue', fontSize: 20 }}>
                        예약금액 (30%) {reservePrice.toLocaleString()}원
                    </div>
                    <div style={{ color: 'red', fontSize: 24, fontWeight: 'bold' }}>
                        총금액 {totalPrice.toLocaleString()}원
                    </div>
                </div>

                <button
                    onClick={() => onOrder({ orderType, orderQuantity })}
                    style={{
                        marginTop: 20,
                        backgroundColor: '#666',
                        color: 'white',
                        fontSize: 18,
                        padding: '10px 20px',
                        borderRadius: 8,
                        width: '100%',
                    }}
                >
                    예약하기
                </button>
            </div>
        </div>
    );
};

export default CustomDetailCard;
