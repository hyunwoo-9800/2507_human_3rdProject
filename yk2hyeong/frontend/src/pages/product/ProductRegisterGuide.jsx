import React, { useState } from 'react'
import Checkbox from '../../components/common/Checkbox'

export default function ProductRegisterGuide({ checked, onChangeChecked, onNext }) {
  const [checkedValues, setCheckedValues] = useState([])

  const handleCheckboxChange = (e) => {
    const value = e.target.value
    setCheckedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const isChecked = checkedValues.includes('check1')

  return (
    <div>
      <h2>1. 안내사항</h2>
      <p>상품 등록 시 유의사항</p>
      <ol style={{ marginBottom: '32px' }}>
        <li style={{ marginBottom: '8px' }}>
          <strong>상품명은 중복 없이 명확하게 작성</strong>해 주세요. (예: "2024년 햇고구마 10kg")
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>상품 이미지는 1장 이상 등록</strong>해야 하며, 실제 상품과 동일해야 합니다.
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>상품 단위, 규격, 수량, 가격을 정확히</strong> 입력해 주세요.
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>유통기한이 지난 상품</strong>이나 <strong>플랫폼에서 금지한 품목</strong>은 등록할
          수 없습니다.
        </li>
        <li style={{ marginBottom: '8px' }}>
          욕설, 비방, 광고성 문구, 외부 링크는 작성할 수 없습니다.
        </li>
        <li style={{ marginBottom: '8px' }}>
          개인정보(연락처, 계좌번호 등)를 상품 설명에 포함하지 마세요.
        </li>
        <li style={{ marginBottom: '8px' }}>
          도배, 중복 등록된 상품은 관리자에 의해 삭제될 수 있습니다.
        </li>
        <li style={{ marginBottom: '8px' }}>
          타인의 이미지나 글을 무단으로 사용하는 경우 제재를 받을 수 있습니다.
        </li>
        <li style={{ marginBottom: '8px' }}>
          등록된 상품 정보가 사실과 다를 경우, 거래 제한 및 판매 중지 조치가 있을 수 있습니다.
        </li>
        <li style={{ marginBottom: '8px' }}>예약상품의 경우 예약금의 비율은 기본 50%입니다.</li>
      </ol>

      <div>
        <h3>🚫 금지 품목 안내</h3>
        <p>아래 품목은 플랫폼 정책에 따라 등록할 수 없습니다.</p>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '16px',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', width: '50%' }}>분류</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>예시</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>유통기한</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>유통기한이 지난 농산물</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>가공품</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                가공식품(곶감 제외), 반찬류, 탕류 등
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>기타 금지</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>작물씨앗, 묘목, 농약, 비료</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>동물성 식품</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>고기, 생선, 계란, 유제품</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>그 외</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                상품 카테고리에 없는 품목
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div style={{ marginBottom: '12px' }}>
          <Checkbox
            value="check1"
            label="위 안내사항을 모두 확인하였습니다."
            checked={checked}
            onChange={(e) => onChangeChecked(e.target.checked)}
            color="primary"
          />
        </div>

        {/* 버튼 오른쪽 정렬 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            disabled={!checked}
            onClick={onNext}
            style={{
              padding: '10px 20px',
              backgroundColor: checked ? '#00a43c' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: checked ? 'pointer' : 'not-allowed',
            }}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}
