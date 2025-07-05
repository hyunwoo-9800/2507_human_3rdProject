import React from "react";
import "./common.css";

/**
 * 공통 로딩 스피너 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function LoadingSpinner() {
  return (
    <div className="common-spinner-wrapper">
      <div className="spinner" />
    </div>
  );
}
