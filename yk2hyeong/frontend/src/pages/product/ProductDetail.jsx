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
  const [memberId, setMemberId] = useState(null)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
      // productId별로 그룹핑하여 images 배열로 묶기
      const groupByProductId = {}
      res.data.forEach((item) => {
        if (!groupByProductId[item.productId]) {
          // 상품 정보 복사, images 배열 추가
          groupByProductId[item.productId] = { ...item, images: [] }
        } else {
          // productCodeName 등 주요 정보가 없으면 새로 들어온 item에서 값 복사
          if (!groupByProductId[item.productId].productCodeName && item.productCodeName) {
            groupByProductId[item.productId].productCodeName = item.productCodeName
          }
          if (!groupByProductId[item.productId].sellerCompany && item.sellerCompany) {
            groupByProductId[item.productId].sellerCompany = item.sellerCompany
          }
          if (!groupByProductId[item.productId].sellerTel && item.sellerTel) {
            groupByProductId[item.productId].sellerTel = item.sellerTel
          }
          if (!groupByProductId[item.productId].sellerEmail && item.sellerEmail) {
            groupByProductId[item.productId].sellerEmail = item.sellerEmail
          }
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

    // 로그인 정보 및 즐겨찾기 목록
    axios
      .get('/auth/me')
      .then((res) => {
        setMemberId(res.data.memberId)
        return axios.get(`/api/favorites?memberId=${res.data.memberId}`)
      })
      .then((res) => {
        setFavoriteProductIds(res.data)
      })
      .catch((err) => {
        setFavoriteProductIds([])
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

  // 출하예정일 계산 함수
  function getReleaseDate(product, orderType) {
    if (orderType === 'reservation') {
      if (product.productRevEnd) {
        return dayjs(product.productRevEnd).add(1, 'day').format('YYYY-MM-DD') // 1일 뒤
      }
      return ''
    } else {
      const now = dayjs()
      const hour = now.hour()
      if (hour < 11) {
        return now.add(0, 'day').format('YYYY-MM-DD') // 당일
      } else {
        return now.add(1, 'day').format('YYYY-MM-DD') // 1일 뒤
      }
    }
  }

  // 현재 상품이 즐겨찾기인지 여부
  const isFavorite = favoriteProductIds.includes(productId)

  // 즐겨찾기 토글 함수
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

  return (
    <div>
      <CustomDetailCard
        productName={product.productName || '스테비아 방울토마토'}
        productCodeName={product.productCodeName || '쌀'}
        quantity={product.productStockQty || 1} // 남은수량(최대값)
        shippingRegion={product.sellerCompany || '(주)천안청과'}
        availableDate={product.productRevEnd || '2025-07-31'} // 판매종료일자
        price={product.productUnitPrice || 10500}
        releaseDate={getReleaseDate(product, orderType)} // 동적으로 계산
        minOrder={product.productMinQtr || 1} // 최소구매수량
        defaultQuantity={product.productMinQtr || 1}
        defaultOrderType={orderType}
        images={[thumbnailImage || '/static/images/thumbnail/product_thumb_smalltomato.png']}
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
        isFavorite={isFavorite}
        onFavoriteToggle={toggleFavorite}
        productId={productId}
        memberId={memberId}
        favoriteProductIds={favoriteProductIds}
        setFavoriteProductIds={setFavoriteProductIds}
      />

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
                children: <ProductNoticeTab product={product} memberId={memberId} />,
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
