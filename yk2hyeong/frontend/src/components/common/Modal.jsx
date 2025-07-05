import React from "react";
import "./common.css";

/**
 * 공통 모달 컴포넌트
 * @author 조현우
 * @since 2025-07-01
 */
export default function Modal({ isOpen, onClose, children }) {
  // isOpen이 false면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="common-modal-overlay">
      <div className="common-modal-content">
        <button className="common-modal-close" onClick={onClose}>
          ✖
        </button>
        <div className="common-modal-body">{children}</div>
      </div>
    </div>
  );
}
