import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CustomTabs from '../../components/common/CustomTabs'
import CustomCard from '../../components/common/CustomCard'
import { Row, Col, Empty, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import './ProductList.css'
import CustomLoading from '../../components/common/CustomLoading'
import CustomPagination from '../../components/common/CustomPagination'
import {useLogin} from "../login/LoginContext";

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('all')
  const [memberId, setMemberId] = useState(null)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12 // 한 페이지에 12개 카드(4x3)

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

      // productId별로 그룹핑하여 썸네일(200) 우선 선택
      const productMap = new Map()
      filtered.forEach((p) => {
        if (!productMap.has(p.productId)) {
          productMap.set(p.productId, p)
        } else {
          // 이미 있는 상품이면, 썸네일(200)을 우선적으로 선택
          const existing = productMap.get(p.productId)
          if (p.imageType === '200' && existing.imageType !== '200') {
            productMap.set(p.productId, p)
          }
        }
      })

      setProducts(Array.from(productMap.values()))
    } catch (error) {
      console.error('상품 목록 불러오기 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 로그인된 사용자 정보 조회
  const {loginMember, isLoading} = useLogin();

  // 즐겨찾기 목록 불러오기
  const fetchFavorites = async (id) => {
    try {
      const res = await axios.get(`/api/favorites?memberId=${id}`)
      setFavoriteProductIds(res.data)

    } catch (error) {

    }
  }

  const navigate = useNavigate()

  // 컴포넌트 최초 마운트 시 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
      if (loginMember?.memberId) {
        await fetchFavorites(loginMember.memberId);
      }
    };
    fetchData();
  }, [loginMember]);

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
        alert('관심상품에 등록되었습니다!')

      } else {
        // 즐겨찾기 삭제
        await axios.delete('/api/favorites', { data: { memberId, productId } })
        const newFavs = favoriteProductIds.filter((id) => id !== productId)
        setFavoriteProductIds(newFavs)
        alert('관심상품에서 삭제되었습니다!')

      }
    } catch (error) {
      alert('즐겨찾기 중 문제가 발생했습니다.')
    }
  }

  // 탭 변경 핸들러
  const handleTabChange = (key) => {
    setActiveKey(key)
    setCurrentPage(1) // 탭 변경 시 페이지를 1로 초기화
  }

  // 각 탭에 해당하는 상품 렌더링 정의
  const tabItems = productTypes.map((type) => {
    const filteredProducts =
      type.key === 'all'
        ? products.filter((p) => p.productDisplayType === '표시')
        : products.filter((p) => p.productDisplayType === '표시' && p.productCat === type.key)

    // 페이지네이션 적용
    const startIdx = (currentPage - 1) * pageSize
    const endIdx = startIdx + pageSize
    const pagedProducts = filteredProducts.slice(startIdx, endIdx)

    return {
      label: type.label,
      key: type.key,
      children: loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <CustomLoading size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {pagedProducts.length > 0 ? (
              pagedProducts.map((product) => (
                <Col key={product.productId} xs={24} sm={12} md={6} lg={6}>
                  <CustomCard
                    id={product.productId}
                    image={
                      product.imagePath && product.imageName
                        ? `/static/${product.imagePath}/${product.imageName}`
                        : '/static/images/thumbnail/no-image.png'
                    }
                    company={product.sellerCompany}
                    productName={product.productName}
                    price={product.productUnitPrice}
                    minQuantity={product.productMinQtr}
                    immediatePurchase={['즉시 구매 상품', '즉시/예약'].includes(
                      product.productSellType
                    )}
                    reservationPurchase={['예약 상품', '즉시/예약'].includes(
                      product.productSellType
                    )}
                    isFavorite={favoriteProductIds.includes(product.productId)}
                    onFavoriteToggle={() => toggleFavorite(product.productId)}
                    onClick={() => navigate(`/product/${product.productId}`)}
                    onImageError={(e) => {
                      if (product.imageName && product.imageName.includes('-')) {
                        const productName = product.productName || ''
                        const mappedFileName = `product_thumb_${productName
                          .toLowerCase()
                          .replace(/\s+/g, '')}.png`
                        e.target.src = `/static/images/thumbnail/${mappedFileName}`
                        console.log('매핑된 파일명으로 재시도:', mappedFileName)
                      }
                    }}
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
                      {product.sellerCompany && (
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
                          {product.sellerCompany}
                        </div>
                      )}
                      {/* 상품명 (2줄 고정, 넘치면 ... 처리) */}
                      <div className="product-name-fixed">{product.productName}</div>
                    </div>
                    {/* ===== 카드 중단: 가격/라벨 영역 ===== */}
                    {/* (이 영역은 CustomCard 내부에서 이미 처리됨) */}
                    {/* ===== 카드 하단: 최소구매수량 영역 ===== */}
                    {/* (이 영역도 CustomCard 내부에서 이미 처리됨) */}
                  </CustomCard>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Empty description="상품이 없습니다." />
              </Col>
            )}
          </Row>
          {/* 페이지네이션 */}
          {filteredProducts.length > pageSize && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
              <CustomPagination
                current={currentPage}
                total={filteredProducts.length}
                onChange={(page) => setCurrentPage(page)}
                pageSize={pageSize}
              />
            </div>
          )}
        </>
      ),
    }
  })

  return (
    <div>
      <h2>온라인 상품 목록</h2>
      {loading ? (
        <CustomLoading size="large" />
      ) : (
        <CustomTabs items={tabItems} type="card" onChange={handleTabChange} />
      )}
    </div>
  )
}
