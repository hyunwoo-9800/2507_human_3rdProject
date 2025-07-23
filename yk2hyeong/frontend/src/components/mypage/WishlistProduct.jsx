import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../common/CustomPagination'
import {useNavigate} from "react-router-dom";
import CustomLoading from "../common/CustomLoading";

function WishlistProduct({ selectedYear, selectedMonth }) {
  const [products, setProducts] = useState([])
  const memberId = localStorage.getItem('memberId')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!memberId) {
      console.warn('로그인 정보 없음: memberId가 없습니다.')
      setProducts([])
      setIsLoading(false) //로딩 끝 처리
      return
    }

    const fetchWishlistProducts = async () => {

      setIsLoading(true);

      try {
        const favoriteRes = await axios.get(`/api/favorites?memberId=${memberId}`)
        const favoriteIds = favoriteRes.data

        if (!favoriteIds || favoriteIds.length === 0) {
          setProducts([])
          return
        }

        const productRes = await axios.get('/api/products')
        const allProducts = productRes.data

        const matchedProducts = allProducts.filter((p) => favoriteIds.includes(p.productId))

        // productId별로 그룹핑하여 썸네일(200) 우선 선택
        const productMap = new Map()
        matchedProducts.forEach((p) => {
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

        const uniqueProducts = Array.from(productMap.values())

        const filtered = uniqueProducts.filter((p) => {
          if (!p.createdDate) return false
          const dateOnly = p.createdDate.split('T')[0]
          const [year, month] = dateOnly.split('-').map(Number)
          if (parseInt(selectedYear) !== year) return false
          if (selectedMonth !== 'total' && parseInt(selectedMonth) !== month) return false
          return true
        })

        setProducts(filtered)
        setPage(1)
      } catch (err) {
        console.error('관심상품 불러오기 실패:', err)
      }finally {
        setIsLoading(false) //로딩 종료
      }
    }

    fetchWishlistProducts()
  }, [memberId, selectedYear, selectedMonth])

  const getImageSrc = (product) => {
    if (product.imagePath && product.imageName) {
      return `/static/${product.imagePath}/${product.imageName}`
    }
    return '/static/images/thumbnail/no-image.png'
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="card-list">
      {isLoading ? (
          <CustomLoading size="large"/>
          ) : products.length === 0 ? (
          <div className="no-purchased-products">
            <h3>관심등록한 상품이 없습니다</h3>
            <button onClick={() => navigate("/productlist")}>상품 목록으로 이동</button>
          </div>
      ) : (
          <>
      {paginatedProducts.map((item) => (
        <div className="card" key={item.productId}>
          <img
            src={getImageSrc(item)}
            alt="product"
            onError={(e) => {
              if (e.target.src.includes('no-image.png')) return
              e.target.onerror = null
              e.target.src = '/static/images/thumbnail/no-image.png'
            }}
          />
          <div className="card-content">
            <div className="card-content-left">
              <p>
                <strong className="item-label">출하자</strong>
                <span>{item.sellerCompany}</span>
              </p>
              <p>
                <strong className="item-label">상품명</strong>
                <span>{item.productName}</span>
              </p>
              <p>
                <strong className="item-label">최소구매수량</strong>
                <span>{item.productMinQtr}kg</span>
              </p>
            </div>
            <div className="card-content-right">
              <p>
                <strong className="item-label">단위 당 가격</strong>
                <span>{Number(item.productUnitPrice).toLocaleString()}원</span>
              </p>
              <p>
                <strong className="item-label">등록일자</strong>
                <span>{item.createdDate}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
          )}
      {!isLoading && products.length > 0 && (
          <div className="pagination-box">
            <CustomPagination
                defaultCurrent={page}
                total={products.length}
                pageSize={pageSize}
                onChange={handlePageChange}
            />
          </div>
      )}
    </div>
  )
}

export default WishlistProduct
