import React from "react";
import "./common.css";

/**
 * 공통 셀렉트 박스 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function Select({ label, name, value, onChange, options = [] }) {
  return (
    <div className="common-select-wrapper">
      {label && <label className="common-select-label">{label}</label>}
      <select name={name} value={value} onChange={onChange} className="common-select">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
