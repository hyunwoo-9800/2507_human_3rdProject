import React from 'react';
import { Card } from 'antd';

const CustomCard = ({
    id,
    image = '',
    company = '',
    productName = '',
    footer = null,
    width = 600,
    layout = 'column',
    hidePrice = false,
    hideQuantity = false,
}) => {
    const isRow = layout === 'row';

    return (
        <Card
            hoverable
            style={{
                width,
                display: isRow ? 'flex' : 'block',
                flexDirection: isRow ? 'row' : 'column',
                alignItems: isRow ? 'center' : 'stretch',
                margin: '0 auto', // 가운데 정렬 (선택)
            }}
            bodyStyle={{
                display: isRow ? 'flex' : 'block',
                flexDirection: isRow ? 'row' : 'column',
                alignItems: isRow ? 'center' : 'stretch',
                padding: 16,
            }}
        >
            {image && (
                <img
                    src={image}
                    alt="card-img"
                    style={{
                        width: isRow ? 100 : '100%',
                        objectFit: 'cover',
                        borderRadius: 4,
                        marginBottom: 12,
                    }}
                />
            )}

            <div style={{ flexGrow: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', fontSize: 16 }}>{company}</div>
                <div style={{ fontSize: 14, marginTop: 6, color: '#555' }}>{productName}</div>

                {footer && (
                    <div style={{
                        marginTop: 20,
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'center',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default CustomCard;
