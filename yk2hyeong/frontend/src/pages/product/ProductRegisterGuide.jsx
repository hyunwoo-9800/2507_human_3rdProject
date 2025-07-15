import React from 'react';

export default function ProductRegisterGuide() {
    return (
        <div>
            <h2>1. 안내사항</h2>
            <p>상품 등록 전 반드시 아래 내용을 확인해주세요.</p>
            <ul>
                <li>상품명은 중복되지 않게 작성해야 합니다.</li>
                <li>상품 이미지는 최소 1장 이상 첨부해야 합니다.</li>
                {/* 기타 내용들 */}
            </ul>
        </div>
    );
}
