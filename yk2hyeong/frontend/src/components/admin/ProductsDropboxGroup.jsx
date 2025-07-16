import React from "react";

function ProductsDropboxGroup({
                                  selectCategory,
                                  selectStatus,
                                  onCategoryChange,
                                  onStatusChange,
                                  categoryOptions,
                                  statusOptions
                              }) {
    return (
        <div className="drop-box-group">
            {/* 카테고리 드롭박스 */}
            <select
                className="input input-md"
                value={selectCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
            >
                <option value="전체">분류</option>
                {categoryOptions.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                ))}
            </select>

            {/* 상태 드롭박스 */}
            <select
                className="input input-md"
                value={selectStatus}
                onChange={(e) => onStatusChange(e.target.value)}
            >
                <option value="전체">상태</option>
                {statusOptions.map((status, idx) => (
                    <option key={idx} value={status}>{status}</option>
                ))}
            </select>
        </div>
    );
}

export default ProductsDropboxGroup;
