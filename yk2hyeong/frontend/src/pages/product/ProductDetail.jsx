import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CustomDetailCard from '../../components/common/CustomDetailCard'
import CustomTabs from '../../components/common/CustomTabs'

export default function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    axios
      .get(`/api/products`) // 또는 `/api/products/${productId}` 라우터 있으면 단건 조회
      .then((res) => {
        const found = res.data.find((p) => p.productId === productId)
        setProduct(found)
      })
  }, [productId])

  if (!product) return <div>Loading...</div>

  return (
    <div>
      <CustomDetailCard
        productName="스테비아 방울토마토"
        productCode="P250703-000121"
        quantity={239994}
        shippingRegion="전체"
        availableDate="판매자 문의"
        price={10500}
        releaseDate="2026년 7월 4일"
        minOrder={100}
        defaultQuantity={100}
        defaultOrderType="immediate"
        images={[
          '/static/images/tomato.png',
          '/static/images/potato.png',
          '/static/images/carrot.png',
        ]}
        orderOptions={{
          immediate: true,
          reservation: true,
          reserveRate: 30,
        }}
        onQuantityChange={(q) => console.log('변경된 수량:', q)}
        onOrderTypeChange={(t) => console.log('선택된 타입:', t)}
        onOrder={(info) => console.log('주문 정보:', info)}
      />
      {/* CustomTabs 관련 오류 수정: tabItems와 handleTabChange 정의 */}
      <CustomTabs
        items={[
          { key: 'detail', label: '상품소개', children: <div>상세 정보 탭 내용</div> },
          { key: 'price', label: '시세추이', children: <div>시세추이 탭 내용</div> },
          { key: 'notice', label: '상품공지', children: <div>상품공지 탭 내용</div> },
          { key: 'delivery', label: '배송/반품정보', children: <div>배송/반품정보 탭 내용</div> },
        ]}
        type="card"
        onChange={(key) => {
          console.log('선택된 탭:', key)
        }}
      />
      <h1>{product.productName}</h1>
      <img src={`/static${product.imagePath}/${product.imageName}`} alt={product.productName} />
      <p>판매처: {product.sellerCompany}</p>
      <p>가격: {product.productUnitPrice}원</p>
      <p>최소 주문 수량: {product.productMinQtr}</p>
    </div>
  )
}
