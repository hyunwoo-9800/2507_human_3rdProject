import React from "react";

const MenuSection = ({ title, items, activeIndex, sectionIndex, onItemClick }) => {
    return (
        <div className="menu-section">
            <h3>{title}</h3>
            <ul>
                {items.map((item, i) => {
                    const isActive = activeIndex === item;
                    return (
                        <li
                            key={i}
                            className={isActive ? 'active' : ''}
                            onClick={() => onItemClick(item)}
                        >
                            {item}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MenuSection;