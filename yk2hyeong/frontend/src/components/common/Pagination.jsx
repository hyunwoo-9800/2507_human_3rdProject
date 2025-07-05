import React from "react";
import "./common.css";

/**
 * 공통 페이지네이션 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // 1부터 totalPages까지 페이지 번호 배열 생성
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="common-pagination">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`common-pagination-button ${
            page === currentPage ? "active" : ""
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
