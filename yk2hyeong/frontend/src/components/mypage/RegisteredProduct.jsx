import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../common/CustomPagination'
import {useNavigate} from "react-router-dom";
import CustomLoading from "../common/CustomLoading";

function RegisteredProduct({ selectedYear, selectedMonth }) {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 5
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const memberId = localStorage.getItem('memberId')
    if (!memberId) {
      setProducts([])
      return
    }

    // 로딩로딩
    setIsLoading(true)

    axios
      .get(`/api/products?memberId=${memberId}`)
      .then((res) => {
        const raw = res.data

        // productId별로 그룹핑하여 썸네일(200) 우선 선택
        const productMap = new Map()
        raw.forEach((p) => {
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

        const cardData = filtered.map((product) => {
          return {
            productId: product.productId,
            sellerCompany: product.sellerCompany,
            productName: product.productName,
            productDescription: product.productDescription,
            productMinQtr: product.productMinQtr,
            productUnitPrice: product.productUnitPrice,
            createdDate: formatDate(product.createdDate),
            imageType: product.imageType,
            imagePath: product.imagePath,
            imageName: product.imageName,
          }
        })

        setProducts(cardData)
        setPage(1)
      })
      .catch((err) => {
        console.error('상품 데이터 로딩 실패:', err)
      })
        .finally(()=> {
          setIsLoading(false) //로딩 끝
        })
  }, [selectedYear, selectedMonth])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]
  }

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
          <CustomLoading size="large" />
      ) : products.length === 0 ? (
          <div className="no-purchased-products">
            <h3>등록한 상품이 없습니다</h3>
            <button onClick={() => navigate("/productlist")}>상품 목록으로 이동</button>
          </div>
      ) : (
          <>
      {paginatedProducts.map((p, idx) => (
        <div
          className="card"
          key={idx}
          onClick={() => navigate(`/product/${p.productId}`)}
          style={{ cursor: 'pointer' }}
        >

          <img
            src={getImageSrc(p)}
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
                <span>{p.sellerCompany}</span>
              </p>
              <p>
                <strong className="item-label">상품명</strong>
                <span>{p.productName}</span>
              </p>
              <p>
                <strong className="item-label">상품설명</strong>
                <span className="description-text">{p.productDescription}</span>
              </p>
            </div>
            <div className="card-content-right">
              <p>
                <strong className="item-label">단위 당 가격</strong>
                <span>{Number(p.productUnitPrice).toLocaleString()}원</span>
              </p>
              <p>
                <strong className="item-label">최소구매수량</strong>
                <span>{p.productMinQtr}kg</span>
              </p>
              <p>
                <strong className="item-label">등록일자</strong>
                <span>{p.createdDate}</span>
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

export default RegisteredProduct
