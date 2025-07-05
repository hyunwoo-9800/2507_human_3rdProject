import React from "react";
import "./common.css";

/**
 * 공통 입력 필드 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="common-input-wrapper">
      {label && <label className="common-input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="common-input"
      />
    </div>
  );
}
