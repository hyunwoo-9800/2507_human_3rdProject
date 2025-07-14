import React, { useState } from 'react';
import { Card } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import axios from "axios";

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
                        defaultFavorite = false,
                        memberId = null,
                        ...rest
                    }) => {
    const [favorite, setFavorite] = useState(defaultFavorite);
    const isRow = layout === 'row';

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation();

        if (!memberId) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            if (!favorite) {
                // 즐겨찾기 등록
                await axios.post("/api/favorites", {
                    memberId,
                    productId: id,
                });
                console.log("즐겨찾기 등록 완료");
            } else {
                // 즐겨찾기 취소
                await axios.delete("/api/favorites", {
                    data: {
                        memberId,
                        productId: id,
                    }
                });
                console.log("즐겨찾기 취소 완료");
            }

            setFavorite(!favorite);
        } catch (error) {
            console.error("즐겨찾기 토글 실패", error);
            alert("즐겨찾기 중 문제가 발생했습니다.");
        }
    };

    return (
        <Card
            hoverable
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
                    onClick={handleFavoriteToggle}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontSize: 24,
                        cursor: 'pointer',
                    }}
                >
                    {favorite
                        ? <StarFilled style={{ color: '#faad14' }} />
                        : <StarOutlined style={{ color: '#aaa' }} />
                    }
                </div>

                {/* 회사명 + 상품명 */}
                <div style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 1.4 }}>
                    {company && <div>{company}</div>}
                    {productName && <div>{productName}</div>}
                </div>

                {/* 가격 + 라벨 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                }}>
                    <div style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {price.toLocaleString()}원
                    </div>
                    <div>
                        {immediatePurchase && (
                            <span style={{
                                backgroundColor: '#ff6699',
                                color: 'white',
                                borderRadius: 4,
                                padding: '4px 8px',
                                marginLeft: 4,
                                fontSize: 14,
                            }}>
                                즉시
                            </span>
                        )}
                        {reservationPurchase && (
                            <span style={{
                                backgroundColor: '#3366cc',
                                color: 'white',
                                borderRadius: 4,
                                padding: '4px 8px',
                                marginLeft: 4,
                                fontSize: 14,
                            }}>
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
    );
};

export default CustomCard;
