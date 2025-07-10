import React from 'react';
import { Card } from 'antd';
const { Meta } = Card;

const CustomCard = ({
                        title = '',
                        description = '',
                        image = '',
                        layout = 'column', // 'column' or 'row'
                        width = 240,
                        ...rest
                    }) => {
    const isRow = layout === 'row';

    return (
        <Card
            hoverable
            style={{
                width: isRow ? 'auto' : width,
                display: isRow ? 'flex' : 'block',
                flexDirection: isRow ? 'row' : 'column',
                alignItems: isRow ? 'center' : 'stretch',
                padding: isRow ? 12 : undefined,
                maxWidth: isRow ? '100%' : undefined,
            }}
            bodyStyle={{
                display: isRow ? 'flex' : 'block',
                flexDirection: isRow ? 'row' : 'column',
                alignItems: isRow ? 'center' : 'stretch',
                padding: isRow ? '0 0 0 12px' : undefined,
                flexGrow: 1,
            }}
            {...rest}
        >
            {image && (
                <img
                    src={image}
                    alt="card-img"
                    style={{
                        width: isRow ? 100 : '100%',
                        height: isRow ? 'auto' : 'auto',
                        objectFit: 'contain', // 잘리지 않고 비율 유지
                        borderRadius: 4,
                    }}
                />
            )}
            <Meta
                title={title}
                description={description}
                style={{
                    marginLeft: isRow ? 16 : 0,
                    marginTop: isRow ? 0 : 12,
                    flexGrow: 1,
                    wordBreak: 'break-word',  // 긴 텍스트 줄바꿈
                    minWidth: 0,  // flex-grow 텍스트 오버플로우 방지용
                }}
            />
        </Card>
    );
};

export default CustomCard;
