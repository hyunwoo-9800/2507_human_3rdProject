import React, { useState, useEffect } from 'react'
import ProductRegisterInfo from './ProductRegisterInfo'
import ProductRegisterGuide from './ProductRegisterGuide'
import ProductRegisterDescription from './ProductRegisterDescription'
import CustomAlert from '../../components/common/CustomAlert'
import ProductSidebarMenu from './ProductSidebarMenu'
import dayjs from 'dayjs'

export default function ProductRegister() {
  const [activeItem, setActiveItem] = useState('1') // 현재 활성 탭 키
  const [guideConfirmed, setGuideConfirmed] = useState(false) // 안내사항 체크 여부
  const [showWarning, setShowWarning] = useState(false) // 경고창 표시 여부
  const [userInfo, setUserInfo] = useState(null) // 사용자 정보 상태

  // 로그인 사용자 정보 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/auth/me', {
      credentials: 'include', // 쿠키 기반 인증 시 필요
    })
      .then((res) => {
        if (!res.ok) throw new Error('인증 정보 불러오기 실패')
        return res.json()
      })
      .then((data) => {
        setUserInfo(data)
      })
      .catch((err) => {
        console.error('유저 정보 불러오기 실패:', err)
      })
  }, [])

  // 안내사항 체크박스 상태
  const [guideChecked, setGuideChecked] = useState(false)

  // 기본정보 상태
  const [productForm, setProductForm] = useState({
    productName: '',
    startDate: null,
    endDate: null,
    productPrice: '',
    detailCodeId: null,
    orderType: 'immediate/reservation',
    saleQuantity: 100,
    minSaleUnit: 10,
    selectedCategory: null,
    selectedSubCategory: null,
    categoryData: {}, // 이 항목은 제출 시 제외될 것
    showDateWarning: false,
  })

  // 상품소개 상태
  const [descriptionText, setDescriptionText] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [detailImages, setDetailImages] = useState([])

  // 기본정보 유효성 검사
  const isBasicInfoValid = (form) => {
    return (
      form.productName?.trim() !== '' &&
      form.productPrice?.trim() !== '' &&
      form.startDate !== null &&
      form.endDate !== null &&
      form.detailCodeId !== null &&
      form.saleQuantity > 0 &&
      form.minSaleUnit > 0 &&
      !form.showDateWarning
    )
  }

  // 상품소개 유효성 검사
  const isDescriptionValid = () => {
    return thumbnail !== null && detailImages.length > 0
  }

  // 완료된 항목 라벨에 체크 표시
  const getLabelWithStatus = (label, isComplete) => {
    return isComplete ? `${label} ✅` : label
  }

  // 사이드바 메뉴 항목
  const menuItems = [
    {
      key: 'sub1',
      label: '상품 등록하기',
      children: [
        { key: '1', label: getLabelWithStatus('1. 안내사항', guideConfirmed) },
        { key: '2', label: getLabelWithStatus('2. 기본정보', isBasicInfoValid(productForm)) },
        { key: '3', label: getLabelWithStatus('3. 상품소개', isDescriptionValid()) },
      ],
    },
  ]

  // 안내사항 체크 시 경고창 자동 숨김
  useEffect(() => {
    if (guideConfirmed) {
      setShowWarning(false)
    }
  }, [guideConfirmed])

  // 사이드바 탭 클릭 핸들러
  const handleMenuSelect = (info) => {
    setShowWarning(false) // 경고 초기화

    if (info.key === '1') {
      setActiveItem('1')
      return
    }

    if (!guideConfirmed) {
      setShowWarning(true) // 안내사항 체크 안 되어 있으면 경고
      return
    }

    setActiveItem(info.key) // 정상 이동
  }

  // 최종 제출 핸들러
  const handleFinalSubmit = async () => {
    if (!userInfo) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!isBasicInfoValid(productForm)) {
      alert('기본 정보를 모두 입력해주세요.')
      return
    }

    if (!isDescriptionValid()) {
      alert('상세 설명을 입력해주세요.')
      return
    }

    if (!window.confirm('상품을 등록하시겠습니까?')) return

    console.log('thumbnail is File?', thumbnail instanceof File)
    console.log(
      'all detailImages are File?',
      detailImages.every((img) => img instanceof File)
    )

    try {
      const { categoryData, ...cleanedForm } = productForm
      const formData = new FormData()

      // 텍스트 데이터
      formData.append('productName', cleanedForm.productName)
      formData.append('startDate', dayjs(cleanedForm.startDate).format('YYYY-MM-DD'))
      formData.append('endDate', dayjs(cleanedForm.endDate).format('YYYY-MM-DD'))
      formData.append('productPrice', String(cleanedForm.productPrice))
      formData.append('detailCodeId', cleanedForm.detailCodeId)
      formData.append('orderType', cleanedForm.orderType)
      formData.append('saleQuantity', String(cleanedForm.saleQuantity))
      formData.append('minSaleUnit', String(cleanedForm.minSaleUnit))
      // formData.append("selectedCategory", cleanedForm.selectedCategory);
      // formData.append("selectedSubCategory", cleanedForm.selectedSubCategory);
      formData.append('descriptionText', descriptionText)

      // 사용자 정보
      formData.append('memberId', userInfo.memberId)
      // formData.append("memberEmail", userInfo.memberEmail);
      // formData.append("memberName", userInfo.memberName);
      formData.append('memberBname', userInfo.memberBname)
      // formData.append("memberBnum", userInfo.memberBnum);

      // 썸네일
      formData.append('thumbnail', thumbnail)

      // 상세 이미지들
      detailImages.forEach((img, index) => {
        formData.append('detailImages', img) // 백엔드에서 MultipartFile[]로 받을 경우 이렇게 한 이름으로 반복
      })

      for (const [key, value] of formData.entries()) {
        console.log(key, value, value instanceof File)
      }

      // 전송
      const response = await fetch('http://localhost:8080/api/products/register', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 세션 유지용
      })

      if (!response.ok) {
        throw new Error('상품 등록 실패')
      }

      const text = await response.text()
      console.log('🎉 상품 등록 성공 메시지:', text)
      alert(text)
      // 필요 시 리디렉션 or 초기화
      window.location.href = '/mypage'
    } catch (err) {
      console.error('🔥 에러:', err)
      alert('상품 등록 중 오류가 발생했습니다.')
    }
  }

  // 현재 탭에 따라 콘텐츠 렌더링
  const renderContent = () => {
    switch (activeItem) {
      case '1':
        return (
          <ProductRegisterGuide
            checked={guideChecked}
            onChangeChecked={setGuideChecked}
            onNext={() => {
              setGuideConfirmed(true)
              setActiveItem('2')
            }}
          />
        )
      case '2':
        return (
          <ProductRegisterInfo
            form={productForm}
            setForm={setProductForm}
            onNext={() => setActiveItem('3')}
            onBack={() => setActiveItem('1')}
          />
        )
      case '3':
        return (
          <>
            <ProductRegisterDescription
              text={descriptionText}
              setText={setDescriptionText}
              thumbnail={thumbnail}
              setThumbnail={setThumbnail}
              detailImages={detailImages}
              setDetailImages={setDetailImages}
              onBack={() => setActiveItem('2')}
              productName={productForm.productName}
              sellerCompany={userInfo?.memberBname || ''} // 출하자명(회사명)
              productUnitPrice={parseInt(productForm.productPrice) || 0}
              productMinQtr={productForm.minSaleUnit || 0}
              productSellType={
                productForm.orderType === 'immediate/reservation'
                  ? '즉시/예약'
                  : productForm.orderType === 'immediate'
                  ? '즉시 구매 상품'
                  : '예약 상품'
              }
              saleQuantity={productForm.saleQuantity || 0}
              startDate={productForm.startDate || ''}
              endDate={productForm.endDate || ''}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
              <button
                onClick={handleFinalSubmit}
                disabled={!userInfo}
                style={{
                  padding: '10px 20px',
                  backgroundColor: userInfo ? '#00a43c' : 'gray',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: userInfo ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                최종 등록하기
              </button>
            </div>
          </>
        )
      default:
        return <div>선택된 콘텐츠가 없습니다.</div>
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 256, marginTop: 5 }}>
        <ProductSidebarMenu
          items={menuItems}
          selectedKeys={[activeItem]}
          defaultOpenKeys={['sub1']}
          onSelectItem={handleMenuSelect}
        />
      </div>
      <div style={{ flex: 1, padding: 20 }}>
        {/* 경고창 */}
        {showWarning && (
          <CustomAlert
            type="warning"
            message="주의!"
            description="안내사항 확인 여부를 체크해주세요."
            style={{ marginBottom: 20 }}
          />
        )}
        {renderContent()}
      </div>
    </div>
  )
}
