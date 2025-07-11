import React,{useState} from "react";
import MenuSection from "./MenuSection";


    const Sidebar = ({activeItem, setActiveItem}) => {
        const [activeIndex, setActiveIndex] = useState(null);

        const menuData = [
            {title: '게시글관리', items: ['상품등록승인']},
            {title: '유저관리', items: ['유저관리', '회원가입승인']},
            {title: '신고관리', items: ['신고확인']},
        ];

        return (
            <nav className="admin-sidebar">
                {menuData.map((section, index) => (
                    <MenuSection
                        key={index}
                        title={section.title}
                        items={section.items}
                        activeIndex={activeIndex}
                        sectionIndex={index}
                        onItemClick={setActiveItem}
                    />
                ))}
            </nav>
        );
    };


export default Sidebar;