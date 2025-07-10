import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
    height: '200px',
    background: '#364d79',
    color: '#fff',
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const CustomCarousel = ({
                            items = ['첫 번째', '두 번째', '세 번째'],
                            autoplaySpeed = 3000,
                            autoplay = true,
                            arrows = true,
                            dotPosition = 'bottom',
                            pauseOnHover = true,
                            onClick,
                        }) => (
    <Carousel
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        arrows={arrows}
        dotPosition={dotPosition}
        pauseOnHover={pauseOnHover}  // 여기 pauseOnHover=true 설정
    >
        {items.map((item, index) => (
            <div
                key={index}
                onClick={() => onClick && onClick(index, item)}
                style={contentStyle}
            >
                <h3 style={{ margin: 0 }}>{item}</h3>
            </div>
        ))}
    </Carousel>
);

export default CustomCarousel;
