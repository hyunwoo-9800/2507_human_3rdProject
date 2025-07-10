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
    const [selectedSub, setSelectedSub] = useState(
        value && value[1] ? value[1] : categoryData[defaultCategory][0]
    );

    useEffect(() => {
        if (onChange) onChange([selectedCategory, selectedSub]);
    }, [selectedCategory, selectedSub, onChange]);

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSub(categoryData[category][0]);
    };

    const handleSubChange = (e) => {
        setSelectedSub(e.target.value);
    };

    const selectClass = `input input-${size} ${className}`.trim();

    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            <select
                className={selectClass}
                value={selectedCategory}
                onChange={handleCategoryChange}
            >
                {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <select
                className={selectClass}
                value={selectedSub}
                onChange={handleSubChange}
            >
                {categoryData[selectedCategory].map((sub) => (
                    <option key={sub} value={sub}>
                        {sub}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TwoLevelSelect;
