import React from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const CustomCarousel = ({
                            items = [],
                            height = '250px',
                            autoplay = true,
                            autoplaySpeed = 3000,
                            pauseOnHover = true,
                            onClick,
                        }) => {
    // 화살표 스타일
    const arrowStyle = {
        fontSize: '24px',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: '50%',
        padding: '8px',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2,
        cursor: 'pointer',
    };

    const containerStyle = {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
    };

    return (
        <div style={containerStyle}>
            <Carousel
                autoplay={autoplay}
                autoplaySpeed={autoplaySpeed}
                pauseOnHover={pauseOnHover}
                dots
                dotPosition="bottom"
                arrows
               >
                {items.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => onClick && onClick(index, item)}
                        style={{ width: '100%' }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: height,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {typeof item === 'string' ? (
                                <img
                                    src={item}
                                    alt={`배너${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            ) : (
                                item.link ? (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={`배너${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                display: 'block',
                                            }}
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={item.image}
                                        alt={`배너${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                )
                            )}
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;
