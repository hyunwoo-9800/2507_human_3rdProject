import React, { useEffect, useState } from 'react'
import Textarea from '../../components/common/Textarea'
import CustomCard from '../../components/common/CustomCard'
import CustomDetailCard from '../../components/common/CustomDetailCard'
import CustomRadio from '../../components/common/CustomRadio'
import CustomInputNumber from '../../components/common/CustomInputNumber'
import CustomModal from '../../components/common/CustomModal'
import { Row, Col } from 'antd'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import '../product/ProductList.css'

export default function ProductRegisterDescription({
  text,
  setText,
  thumbnail,
  setThumbnail,
  detailImages,
  setDetailImages,
  onBack,
  // ProductRegisterInfo에서 전달받을 props들
  productName = '',
  sellerCompany = '', // 출하자명(회사명)
  productUnitPrice = 0,
  productMinQtr = 0,
  productSellType = '',
  // 추가 데이터
  saleQuantity = 0,
  startDate = '',
  endDate = '',
}) {
  const [orderType, setOrderType] = useState('immediate')
  const [orderQuantity, setOrderQuantity] = useState(productMinQtr)
  const cropSize = 270 // 크롭 크기

  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [detailPreviews, setDetailPreviews] = useState([])

  // 드래그&드롭 순서 변경용 상태
  const [draggedIdx, setDraggedIdx] = useState(null)

  // textarea 내용 변경 핸들러
  const handleTextareaChange = (e) => setText(e.target.value)

  // 썸네일 이미지 선택 핸들러 (리사이징 + 중앙 크롭)
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (!file) return // 파일이 없으면 처리 중단

    // 원본 이미지 파일을 미리보기 및 크롭용으로 사용하기 위해 URL 객체 생성
    const url = URL.createObjectURL(file)
    const img = new Image()

    // 이미지가 로드되었을 때 실행
    img.onload = () => {
      // 크롭할 캔버스 생성 (270x270)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = cropSize
      canvas.height = cropSize

      // 원본 이미지에서 가장 짧은 변 기준으로 cropSize에 맞게 스케일 계산
      const scale = cropSize / Math.min(img.width, img.height)

      // 스케일을 적용한 리사이즈 크기 계산
      const resizedWidth = img.width * scale
      const resizedHeight = img.height * scale

      // 먼저 이미지 전체를 리사이즈 할 임시 캔버스 생성
      const resizeCanvas = document.createElement('canvas')
      resizeCanvas.width = resizedWidth
      resizeCanvas.height = resizedHeight
      const resizeCtx = resizeCanvas.getContext('2d')

      // 원본 이미지를 리사이즈 캔버스에 그림
      resizeCtx.drawImage(img, 0, 0, resizedWidth, resizedHeight)

      // 리사이즈된 이미지에서 중앙 270x270 영역을 자르기 위한 좌표 계산
      const sx = (resizedWidth - cropSize) / 2
      const sy = (resizedHeight - cropSize) / 2

      // 최종 캔버스에 리사이즈 캔버스에서 중앙 부분만 잘라 그리기 (크롭)
      ctx.drawImage(resizeCanvas, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize)

      // 캔버스를 Blob으로 변환 (이미지 데이터 생성)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 기존 미리보기 URL이 있으면 해제 (메모리 누수 방지)
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)

            // Blob을 다시 URL로 만들어 미리보기 이미지로 사용
            const previewUrl = URL.createObjectURL(blob)
            setThumbnailPreview(previewUrl)

            // Blob을 File 객체로 변환해서 상태에 저장 (서버 전송용)
            // 원본 파일명이 유지되며, 타입도 원본 타입으로 설정
            const croppedFile = new File([blob], file.name, { type: file.type })
            setThumbnail(croppedFile)
          } else {
            alert('이미지를 처리하는 데 실패했습니다.')
          }

          // 원본 이미지 URL 해제 (메모리 누수 방지)
          URL.revokeObjectURL(url)
        },
        file.type || 'image/jpeg', // 이미지 MIME 타입 지정 (원본 파일 타입 또는 기본 jpeg)
        1 // 이미지 품질 (1 = 최고 품질)
      )
    }

    // 이미지 로드 실패 시 실행
    img.onerror = () => {
      alert('이미지 로드에 실패했습니다.')
      URL.revokeObjectURL(url) // URL 해제
    }

    // 이미지 src 설정 (로드 시작)
    img.src = url
  }

  // 상세 이미지 리사이징 함수
  const resizeDetailImage = (file, maxWidth = 890) => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, { type: file.type })
              resolve(resizedFile)
            }
            URL.revokeObjectURL(url)
          },
          file.type,
          0.9
        )
      }
      img.src = url
    })
  }

  // 상세 이미지 선택 핸들러
  const handleDetailImagesChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 3) {
      alert('최대 3장까지 첨부할 수 있습니다.')
      return
    }
    const resizedFiles = await Promise.all(files.map((file) => resizeDetailImage(file, 890)))
    setDetailImages(resizedFiles)
  }

  // 상세 이미지 미리보기 URL 생성 및 해제
  useEffect(() => {
    if (detailPreviews.length) {
      detailPreviews.forEach((url) => URL.revokeObjectURL(url))
    }
    if (detailImages.length === 0) {
      setDetailPreviews([])
      return
    }
    const objectUrls = detailImages.map((file) => URL.createObjectURL(file))
    setDetailPreviews(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [detailImages])

  // 디버깅용
  useEffect(() => {
    console.log('thumbnailPreview:', thumbnailPreview)
  }, [thumbnailPreview])

  useEffect(() => {
    if (radioOptions.length === 1) {
      setOrderType(radioOptions[0].value)
    }
  }, [productSellType])

  // 썸네일 파일이 바뀌면 미리보기 URL을 다시 생성 (탭 전환 시에도 유지)
  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail)
      setThumbnailPreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setThumbnailPreview(null)
    }
  }, [thumbnail])

  // 상세 이미지 순서 변경 함수
  const handleDragStart = (idx) => setDraggedIdx(idx)
  const handleDragOver = (e) => e.preventDefault()
  const handleDrop = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return
    // detailImages, detailPreviews 모두 순서 변경
    const newImages = [...detailImages]
    const newPreviews = [...detailPreviews]
    const [img] = newImages.splice(draggedIdx, 1)
    const [prev] = newPreviews.splice(draggedIdx, 1)
    newImages.splice(idx, 0, img)
    newPreviews.splice(idx, 0, prev)
    setDetailImages(newImages)
    setDetailPreviews(newPreviews)
    setDraggedIdx(null)
  }

  const RequiredLabel = ({ children }) => (
    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 20 }}>
      {children} <span style={{ color: 'red' }}>*</span>
    </label>
  )

  const Label = ({ children }) => (
    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 20 }}>
      {children}
    </label>
  )

  // 거래유형에 따라 라디오 옵션 동적 생성
  let radioOptions = []
  if (productSellType === '즉시/예약') {
    radioOptions = [
      { label: '즉시 구매', value: 'immediate' },
      { label: '예약 구매', value: 'reservation' },
    ]
  } else if (productSellType === '즉시 구매 상품') {
    radioOptions = [{ label: '즉시 구매', value: 'immediate' }]
  } else if (productSellType === '예약 상품') {
    radioOptions = [{ label: '예약 구매', value: 'reservation' }]
  }

  return (
    <div>
      <h2>3. 상품 소개</h2>

      {/* 상품 소개 텍스트 영역 */}
      <div style={{ marginTop: 20 }}>
        <Label>상품소개를 적어주세요. (선택)</Label>
        <div style={{ marginLeft: 13 }}>
          <Textarea
            value={text}
            onChange={handleTextareaChange}
            placeholder="상품에 대한 간단한 설명을 입력해주세요."
            style={{ width: '100%', height: 300, resize: 'vertical' }}
          />
        </div>
      </div>

      {/* 썸네일 이미지 첨부 */}
      <div style={{ marginTop: 20 }}>
        <RequiredLabel>썸네일 사진 첨부 (1장)</RequiredLabel>
        <p style={{ color: 'red' }}>
          !! 썸네일 사진은 업로드한 사진의 중앙이 크롭되어 등록됩니다 !!<br/>
          권장 최소 이미지 사이즈: 600 x 600
        </p>
        <div style={{ marginLeft: 13 }}>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
        </div>
      </div>

      {/* 상품 카드 미리보기 */}
      {thumbnailPreview && (
        <div style={{ marginTop: 30 }}>
          <Label>상품 카드 미리보기</Label>
          <div style={{ marginLeft: 13 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <CustomCard
                  id="preview"
                  image={thumbnailPreview}
                  company={sellerCompany}
                  productName={productName}
                  price={productUnitPrice}
                  minQuantity={productMinQtr}
                  immediatePurchase={productSellType === '즉시 구매 상품'}
                  reservationPurchase={productSellType === '예약 상품'}
                  style={{
                    width: '280px',
                    height: '420px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* ===== 카드 상단: 회사명 + 상품명 영역 ===== */}
                  <div style={{ minHeight: 68, maxHeight: 68, marginBottom: 8 }}>
                    {/* 회사명 (한 줄) */}
                    {sellerCompany && (
                      <div
                        style={{
                          fontSize: 14,
                          color: '#888',
                          marginBottom: 2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {sellerCompany}
                      </div>
                    )}
                    {/* 상품명 (2줄 고정, 넘치면 ... 처리) */}
                    <div className="product-name-fixed">{productName}</div>
                  </div>
                  {/* ===== 카드 중단: 가격/라벨 영역 ===== */}
                  {/* (이 영역은 CustomCard 내부에서 이미 처리됨) */}
                  {/* ===== 카드 하단: 최소구매수량 영역 ===== */}
                  {/* (이 영역도 CustomCard 내부에서 이미 처리됨) */}
                </CustomCard>
              </Col>
            </Row>
          </div>
        </div>
      )}

      {/* 상세 이미지 첨부 */}
      <div style={{ marginTop: 50 }}>
        <RequiredLabel>제품 상세 사진 첨부 (1~3장)</RequiredLabel>
        <p style={{ color: 'red' }}>
          !! 미리보기에 보이는 순서대로 상품 상세 페이지에 표시됩니다 !!<br/>
          권장 최소 이미지 사이즈: 가로 1125
        </p>
        <div style={{ marginLeft: 13 }}>
          <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} />
        </div>
      </div>

      {/* 상품 상세 페이지 미리보기 */}
      {(thumbnailPreview || detailPreviews.length > 0) && (
        <div style={{ marginTop: 70 }}>
          <Label>상품 상세 페이지 미리보기</Label>
          <div style={{ marginLeft: 13 }}>
            <div
              style={{
                width: '100%',
                maxWidth: '890px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  transform: 'scale(0.65)',
                  transformOrigin: 'top left',
                  width: '153.85%', // scale(0.65)의 역수
                  marginBottom: '-20%',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {/* 썸네일 CustomDetailCard */}
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
                  {/* 이미지 영역 - ProductDetail과 동일한 비율 */}
                  <div style={{ width: '600px', marginRight: 20 }}>
                    <img
                      src={thumbnailPreview}
                      alt="상품 이미지"
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        border: '1px solid black',
                        height: '510px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* 상품정보 영역 - ProductDetail과 동일한 비율 */}
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
                                신고 내용은 검토 후 처리됩니다. 신고하신 내용이 확인되면 해당 상품이
                                조치될 수 있습니다.
                              </p>
                            </div>
                          }
                          buttonLabel="신고하기"
                          buttonColor="warning"
                          buttonSize="sm"
                          successMessage="신고가 접수되었습니다. 검토 후 처리하겠습니다."
                          onOk={() => {
                            console.log('상품 신고 처리:', '미정')
                          }}
                        />
                        <div
                          style={{
                            fontSize: 28,
                            cursor: 'pointer',
                          }}
                        >
                          <StarOutlined style={{ color: '#aaa' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>상품번호:</span>
                        <span>미정</span>
                      </div>
                    </div>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>출하자:</span>
                        <span>{sellerCompany}</span>
                      </div>
                    </div>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>남은수량:</span>
                        <span>{saleQuantity.toLocaleString()}개</span>
                      </div>
                    </div>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>판매종료일자:</span>
                        <span>{endDate}</span>
                      </div>
                    </div>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>단가:</span>
                        <span>{productUnitPrice.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div style={{ color: 'red', fontWeight: 'bold', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>출하예정일:</span>
                        <span>{startDate}</span>
                      </div>
                    </div>
                    <hr style={{ margin: '20px 0', width: '100%' }} />

                    {/* 구매 옵션 라디오버튼 */}
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <CustomRadio
                        value={orderType}
                        onChange={(value) => setOrderType(value)}
                        options={radioOptions}
                        name="orderType"
                      />
                    </div>

                    {/* 수량 및 주문 영역 */}
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
                        <div>수량 (최소구매수량 {productMinQtr}개)</div>
                        <div>
                          <CustomInputNumber
                            defaultValue={productMinQtr}
                            min={productMinQtr}
                            max={saleQuantity}
                            step={1}
                            value={orderQuantity}
                            onChange={(value) => setOrderQuantity(value)}
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
                          <span>예약금액 (30%)</span>
                          <span>
                            {Math.floor(productUnitPrice * orderQuantity * 0.3).toLocaleString()}원
                          </span>
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
                          <span>{(productUnitPrice * orderQuantity).toLocaleString()}원</span>
                        </div>
                      </div>

                      <button
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
                        구매하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p>상품 설명</p>
              {/* 상품설명 미리보기 */}
              {text && (
                <div style={{ margin: '32px 0', fontSize: 18, whiteSpace: 'pre-line' }}>{text}</div>
              )}

              <p style={{ color: 'red' }}>!! 상세이미지는 드래그하여 순서를 바꿀 수 있습니다 !!</p>
              {/* 상세이미지 세로 미리보기 */}
              {detailPreviews.length > 0 && (
                <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detailPreviews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`상세사진 미리보기 ${idx + 1}`}
                      style={{
                        width: 890,
                        borderRadius: 4,
                        cursor: 'grab',
                        opacity: draggedIdx === idx ? 0.5 : 1,
                      }}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 이전 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 30 }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#888',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          이전
        </button>
      </div>
    </div>
  )
}
