import React, { useEffect, useState } from 'react'
import ProductImgList from './ProductImgList'
import axios from 'axios'

function ProductForm({ product }) {
  const [form, setForm] = useState({
    productId: '',
    productName: '',
    productDescription: '',
    productStockQty: '',
    productUnitPrice: '',
    sellMemberId: '',
    productType: '',
    productMinQty: '',
    productRevEnd: '',
    productRevStart: '',
    createdId: '',
    createdDate: '',
    productStatus: '',
  })
  //product props 받아왔을 때 이벤트

  const [images, setImages] = useState([])
  useEffect(() => {
    if (product) {
      setForm(product)

      if (product.productId) {
        axios
          .get(`http://localhost:8080/api/product/${product.productId}/images`)
          .then((res) => {
            console.log('받아온 이미지 데이터:', res.data)
            setImages(res.data)
          })
          .catch((err) => {
            console.error('이미지 불러오기 실패:', err)
          })
      }
    } else {
      // product가 null이면 폼을 초기화
      setForm({
        productId: '',
        productName: '',
        productDescription: '',
        productStockQty: '',
        productUnitPrice: '',
        sellMemberId: '',
        productType: '',
        productMinQty: '',
        productRevEnd: '',
        productRevStart: '',
        createdId: '',
        createdDate: '',
        productStatus: '',
      })
      setImages([])
    }
  }, [product])

  return (
    <form className="product-form-content">
      <label>
        <span>상품명:</span>
        <input type="text" value={form.productName} readOnly />
      </label>
      <label>
        <span>상품설명:</span>
        <textarea value={form.productDescription} readOnly />
      </label>
      <label>
        <span>재고 수량:</span>
        <input type="number" value={form.productStockQty} readOnly />
      </label>
      <label>
        <span>상품단가:</span>
        <input type="number" value={form.productUnitPrice} readOnly />
      </label>
      <label>
        <span>상품유형:</span>
        <input type="text" value={form.productType} readOnly />
      </label>
      <label>
        <span>최소 주문 수량:</span>
        <input type="number" value={form.productMinQty} readOnly />
      </label>
      <label>
        <span>예약 시작일:</span>
        <input
          type="date"
          value={form.productRevStart ? form.productRevStart.slice(0, 10) : ''}
          readOnly
        />
      </label>
      <label>
        <span>예약 종료일:</span>
        <input
          type="date"
          value={form.productRevEnd ? form.productRevEnd.slice(0, 10) : ''}
          readOnly
        />
      </label>
      <label>
        <span>판매자 ID:</span>
        <input type="text" value={form.sellMemberId} readOnly />
      </label>
      <label>
        <span>등록일:</span>
        <input type="text" value={form.createdDate} readOnly />
      </label>
      <ProductImgList images={images} />
    </form>
  )
}

export default ProductForm
