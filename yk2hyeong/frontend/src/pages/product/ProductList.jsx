import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CustomTabs from '../../components/common/CustomTabs'
import CustomCard from '../../components/common/CustomCard'
import { Row, Col, Empty, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('all')
  const [memberId, setMemberId] = useState(null)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])

  // 상품 카테고리 탭 정의
  const productTypes = [
    { label: '전체', key: 'all' },
    { label: '식량작물', key: '식량작물' },
    { label: '채소류', key: '채소류' },
    { label: '과일류', key: '과일류' },
    { label: '특용작물', key: '특용작물' },
  ]

  // 전체 상품 데이터 불러오기
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/products')
      const filtered = response.data.filter((p) => p.imageType !== '003')
      const seen = new Map()
      filtered.forEach((p) => {
        if (!seen.has(p.productId)) {
          seen.set(p.productId, p)
        }
      })
      setProducts(Array.from(seen.values()))
    } catch (error) {
      console.error('상품 목록 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 로그인된 사용자 정보 조회
  const fetchMe = async () => {
    try {
      const res = await axios.get('/auth/me')
      setMemberId(res.data.memberId)
      return res.data.memberId
    } catch (error) {
      console.error('로그인 정보 불러오기 실패:', error)
      return null
    }
  }

  // 즐겨찾기 목록 불러오기
  const fetchFavorites = async (id) => {
    try {
      const res = await axios.get(`/api/favorites?memberId=${id}`)
      setFavoriteProductIds(res.data)
      console.log('✅ [웹 콘솔] 즐겨찾기 목록 불러오기 성공:', res.data)
    } catch (error) {
      console.error('❌ 즐겨찾기 목록 불러오기 실패:', error)
    }
  }

  const navigate = useNavigate()

  // 컴포넌트 최초 마운트 시 데이터 로딩
  useEffect(() => {
    fetchProducts()
    fetchMe().then((id) => {
      if (id) fetchFavorites(id)
    })
  }, [])

  // 즐겨찾기 토글 (등록 또는 삭제)
  const toggleFavorite = async (productId) => {
    if (!memberId) {
      alert('로그인이 필요합니다.')
      return
    }

    const isFav = favoriteProductIds.includes(productId)

    try {
      if (!isFav) {
        // 즐겨찾기 등록
        await axios.post('/api/favorites', { memberId, productId })
        const newFavs = [...favoriteProductIds, productId]
        setFavoriteProductIds(newFavs)
        console.log(`✅ [즐겨찾기 등록 완료] productId: ${productId}`)
        console.log('📌 현재 즐겨찾기 목록:', newFavs)
      } else {
        // 즐겨찾기 삭제
        await axios.delete('/api/favorites', { data: { memberId, productId } })
        const newFavs = favoriteProductIds.filter((id) => id !== productId)
        setFavoriteProductIds(newFavs)
        console.log(`🗑️ [즐겨찾기 삭제 완료] productId: ${productId}`)
        console.log('📌 현재 즐겨찾기 목록:', newFavs)
      }
    } catch (error) {
      console.error('❌ 즐겨찾기 토글 실패:', error)
      alert('즐겨찾기 중 문제가 발생했습니다.')
    }
  }

  // 탭 변경 핸들러
  const handleTabChange = (key) => setActiveKey(key)

  // 각 탭에 해당하는 상품 렌더링 정의
  const tabItems = productTypes.map((type) => {
    const filteredProducts =
      type.key === 'all'
        ? products.filter((p) => p.productDisplayType === '표시')
        : products.filter((p) => p.productDisplayType === '표시' && p.productCat === type.key)

    return {
      label: type.label,
      key: type.key,
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Col key={product.productId} xs={24} sm={12} md={6} lg={6}>
                <CustomCard
                  id={product.productId}
                  image={
                    product.imagePath && product.imageName
                      ? `/static/${product.imagePath}/thumbnail/${product.imageName}`
                      : '/static/images/no-image.png'
                  }
                  company={product.sellerCompany}
                  productName={product.productName}
                  price={product.productUnitPrice}
                  minQuantity={product.productMinQtr}
                  immediatePurchase={['즉시 구매 상품', '즉시/예약'].includes(
                    product.productSellType
                  )}
                  reservationPurchase={['예약 상품', '즉시/예약'].includes(product.productSellType)}
                  isFavorite={favoriteProductIds.includes(product.productId)}
                  onFavoriteToggle={() => toggleFavorite(product.productId)}
                  onClick={() => navigate(`/product/${product.productId}`)}
                  style={{ width: '280px' }}
                />
              </Col>
            ))
          ) : (
            <Col span={24}>
              <Empty description="상품이 없습니다." />
            </Col>
          )}
        </Row>
      ),
    }
  })

  return (
    <div>
      <h2>온라인 상품 목록</h2>
      <CustomTabs items={tabItems} type="card" onChange={handleTabChange} />
    </div>
  )
}
