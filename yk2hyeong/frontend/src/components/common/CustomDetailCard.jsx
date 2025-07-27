import React, {useState, useEffect, useRef} from 'react'
import CustomInputNumber from './CustomInputNumber'
import {StarFilled, StarOutlined} from '@ant-design/icons'
import CustomRadio from './CustomRadio'
import axios from 'axios'
import {useLogin} from "../../pages/login/LoginContext";
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
                              orderOptions = {immediate: false, reservation: false, reserveRate: 50},
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
                              // memberId = '',
                              favoriteProductIds = [],
                              setFavoriteProductIds = () => {
                              },
                              productId = '',
                              productCodeName = '',
                          }) => {
    const {loginMember} = useLogin();
    const memberId = loginMember?.memberId;

    const [orderType, setOrderType] = useState(() => {
        if (defaultOrderType && orderOptions[defaultOrderType]) {
            return defaultOrderType
        }
        if (orderOptions.immediate) return 'immediate'
        if (orderOptions.reservation) return 'reservation'
        return ''
    })

    const [inputValue, setInputValue] = useState(defaultQuantity)
    const [orderQuantity, setOrderQuantity] = useState(defaultQuantity)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [isReportOpen, setReportOpen] = useState(false)
    const [isBanListOpen, setBanListOpen] = useState(false)
    const [reportReason, setReportReason] = useState('')
    const [reportDetail, setReportDetail] = useState('')
    const reportOptions = [
        {label: '부정확한 상품 정보/이미지', value: '부정확한 상품 정보/이미지'},
        {label: '스팸 혹은 중복 게시물', value: '스팸 혹은 중복 게시물'},
        {label: '금지 품목 등록', value: '금지 품목 등록'},
        {label: '허위 광고', value: '허위 광고'},
        {label: '기타', value: '기타'},
    ]

    // 신고 모달: left 100px, top 200px
    const [reportModalPos, setReportModalPos] = useState({
        x: 100,
        y: 200,
    })
    // 금지 품목 모달: left 750px, top 250px
    const [banModalPos, setBanModalPos] = useState({
        x: 750,
        y: 250,
    })
    const [dragging, setDragging] = useState(null) // { type: 'report'|'ban', offsetX, offsetY }
    const modalRefs = {report: useRef(null), ban: useRef(null)}

    //reasonCode 추가
    const reasonCodeMap = {
        '부정확한 상품 정보/이미지': '001',
        '스팸 혹은 중복 게시물': '002',
        '금지 품목 등록': '003',
        '허위 광고': '004',
        기타: '005',
    }

    // 수량 경계값 동기화
    useEffect(() => {
        setOrderQuantity((q) => {
            let next = q
            if (next < minOrder) next = minOrder
            if (next > quantity) next = quantity
            return next
        })
        setInputValue((v) => {
            let next = v
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
                setReportModalPos({x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY})
            } else if (dragging.type === 'ban') {
                setBanModalPos({x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY})
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

    const [showQuantityWarning, setShowQuantityWarning] = useState(false)

    const handleInputChange = (value) => {
        setInputValue(value)
        if (value > quantity) {
            setShowQuantityWarning(true)
        } else {
            setShowQuantityWarning(false)
        }
    }

    const handleInputBlur = () => {
        let finalValue = inputValue
        if (inputValue > quantity) {
            finalValue = quantity
            setShowQuantityWarning(false)
        }
        if (finalValue < minOrder) {
            finalValue = minOrder
        }
        setOrderQuantity(finalValue)
        onQuantityChange(finalValue)
        setInputValue(finalValue)
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

        if (loginMember) {

            const orderId = `order-${Date.now()}`
            const orderName = `${productName} (${orderQuantity}개)`
            const unitPrice = price // 단가
            const totalPrice = price * orderQuantity // 총액
            const reservePrice = Math.floor((totalPrice * (orderOptions.reserveRate || 50)) / 100);
            const deliveryDate = releaseDate // 출하 예정일
            const amount = orderType === 'reservation' ? reservePrice : totalPrice;
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
        } else {

            alert('로그인 해 주세요!');

        }
    }

    // 금액 계산 시 inputValue 사용
    const calcQty = typeof inputValue === 'number' && inputValue > 0 ? inputValue : minOrder
    const totalPrice = price * calcQty
    const reservePrice = Math.floor((totalPrice * (orderOptions.reserveRate || 50)) / 100)

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

    const handleReportSubmit = async () => {
        const reasonCode = reasonCodeMap[reportReason] || '005' // 매핑 실패 시 기본
        try {
            await axios.post('/api/report', {
                reasonCode,
                reasonName: reportReason,
                reportContent: reportDetail,
                productId: productId,
                reporterId: memberId,
                createdId: memberId,
            })
            setReportOpen(false)
            setReportDetail('')
            setReportReason('')
            setBanListOpen(false)
            alert('신고가 접수되었습니다.')
        } catch (e) {
            alert('신고 접수 중 오류가 발생했습니다.')
        }
    }

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
                                <StarFilled style={{color: '#faad14'}}/>
                            ) : (
                                <StarOutlined style={{color: '#aaa'}}/>
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
                                onClick={() => {
                                    setReportOpen(false)
                                    setReportDetail('')
                                    setReportReason('')
                                }}
                                aria-label="신고 모달 닫기"
                            >
                                ×
                            </button>
                        </div>
                        <div>
                            <p>
                <span
                    style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}
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
                                        style={{display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 4}}
                                    >
                                        <input
                                            type="radio"
                                            name="reportReason"
                                            value={option.value}
                                            checked={reportReason === option.value}
                                            onChange={() => setReportReason(option.value)}
                                            style={{marginRight: 4}}
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>

                            <textarea
                                value={reportDetail}
                                onChange={(e) => setReportDetail(e.target.value)}
                                rows={4}
                                style={{
                                    width: '98%',
                                    borderRadius: 6,
                                    border: '1px solid #ccc',
                                    padding: 10,
                                    fontSize: 15,
                                    marginTop: 16,
                                    marginBottom: 4,
                                    resize: 'vertical',
                                }}
                                placeholder="내용이 충분하지 않을 경우 사실 확인이 어려울 수 있습니다."
                            />
                            <p style={{marginTop: 10, color: '#666', fontSize: '14px', marginBottom: 32}}>
                                - 신고 내용은 검토 후 처리됩니다. <br/>- 신고 내용이 사실과 다르거나 허위인 경우,
                                이용 제재를 받을 수 있습니다. <br/>- 신고자의 정보 및 신고 내용은 안전하게 보호되며
                                외부에 공개되지 않습니다.
                            </p>
                            {/* 접수하기 버튼 안내문 아래 오른쪽 정렬 */}
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <button
                                    style={{
                                        background: '#E5402E',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '8px 32px',
                                        fontWeight: 700,
                                        fontSize: 16,
                                        cursor: reportReason && reportDetail.trim() ? 'pointer' : 'not-allowed',
                                        opacity: reportReason && reportDetail.trim() ? 1 : 0.5,
                                    }}
                                    disabled={!(reportReason && reportDetail.trim())}
                                    onClick={handleReportSubmit}
                                >
                                    신고하기
                                </button>
                            </div>
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
                        <ul style={{marginTop: 10, paddingLeft: 20}}>
                            <li>반찬류, 탕류 등 가공식품(곶감 제외)</li>
                            <li>작물씨앗, 묘목, 농약, 비료</li>
                            <li>고기, 생선, 계란, 유제품 등 동물성 식품</li>
                            <li>동물, 생명체</li>
                            <li>그 외 상품 카테고리에 없는 품목</li>
                        </ul>
                        <p style={{marginTop: 15, color: '#666', fontSize: '14px'}}>
                            위 품목은 등록 및 판매가 금지되어 있습니다.
                            <br/> 위반 시 상품이 삭제될 수 있습니다.
                        </p>
                    </div>
                )}

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
                        <span>{quantity.toLocaleString()}kg</span>
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
                        <span>{price.toLocaleString()}원 / kg</span>
                    </div>
                </div>
                <div style={{color: 'red', fontWeight: 'bold', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>출하예정일:</span>
                        <span>{releaseDate}</span>
                    </div>
                </div>
                <hr style={{margin: '10px 0', width: '100%'}}/>

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
                        <div>수량 (최소구매수량 {minOrder}kg)</div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <CustomInputNumber
                                value={inputValue}
                                min={minOrder}
                                max={999999}
                                step={1}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                            />
                            <span style={{marginLeft: 4}}>kg</span>
                        </div>
                    </div>
                    <div
                        style={{
                            minHeight: 22, // 경고문구 한 줄 높이(적당히 조절)
                            color: showQuantityWarning ? 'red' : 'transparent',
                            fontSize: 14,
                            marginTop: 4,
                            textAlign: 'right',
                            width: '100%',
                            transition: 'color 0.2s',
                        }}
                    >
                        남은수량이 {quantity}kg입니다.
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
                                marginBottom: 10,
                            }}
                        >
                            <span>총금액</span>
                            <span>{totalPrice.toLocaleString()}원</span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            onOrder({orderType, orderQuantity}) // 필요하면 유지
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
