// TwoLevelSelect.jsx
import React, { useState, useEffect } from 'react';
import './common.css';  // 기존 스타일링 파일을 참조

const TwoLevelSelect = ({
                            categoryData,
                            value,
                            onChange,
                            size = 'md',
                            className = '',
                        }) => {
    const categoryList = Object.keys(categoryData);
    const defaultCategory = value && value[0] ? value[0] : categoryList[0];
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

    // 선택된 서브카테고리는 객체 형태로 변경
    const defaultSub = value && value[1]
        ? value[1]
        : categoryData[defaultCategory][0];

    const [selectedSub, setSelectedSub] = useState(defaultSub);

    useEffect(() => {
        if (onChange) onChange([selectedCategory, selectedSub.lowCodeName, selectedSub.detailCodeId]);
    }, [selectedCategory, selectedSub, onChange]);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSub(categoryData[category][0]);
    };

    const handleSubChange = (e) => {
        const sub = categoryData[selectedCategory].find(
            (item) => item.lowCodeName === e.target.value
        );
        setSelectedSub(sub);
    };

    const selectClass = `input input-${size} ${className}`.trim();

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <select className={selectClass} value={selectedCategory} onChange={handleCategoryChange}>
                {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <select className={selectClass} value={selectedSub.lowCodeName} onChange={handleSubChange}>
                {categoryData[selectedCategory].map((sub) => (
                    <option key={sub.lowCodeName} value={sub.lowCodeName}>
                        {sub.lowCodeName}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TwoLevelSelect;
