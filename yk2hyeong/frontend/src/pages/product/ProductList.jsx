import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomTabs from "../../components/common/CustomTabs";
import CustomCard from "../../components/common/CustomCard";
import { Row, Col, Empty, Spin } from 'antd';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState('all');
    const [memberId, setMemberId] = useState(null);
    const [favoriteProductIds, setFavoriteProductIds] = useState([]);

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
            const response = await axios.get('/api/products');
            const filtered = response.data.filter(p => p.imageType !== '003');
            const seen = new Map();
            filtered.forEach(p => {
                if (!seen.has(p.productId)) {
                    seen.set(p.productId, p);
                }
            });
            setProducts(Array.from(seen.values()));
        } catch (error) {
            console.error('상품 목록 불러오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMe = async () => {
        try {
            const res = await axios.get("/auth/me");
            setMemberId(res.data.memberId);
            return res.data.memberId;
        } catch (error) {
            console.error("로그인 정보 불러오기 실패:", error);
            return null;
        }
    };

    const fetchFavorites = async (id) => {
        try {
            const res = await axios.get(`/api/favorites?memberId=${id}`);
            const favoriteIds = res.data.map(fav => fav.productId);
            setFavoriteProductIds(favoriteIds);
        } catch (error) {
            console.error("즐겨찾기 목록 불러오기 실패:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchMe().then((id) => {
            if (id) {
                fetchFavorites(id);
            }
        });
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
                    p.productCat === type.key
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
                                    image={
                                        product.imagePath && product.imageName
                                            ? `/static${product.imagePath}/${product.imageName}`
                                            : "/static/images/no-image.png"
                                    }
                                    company={product.sellerCompany}
                                    productName={product.productName}
                                    price={product.productUnitPrice}
                                    minQuantity={product.productMinQtr}
                                    immediatePurchase={["즉시 구매 상품", "즉시/예약"].includes(product.productSellType)}
                                    reservationPurchase={["예약 상품", "즉시/예약"].includes(product.productSellType)}
                                    memberId={memberId}
                                    defaultFavorite={favoriteProductIds.includes(product.productId)}
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
