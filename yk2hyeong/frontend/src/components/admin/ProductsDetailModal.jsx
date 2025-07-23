import React from 'react'
import { Modal } from 'antd'
import ProductImgList from './ProductImgList'

const ProductDetailModal = ({ visible, onClose, product }) => {
  if (!product) return null

  const fieldLabels = {
    productId: '상품 ID',
    productName: '상품명',
    productCodeName: '상품 코드명',
    productStatusName: '상품 상태명',
    productCat: '카테고리',
    productDescription: '상품 설명',
    productStockQty: '재고 수량',
    productUnitPrice: '단가',
    productMinQtr: '최소 구매 수량',
    productRevStart: '예약 시작일',
    productRevEnd: '예약 종료일',
    productSellType: '판매 유형',
    sellerName: '판매자 이름',
    sellerEmail: '판매자 이메일',
    sellerCompany: '판매자 회사',
    productDisplayType: '노출 방식',
    createdDate: '등록일',
  }
  // 이미지리스트 배열 형태로 구성
  const imageArray = product.images || []
  console.log('모달에서 넘기는 imageArray:', imageArray)

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={800}>
      <h2>상품 상세 정보</h2>
      <table className="product-detail-table">
        <tbody>
          {Object.entries(fieldLabels).map(([key, label]) => (
            <tr key={key}>
              <th style={{ textAlign: 'right', paddingRight: '10px' }}>{label}</th>
              <td>{product[key] ?? '없음'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductImgList images={imageArray} />
    </Modal>
  )
}

export default ProductDetailModal
