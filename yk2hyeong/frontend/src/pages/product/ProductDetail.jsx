import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CustomDetailCard from '../../components/common/CustomDetailCard'
import CustomTabs from '../../components/common/CustomTabs'
import ProductDetailTab from '../../components/product/ProductDetailTab'
import PriceChartTab from '../../components/product/PriceChartTab'
import ProductNoticeTab from '../../components/product/ProductNoticeTab'
import DeliveryInfoTab from '../../components/product/DeliveryInfoTab'
import './productDetail.css'
import '../../components/product/productTabs.css'
import dayjs from 'dayjs'

export default function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [orderType, setOrderType] = useState('immediate') // 즉시구매 기본값

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
      // productId별로 그룹핑하여 images 배열로 묶기
      const groupByProductId = {}
      res.data.forEach((item) => {
        if (!groupByProductId[item.productId]) {
          // 상품 정보 복사, images 배열 추가
          groupByProductId[item.productId] = { ...item, images: [] }
        }
        // 이미지 정보만 추출해서 배열에 push
        groupByProductId[item.productId].images.push({
          imageId: item.imageId,
          imagePath: item.imagePath,
          imageName: item.imageName,
          imageType: item.imageType,
        })
      })
      // 원하는 상품 찾기
      const found = groupByProductId[productId]
      setProduct(found)
      console.log('product:', found)
    })
  }, [productId])

  if (!product) return <div>Loading...</div>

  // imageType이 '400'인 썸네일 이미지 추출
  let thumbnailImage = null
  if (Array.isArray(product.images)) {
    const thumb = product.images.find((img) => img.imageType === '400')
    if (thumb) {
      thumbnailImage = `/static/${thumb.imagePath}/${thumb.imageName}`
    }
  }

  //   // 상세이미지(300) - 001_300, 002_300, 003_300 순서대로
  //   let detailImages = []
  //   if (Array.isArray(product.images)) {
  //     detailImages = product.images
  //       .filter((img) => img.imageType === '300')
  //       .sort((a, b) => {
  //         // 파일명에서 001_300, 002_300, 003_300 숫자 추출하여 정렬
  //         const getNum = (name) => {
  //           const match = name.match(/_(\d{3})_300/)
  //           return match ? parseInt(match[1], 10) : 0
  //         }
  //         return getNum(a.imageName) - getNum(b.imageName)
  //       })
  //       .map((img) => `/static/${img.imagePath}/${img.imageName}`)
  //   }

  // 출하예정일 계산 함수
  function getReleaseDate(product, orderType) {
    if (orderType === 'reservation') {
      if (product.productRevEnd) {
        return dayjs(product.productRevEnd).add(2, 'day').format('YYYY-MM-DD')
      }
      return ''
    } else {
      const now = dayjs()
      const hour = now.hour()
      if (hour < 11) {
        return now.add(1, 'day').format('YYYY-MM-DD')
      } else {
        return now.add(2, 'day').format('YYYY-MM-DD')
      }
    }
  }

  return (
    <div>
      <CustomDetailCard
        productName={product.productName || '스테비아 방울토마토'}
        productCode={product.productCode || 'P250703-000121'}
        quantity={product.productStockQty || 1} // 남은수량(최대값)
        shippingRegion={product.sellerCompany || '(주)천안청과'}
        availableDate={product.productRevEnd || '판매자 문의'} // 판매종료일자
        price={product.productUnitPrice || 10500}
        releaseDate={getReleaseDate(product, orderType)} // 동적으로 계산
        minOrder={product.productMinQtr || 1} // 최소구매수량
        defaultQuantity={product.productMinQtr || 1}
        defaultOrderType={orderType}
        images={[thumbnailImage || '/static/images/tomato.png']}
        imageStyle={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: 8,
          border: '1px solid #ddd',
        }}
        orderOptions={{
          immediate: true,
          reservation: true,
          reserveRate: 30,
        }}
        onQuantityChange={(q) => console.log('변경된 수량:', q)}
        onOrderTypeChange={(t) => setOrderType(t)}
        onOrder={(info) => console.log('주문 정보:', info)}
      />

      {/* 상세이미지 영역
      <div style={{ margin: '24px 0' }}>
        <h3>상세 이미지</h3>
        {detailImages.length > 0 ? (
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {detailImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`상세 이미지 ${idx + 1}`}
                style={{ maxWidth: 300, borderRadius: 8, border: '1px solid #eee' }}
              />
            ))}
          </div>
        ) : (
          <div style={{ color: '#888', fontSize: 16, padding: '16px 0' }}>
            상세 이미지가 없습니다
          </div>
        )}
      </div> */}

      {/* CustomTabs - 위쪽 마진과 가운데 정렬 */}
      <div
        style={{
          marginTop: 40, // 위쪽 마진
          display: 'flex',
          justifyContent: 'center', // 가운데 정렬
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%', // 탭 컨테이너 너비
          }}
        >
          <CustomTabs
            items={[
              {
                key: 'detail',
                label: '상품소개',
                children: <ProductDetailTab product={product} />,
              },
              { key: 'price', label: '시세추이', children: <PriceChartTab product={product} /> },
              {
                key: 'notice',
                label: '상품공지',
                children: <ProductNoticeTab product={product} />,
              },
              {
                key: 'delivery',
                label: '배송/반품정보',
                children: <DeliveryInfoTab product={product} />,
              },
            ]}
            type="card"
            onChange={(key) => {
              console.log('선택된 탭:', key)
            }}
          />
        </div>
      </div>
    </div>
  )
}
