import React, { useEffect, useState } from 'react'
import Textarea from '../../components/common/Textarea'
import CustomCard from '../../components/common/CustomCard'
import { Row, Col } from 'antd'
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
}) {
  const cropSize = 270 // 크롭 크기

  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [detailPreviews, setDetailPreviews] = useState([])

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
  const resizeDetailImage = (file, maxWidth = 600) => {
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
    const resizedFiles = await Promise.all(files.map((file) => resizeDetailImage(file, 600)))
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

  // 판매 유형에 따른 라벨 계산
  const getSellTypeLabels = () => {
    const immediatePurchase = ['즉시 구매 상품', '즉시/예약'].includes(productSellType)
    const reservationPurchase = ['예약 상품', '즉시/예약'].includes(productSellType)
    return { immediatePurchase, reservationPurchase }
  }

  const { immediatePurchase, reservationPurchase } = getSellTypeLabels()

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
          !! 썸네일 사진은 업로드한 사진의 중앙이 크롭되어 등록됩니다 !!
        </p>
        <div style={{ marginLeft: 13 }}>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} />
        </div>
      </div>

      {/* 카드 미리보기 */}
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
                  immediatePurchase={immediatePurchase}
                  reservationPurchase={reservationPurchase}
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
        <p style={{ color: 'red' }}>!! 첨부한 순서대로 상품 상세 페이지에 표시됩니다 !!</p>
        <div style={{ marginLeft: 13 }}>
          <input type="file" accept="image/*" multiple onChange={handleDetailImagesChange} />
          {detailPreviews.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
              {detailPreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`상세사진 미리보기 ${idx + 1}`}
                  style={{ width: 150, height: 'auto', borderRadius: 4 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
