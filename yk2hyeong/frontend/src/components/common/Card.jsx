import "./common.css";

/**
 * 공통 카드 컴포넌트
 * @author 조현우
 * @since 2025-07-05
 */
export default function Card({ title, children, footer }) {
  return (
    <div className="common-card">
      {title && <div className="common-card-title">{title}</div>}
      <div className="common-card-content">{children}</div>
      {footer && <div className="common-card-footer">{footer}</div>}
    </div>
  );
}
