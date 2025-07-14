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

    const filteredProducts = activeKey === 'all'
        ? products.filter(p => p.display === 'Y')
        : products.filter(p => p.productType === activeKey && p.display === 'Y');

    const tabItems = productTypes.map(type => ({
        label: type.label,
        key: type.key,
        children: loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" />
            </div>
        ) : (
            <Row gutter={[16, 16]}>
                {filteredProducts.length > 0 ? filteredProducts.map(product => (
                    <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                        <CustomCard
                            id={product.id}
                            company={product.company}
                            productName={product.productName}
                            description={product.description}
                            price={product.price}
                            minQuantity={product.minQuantity}
                            image={product.image || "/img/default.jpg"} // ✅ 서버에서 이미지 경로 포함시 반영
                            immediatePurchase={true}
                            reservationPurchase={!!product.revStart}
                        />
                    </Col>
                )) : (
                    <Col span={24}>
                        <Empty description="상품이 없습니다." />
                    </Col>
                )}
            </Row>
        )
    }));

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
