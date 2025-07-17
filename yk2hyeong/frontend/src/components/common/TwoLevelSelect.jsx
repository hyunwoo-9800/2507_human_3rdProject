// TwoLevelSelect.jsx
import React, { useState, useEffect } from 'react';
import './common.css';  // 기존 스타일링 파일을 참조

const TwoLevelSelect = ({
                            categoryData,
                            value, // [category, subCategoryName, detailCodeId]
                            onChange,
                            size = 'md',
                            className = '',
                        }) => {
    const categoryList = Object.keys(categoryData);

    const selectedCategory = value?.[0] || categoryList[0];
    const subList = categoryData[selectedCategory] || [];
    const selectedSub = subList.find(sub => sub.lowCodeName === value?.[1]) || subList[0];

    const selectClass = `input input-${size} ${className}`.trim();

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        const firstSub = categoryData[newCategory][0];
        onChange?.([newCategory, firstSub.lowCodeName, firstSub.detailCodeId]);
    };

    const handleSubChange = (e) => {
        const newSub = categoryData[selectedCategory].find(
            (item) => item.lowCodeName === e.target.value
        );
        if (newSub) {
            onChange?.([selectedCategory, newSub.lowCodeName, newSub.detailCodeId]);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <select className={selectClass} value={selectedCategory} onChange={handleCategoryChange}>
                {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <select
                className={selectClass}
                value={selectedSub?.lowCodeName || ''}
                onChange={handleSubChange}
            >
                {subList.map((sub) => (
                    <option key={sub.lowCodeName} value={sub.lowCodeName}>
                        {sub.lowCodeName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TwoLevelSelect;
