import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../common/CustomPagination'
import { useNavigate } from 'react-router-dom'
import CustomModal from '../common/CustomModal'

function Notification({ readStatus }) {
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const navigate = useNavigate()
  const [modalConfig, setModalConfig] = useState(null)

  const [products, setProducts] = useState([])
  const [soldExtraData, setSoldExtraData] = useState([])

  // 전화번호에 하이픈 추가하는 함수
  const formatPhoneNumber = (phone) => {
    if (!phone) return '-'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phone
  }

  // 데이터 필터링
  const filterNotifications = notifications.filter((noti) => {
    if (readStatus === 'read') return noti.isRead === 'Y'
    if (readStatus === 'unread') return noti.isRead === 'N'
    return true
  })

  const statusInfo = {
    purchased: {
      icon: 'fa-check-circle',
      label: '구매완료',
      class: 'status-purchased',
    },
    sold: {
      icon: 'fa-check-circle',
      label: '판매완료',
      class: 'status-sold',
    },
    approved: {
      icon: 'fa-check-circle',
      label: '승인완료',
      class: 'status-approved',
    },
    rejected: {
      icon: 'fa-circle-xmark',
      label: '승인거부',
      class: 'status-rejected',
    },
    reported: {
      icon: 'fa-triangle-exclamation',
      label: '판매중단',
      class: 'status-reported',
    },
    expired: {
      icon: 'fa-triangle-exclamation',
      label: '거래만료',
      class: 'status-expired',
    },
    reserved: {
      icon: 'fa-clock',
      label: '예약완료',
      class: 'status-reserved',
    },
  }
  // 상태별 들어가는 내용 구별
  const columnsByStatus = {
    purchased: [
      'sellerCompany',
      'productName',
      'purchasedQuantity',
      'productCodeName',
      'buyDate',
      'deliveryDate',
    ],
    sold: [
      'purchaseType',
      'productName',
      'soldQuantity',
      'buyDate',
      'buyerName',
      'buyerTel',
      'deliveryDate',
      'deliveryAddr',
    ],
    approved: ['sellerCompany', 'approvedDate', 'productUnitPrice', 'createdDate', 'productName'],
    rejected: ['sellerCompany', 'productUnitPrice', 'productName', 'createdDate', 'rejectedReason'],
    reported: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate'],
    expired: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate', 'expiredDate'],
    reserved: [
      'sellerCompany',
      'productName',
      'reservedQuantity',
      'productCodeName',
      'reservationDate',
      'deliveryDate',
    ],
  }

  //     console.log("🧪 전체 products:", products);
  //     console.log("🧪 전체 notifications:", notifications);
  useEffect(() => {
    // 알림 불러오기
    axios
      .get(`/api/mypage/notification`)
      .then((res) => {
        // console.log("알림 전체 데이터:", res.data);
        const notiList = res.data || []
        setNotifications(notiList)

        const productIds = notiList.map((n) => n.productId).filter(Boolean)

        //해당되는 productId만 조회
        if (productIds.length > 0) {
          axios
            .post('/api/products/by-ids', {
              productIds: productIds,
            })
            .then((res) => {
              setProducts(res.data)
            })
            .catch((err) => console.error('상품 오류:', err))
        }
      })
      .catch((err) => console.error('알림 오류:', err))

    // 판매완료일 경우 추가 정보
    axios
      .get(`/api/mypage/sold-notification`)
      .then((res) => setSoldExtraData(res.data))
      .catch((err) => console.error('sold 알림 오류:', err))
  }, [])
  // 페이지네이션
  const paginatedNotifications = filterNotifications.slice((page - 1) * pageSize, page * pageSize)
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }
  // 카드 내 이벤트 추가하는 함수
  const handleCardClick = (item) => {
    console.log('카드 클릭 이벤트 활성화', item)
    axios
      .put(`/api/mypage/notification/read/${item.alarmId}`)
      .then((response) => {
        console.log('읽음 처리 성공:', response.data)
        //     isRead 갱신
        setNotifications((prev) =>
          prev.map((noti) => (noti.alarmId === item.alarmId ? { ...noti, isRead: 'Y' } : noti))
        )
        // 헤더의 알림 개수 업데이트
        if (window.updateNotificationCount) {
          window.updateNotificationCount()
        }
        //     상태별 동작 분기
        switch (item.status) {
          case 'purchased':
          case 'sold':
          case 'approved':
          case 'reserved':
            navigate(`/product/${item.productId}`)
            break
          case 'rejected':
            setModalConfig({
              type: 'error',
              title: '오류 발생',
              content: `해당 상품은 승인거부되었습니다. 거부사유: ${
                item.alarmContent || '사유없음'
              }`,
              buttonLabel: '확인',
              showCancel: false,
              showOnMount: true,
            })
            break
          case 'reported':
            setModalConfig({
              type: 'error',
              title: '오류 발생',
              content: `해당 상품은 승인거부되었습니다. 거부사유: ${
                item.alarmContent || '사유없음'
              }`,
              buttonLabel: '확인',
              showCancel: false,
              showOnMount: true,
            })
            break
          case 'expired':
            setModalConfig({
              type: 'warning',
              title: '주의하세요!',
              content: '해당 상품은 판매기간이 만료되었습니다.',
              buttonLabel: '확인',
              buttonColor: 'warning',
              showCancel: false,
              showOnMount: true,
            })
            break

          default:
            alert('알 수 없는 알림입니다.')
        }
      })
      .catch((err) => {
        console.log('알림 읽음 처리 실패:', err)
      })
  }
  // 알림삭제버튼
  const handleDeleteAlarm = async (alarmId) => {
    const confirmDelete = window.confirm('정말 이 알림을 삭제하시겠습니까?')
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/mypage/notification/${alarmId}`)
      setNotifications((prev) => prev.filter((n) => n.alarmId !== alarmId))
      alert('알림이 삭제되었습니다.')
      // 헤더의 알림 개수 업데이트
      if (window.updateNotificationCount) {
        window.updateNotificationCount()
      }
    } catch (err) {
      console.error('알림 삭제 실패:', err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="card-list">
      {filterNotifications.length === 0 ? (
        <p>알림이 없습니다.</p>
      ) : (
        <>
          {paginatedNotifications.map((item, index) => {
            const current = statusInfo[item.status] || statusInfo['reported']
            console.log('status:', item.status, 'productId:', item.productId)
            return (
              <div
                className={`noti-card ${item.isRead === 'Y' ? 'read' : ''}`}
                key={index}
                onClick={() => handleCardClick(item)}
              >
                <div className="img-container">
                  <img
                    src={
                      item.imageName
                        ? `/static/images/thumbnail/${item.imageName}`
                        : '/static/images/thumbnail/carrot.png'
                    }
                    alt="product"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.src = '/static/images/thumbnail/no-image.png'
                        e.target.dataset.fallback = 'true' // 플래그 설정
                      }
                    }}
                  />
                  <div className={`product-img-overlay ${current.class}`}>
                    <i className={`fa-solid ${current.icon}`}></i>
                    {current.label}
                  </div>
                </div>
                <div className="noti-card-content">
                  {item.status === 'reported' && (
                    <div className="report-row">
                      <h3 className="reported-message">상품이 숨김처리 되었습니다.</h3>
                      <h3 className="reported-message">신고 사유: </h3>
                    </div>
                  )}

                  {/* 상태별 컬럼 렌더링 */}
                  {columnsByStatus[item.status]?.map((colKey, idx) => {
                    let value = ''

                    if (item.status === 'sold') {
                      // 구매 건을 구분하기 위해 buyId 또는 revId로 매칭
                      const extra = soldExtraData.find((e) => {
                        // buyId가 있으면 buyId로 매칭
                        if (item.buyId && e.buyId) {
                          return e.buyId === item.buyId
                        }
                        // revId가 있으면 revId로 매칭
                        if (item.revId && e.revId) {
                          return e.revId === item.revId
                        }
                        // fallback: productId로 매칭
                        return e.productId === item.productId
                      })
                      if (extra) {
                        if (colKey === 'deliveryAddr') {
                          value = `${extra.memberAddr || ''} ${extra.memberDetailAddr || ''}`
                        } else if (colKey === 'purchaseType') {
                          value = extra.purchaseType || '-'
                        } else if (colKey === 'buyDate') {
                          value = extra.buyDate || '-'
                        } else if (colKey === 'buyerTel') {
                          value = formatPhoneNumber(extra.buyerTel)
                        } else if (colKey === 'soldQuantity') {
                          if (item.buyQty && item.buyTotalPrice) {
                            value = `${item.buyQty}kg (${item.buyTotalPrice?.toLocaleString()}원)`
                          } else {
                            value = '-'
                          }
                        } else {
                          value = extra[colKey]
                        }
                      }
                    } else {
                      // console.log("🔍 현재 item.productId:", item.productId);
                      const product = products.find((p) => p.productId === item.productId)
                      // console.log("🔍 해당 product:", product);
                      if (product) {
                        if (colKey === 'approvedDate' || colKey === 'expiredDate') {
                          value = item.createdDate?.split(' ')[0]
                        } else if (colKey === 'rejectedReason') {
                          value = item.alarmContent
                        } else if (colKey === 'reservationDate') {
                          value = item.reservationDate?.split(' ')[0] || '-'
                        } else if (colKey === 'deliveryDate' && item.status === 'reserved') {
                          value = item.deliveryDate?.split(' ')[0] || '-'
                        } else if (colKey === 'productCodeName') {
                          value = product[colKey] || '-'
                        } else if (colKey === 'buyDate' && item.status === 'purchased') {
                          value = item.createdDate?.split(' ')[0] || '-'
                        } else if (colKey === 'deliveryDate' && item.status === 'purchased') {
                          value = item.deliveryDate?.split(' ')[0] || '-'
                        } else if (colKey === 'purchasedQuantity') {
                          if (item.buyQty && item.buyTotalPrice) {
                            value = `${item.buyQty}kg (${item.buyTotalPrice?.toLocaleString()}원)`
                          } else {
                            value = '-'
                          }
                        } else if (colKey === 'reservedQuantity') {
                          console.log('예약완료 데이터 확인:', item)
                          if (item.revQty && item.revTotalPrice) {
                            value = `${item.revQty}kg (${item.revTotalPrice?.toLocaleString()}원)`
                          } else if (item.buyQty && item.buyTotalPrice) {
                            value = `${item.buyQty}kg (${item.buyTotalPrice?.toLocaleString()}원)`
                          } else {
                            value = '-'
                          }
                        } else {
                          value = product[colKey]
                        }
                      }
                    }

                    if (!value) value = '-'

                    const labelMap = {
                      sellerCompany: '출하자',
                      deliveryDate: '출하예정일',
                      productName: '상품명',
                      createdDate: '등록일자',
                      buyerName: '구매자',
                      deliveryAddr: '배송지',
                      productUnitPrice: '단위 당 가격',
                      approvedDate: '승인날짜',
                      rejectedReason: '거부사유',
                      expiredDate: '만료일자',
                      reservationDate: '예약일자',
                      productCodeName: '카테고리',
                      buyDate: '판매일자',
                      purchaseType: '구매유형',
                      buyerTel: '구매자 연락처',
                      soldQuantity: '판매수량',
                      purchasedQuantity: '구매수량',
                      reservedQuantity: '예약수량',
                    }

                    // 거부사유 항목
                    if (colKey === 'rejectedReason') {
                      return (
                        <p className="rejected-reason" key={idx}>
                          <strong className="item-label reject">거부사유: </strong>
                          <span>{value}</span>
                        </p>
                      )
                    }

                    return (
                      <p key={idx} style={colKey === 'deliveryAddr' ? { minWidth: '200px' } : {}}>
                        <strong className="item-label">{labelMap[colKey]}</strong>
                        <span
                          className="item-value"
                          style={
                            colKey === 'purchaseType' ? { color: 'red', fontWeight: 'bold' } : {}
                          }
                        >
                          {value}
                        </span>
                      </p>
                    )
                  })}
                </div>

                <i
                  className="fa-solid fa-xmark"
                  id="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteAlarm(item.alarmId)
                  }}
                ></i>
              </div>
            )
          })}
          <div className="pagination-box">
            <CustomPagination
              defaultCurrent={page}
              total={filterNotifications.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
      {modalConfig && <CustomModal {...modalConfig} onOk={() => setModalConfig(null)} />}
    </div>
  )
}

export default Notification
