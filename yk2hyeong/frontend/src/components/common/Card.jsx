import React from 'react';
import './common.css';

export default function Card({ title, children, footer }) {
    return (
        <div className="common-card">
            {title && <div className="common-card-title">{title}</div>}
            <div className="common-card-content">{children}</div>
            {footer && <div className="common-card-footer">{footer}</div>}
        </div>
    );
}