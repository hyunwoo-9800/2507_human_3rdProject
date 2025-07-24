import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../common/Button'
import CustomPagination from '../common/CustomPagination'
import DropboxGroup from './DropboxGroup'
import ProductsDropboxGroup from './ProductsDropboxGroup'
import ProductsDetailModal from './ProductsDetailModal'

function TableTab({ tabType }) {
  const [selectItem, setSelectItem] = useState(null)
  const [pageByTab, setPageByTab] = useState({ member: 1, report: 1, products: 1 })
  const currentPage = pageByTab[tabType] || 1

  //테이블 게시글 리스트(db연결)
  const [item, setItem] = useState([])

  // 유저 테이블 드롭박스 상태값 관리
  const [selectRole, setSelectRole] = useState('전체')
  const [selectStatus, setSelectStatus] = useState('전체')

  //상품 테이블 드롭박스 상태값 관리
  const [selectCategory, setSelectCategory] = useState('전체')

  // tabType을 받아와서 id값을 변경
  const getIdkey = (tabType) => {
    if (tabType === 'report') return 'reportId'
    if (tabType === 'member') return 'memberId'
    if (tabType === 'products') return 'productId'
    return 'id'
  }
  const idKey = getIdkey(tabType)

  // tabType별 응답데이터 분리
  const extractData = (data, tabType) => {
    if (tabType === 'products') {
      return Array.isArray(data) ? data : []
    }
    //member랑 report는 기존 그대로 받아오기
    return Array.isArray(data) ? data : []
  }
  // 페이지네이션 필터링된 데이터 따로 저장
  const filteredItem = item
    .filter((i) => i && i[idKey])
    .filter((i) =>
      tabType === 'member'
        ? (selectRole === '전체' || i.memberRoleName === selectRole) &&
          (selectStatus === '전체' || i.memberStatusName === selectStatus)
        : tabType === 'products'
        ? (selectCategory === '전체' || i.productCat === selectCategory) &&
          (selectStatus === '전체' || i.productStatusName === selectStatus)
        : true
    )
  const pageData = filteredItem.slice((currentPage - 1) * 10, currentPage * 10)

  // tabType으로 api 변경
  const apiMap = {
    member: '/api/member',
    report: '/api/report',
    products: '/api/products',
  }

  // tabType별 삭제버튼 기능 변경
  const deleteApiMap = {
    products: '/api/products/reject',
    member: '/api/member/reject',
    report: '/api/report/delete',
  }
  const refineProductData = (rawData) => {
    const productMap = {}
    rawData.forEach((item) => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = { ...item, images: [] }
      }
      if (item.imageName && item.imageType) {
        productMap[item.productId].images.push({
          imageName: item.imageName,
          imageType: item.imageType,
        })
      }
    })
    // 썸네일(200,400) 먼저, 상세(300) 나중에 정렬
    Object.values(productMap).forEach((product) => {
      product.images.sort((a, b) => {
        const getOrder = (type) => (type === '200' || type === '400' ? 0 : 1)
        return getOrder(a.imageType) - getOrder(b.imageType)
      })
    })
    return Object.values(productMap)
    // rawData = Object.values(productMap)
  }
  const handleClick = async () => {
    const res = await axios.get('/api/products')
    const refined = refineProductData(res.data)
    setItem(refined.map((p, index) => ({ ...p, checked: false })))
  }
  useEffect(() => {
    setItem([]) //이전 데이터 초기화
    setSelectItem(null) // 선택한 항목 초기화

    console.log('받은 tabType: ', tabType)

    const apiUrl = apiMap[tabType]
    axios
      .get(apiUrl)
      .then((res) => {
        console.log('불러온 데이터:', res.data)

        let rawData = extractData(res.data, tabType)
        // 상품관리일 때만 상품별 images 배열 가공
        if (tabType === 'products') {
          rawData = refineProductData(rawData)
        }

        const uniqueRawData =
          tabType === 'products'
            ? rawData.filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.productId === item.productId)
              )
            : rawData

        const withCheckbox = uniqueRawData.map((p, index) => ({
          ...p,
          checked: false,
          postNum: tabType === 'report' ? index + 1 : undefined,
        }))

        console.log('최종 withCheckbox:', withCheckbox)
        setItem(withCheckbox)
      })
      .catch((err) => {
        console.error('데이터 불러오기 실패:', err)
      })
  }, [tabType])
  // 필터 조건이 바뀔 때마다 페이지 초기화
  useEffect(() => {
    setPageByTab((prev) => ({ ...prev, [tabType]: 1 }))
  }, [selectRole, selectStatus, selectCategory, tabType])

  // 탭(메뉴) 이동 시 모든 탭의 페이지를 1로 초기화
  useEffect(() => {
    setPageByTab({ member: 1, report: 1, products: 1 })
  }, [tabType])

  //전체 선택 체크박스 처리
  const handleSelectAll = (e) => {
    const checked = e.target.checked
    setItem((prev) => prev.map((item) => ({ ...item, checked })))
  }
  //개별 체크박스 처리
  const handleItemCheck = (id) => {
    setItem((prev) =>
      prev.map((item) => (item[idKey] === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleRowClick = (clickedItem) => {
    setSelectItem(clickedItem)

    setItem((prev) =>
      prev.map((item) =>
        item[idKey] === clickedItem[idKey] ? { ...item, checked: !item.checked } : item
      )
    )
  }

  // 선택한 데이터 삭제(tabType별로 기능 변경)
  const handleDelete = () => {
    const selectedIds = item
      .filter((i) => i.checked)
      .map((i) =>
        tabType === 'products' ? i.productId : tabType === 'report' ? i.reportId : i.memberId
      )

    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택하세요.')
      return
    }

    if (!window.confirm('정말 처리하시겠습니까?')) return

    const apiUrl = deleteApiMap[tabType]

    axios
      .post(apiUrl, selectedIds)
      .then(() => {
        alert('처리 완료되었습니다.')
        return axios.get(apiMap[tabType]) // 목록 새로고침
      })
      .then((res) => {
        let rawData = res.data
        if (tabType === 'products') {
          rawData = refineProductData(res.data)  // <-- 상품일 때 정제
        }
        const withCheckbox = rawData.map((p, index) => ({
          ...p,
          checked: false,
          postNum: tabType === 'report' ? index + 1 : undefined,
        }))
        setItem(withCheckbox)
      })
      .catch((err) => {
        console.error('삭제 실패:', err)
        alert('오류가 발생했습니다.')
      })
  }

  // thead 관리
  const theadConfig = {
    report: ['번호', '분류', '신고내용', '제목', '사업자명', ''],
    member: ['이름', '분류', '사업자명', '이메일', '상태', ''],
    products: ['분류', '상품명', '게시글 제목', '상태', '등록일', ''],
  }

  //코드 정리, td항상 12줄 고정
  const renderDataRow = (item) => {
    const isReport = tabType === 'report'
    const isMember = tabType === 'member'
    const isProducts = tabType === 'products'
    const key = item[idKey]

    const columns = [
      <td>{isReport ? item.postNum : isMember ? item.memberName : item.productCat}</td>,
      <td>{isReport ? item.reasonName : isMember ? item.memberRoleName : item.productCodeName}</td>,
      <td>{isReport ? item.reportContent : isMember ? item.memberBname : item.productName}</td>,
      <td>{isReport ? item.productName : isMember ? item.memberEmail : item.productStatusName}</td>,
      <td>{isReport ? item.reporterName : isMember ? item.memberStatusName : item.createdDate}</td>,
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={item.checked !== undefined ? item.checked : false}
          onChange={() => handleItemCheck(key)}
          className="table-checkbox"
        />
      </td>,
    ]

    const padding = Array.from({ length: 12 - columns.length }, (_, i) => (
      <td key={`pad-${i}`}>&nbsp;</td>
    ))
    return (
      <tr key={item[idKey]} onClick={() => handleRowClick(item)}>
        {[...columns, ...padding]}
      </tr>
    )
  }

  const renderEmptyRows = () => {
    const emptyRowCount = Math.max(0, 12 - item.length)
    return Array.from({ length: emptyRowCount }, (_, rowIdx) => (
      <tr key={`empty-${rowIdx}`}>
        {Array.from({ length: 12 }, (_, i) => (
          <td key={`empty-td-${rowIdx}-${i}`}>&nbsp;</td>
        ))}
      </tr>
    ))
  }

  // 페이지네이션

  const handlePageChange = (newPage) => {
    setPageByTab((prev) => ({ ...prev, [tabType]: newPage }))
  }

  // tabType에 따라 달라지는 title 관리
  const titleMap = {
    member: '유저관리 > 유저관리',
    report: '신고관리 > 신고확인',
    products: '상품관리 > 상품관리',
  }

  return (
    <div className="report-check-tab">
      <h2>{titleMap[tabType] || '관리자 페이지'}</h2>

      {/*member 드롭박스*/}
      {tabType === 'member' && (
        <DropboxGroup
          selectStatus={selectStatus}
          selectRole={selectRole}
          onRoleChange={setSelectRole}
          onStatusChange={setSelectStatus}
          roleOption={[...new Set(item.map((i) => i.memberRoleName).filter(Boolean))]}
          statusOption={[...new Set(item.map((i) => i.memberStatusName).filter(Boolean))]}
        />
      )}
      {/*products 드롭박스*/}
      {tabType === 'products' && (
        <ProductsDropboxGroup
          selectCategory={selectCategory}
          selectStatus={selectStatus}
          onCategoryChange={setSelectCategory}
          onStatusChange={setSelectStatus}
          categoryOptions={[...new Set(item.map((i) => i.productCat).filter(Boolean))]}
          statusOptions={[...new Set(item.map((i) => i.productStatusName).filter(Boolean))]}
        />
      )}
      <table className="report-check-table">
        <colgroup>
          <col style={{ width: '10%' }} /> {/* 사용자 번호 */}
          <col style={{ width: '18%' }} /> {/* 분류 */}
          <col style={{ width: '27%' }} /> {/* 이름 */}
          <col style={{ width: '20%' }} /> {/* 이메일 */}
          <col style={{ width: '20%' }} /> {/* 연락처 */}
          <col style={{ width: '5%' }} /> {/* 체크박스 */}
        </colgroup>
        <thead>
          <tr>
            {(theadConfig[tabType] || []).map((text, idx) => (
              <th key={`th-${idx}`}>
                {text || (
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={item.length > 0 && item.every((i) => i.checked)}
                  />
                )}
              </th>
            ))}
            {[...Array(6)].map((_, i) => (
              <th key={`head-pad-${i}`}></th> // td 12줄 유지
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, idx) => renderDataRow(row, idx))}
          {renderEmptyRows()}
        </tbody>
      </table>
      <div className="pagination-wrapper">
        <CustomPagination
          current={currentPage}
          total={filteredItem.length}
          pageSize={10}
          onChange={handlePageChange}
        />
      </div>
      <Button color="error" onClick={handleDelete} className="delete-btn">
        삭제
      </Button>

      {/*상품관리일때만 열리는 상세모달창*/}
      <ProductsDetailModal
        visible={tabType === 'products' && selectItem !== null}
        onClose={() => setSelectItem(null)}
        product={selectItem}
      />
    </div>
  )
}

export default TableTab
