import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTabs from "../../components/common/CustomTabs";
import CustomCard from "../../components/common/CustomCard";
import { Row, Col, Empty, Spin } from 'antd';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState('all');

    const productTypes = [
        { label: '전체', key: 'all' },
        { label: '식량작물', key: '식량작물' },
        { label: '채소류', key: '채소류' },
        { label: '과일류', key: '과일류' },
        { label: '특용작물', key: '특용작물' },
    ];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products'); // ✅ 실제 API 경로로 수정 필요
            setProducts(response.data);
        } catch (error) {
            console.error('상품 목록 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };


    const tabItems = productTypes.map(type => {
        const filteredProducts = type.key === 'all'
            ? products.filter(p => p.productDisplayType === '표시')
            : products.filter(
                p =>
                    p.productDisplayType === '표시' &&
                    p.productCat === type.key // 🔍 여기에 맞게 카테고리 필드 사용
            );

        return {
            label: type.label,
            key: type.key,
            children: loading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Col key={product.productId} xs={24} sm={12} md={8} lg={6}>
                                <CustomCard
                                    id={product.productId}
                                    image={product.imagePath || "/images/no-image.png"}
                                    company={product.sellerCompany}
                                    productName={product.productName}
                                    price={product.productUnitPrice}
                                    minQuantity={product.productMinQtr}
                                    immediatePurchase={product.productSellType === "즉시 구매 상품"}
                                    reservationPurchase={product.productSellType === "예약 상품"}
                                />
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Empty description="상품이 없습니다." />
                        </Col>
                    )}
                </Row>
            )
        };
    });


    return (
        <div>
            <h2>온라인 상품 목록</h2>
            <CustomTabs
                items={tabItems}
                type="card"
                onChange={handleTabChange}
            />
        </div>
    );
}
