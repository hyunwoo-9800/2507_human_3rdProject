import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomPagination from "../common/CustomPagination";

function PurchaseProduct({ selectedYear, selectedMonth }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
            setProducts([]);
            return;
        }

        axios.get(`/api/mypage/purchased?memberId=${memberId}`)
            .then((res) => {
                const raw = res.data;

                const uniqueProducts = raw.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.productId === item.productId)
                );

                const filtered = uniqueProducts.filter((p) => {
                    if (!p.createdDate) return false;
                    const dateOnly = p.createdDate.split("T")[0];
                    const [year, month] = dateOnly.split("-").map(Number);
                    if (parseInt(selectedYear) !== year) return false;
                    if (selectedMonth !== "total" && parseInt(selectedMonth) !== month) return false;
                    return true;
                });

                const cardData = filtered.map(product => {
                    return {
                        productId: product.productId,
                        productName: product.productName,
                        productDescription: product.productDescription,
                        productUnitPrice: product.productUnitPrice,
                        productMinQtr: product.productMinQtr,
                        buyQty: product.buyQty,
                        buyTotalPrice: product.buyTotalPrice,
                        buyDeliveryDate: formatDate(product.buyDeliveryDate),
                        createdDate: formatDate(product.createdDate),
                        imageName: product.imageName
                    };
                });

                setProducts(cardData);
                setPage(1);
            })
            .catch((err) => {
                console.error("구매 상품 데이터 로딩 실패:", err);
            });
    }, [selectedYear, selectedMonth]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    const getImageSrc = (imageName) => {
        if (!imageName) return "/static/images/thumbnail/no-image.png";
        return `/static/images/thumbnail/${imageName}`;
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const paginatedProducts = products.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <div className="card-list">
            {products.length === 0 ? (
                <div className="no-purchased-products">
                    <h3>구매한 상품이 없습니다</h3>
                    <button onClick={() => navigate("/productlist")}>상품 목록으로 이동</button>
                </div>
            ) : (
                <>
                    {paginatedProducts.map((p, idx) => (
                        <div className="card" key={idx}>
                            <img
                                src={getImageSrc(p.imageName)}
                                alt="product"
                                onError={(e) => {
                                    if (e.target.src.includes("no-image.png")) return;
                                    e.target.onerror = null;
                                    e.target.src = "/static/images/thumbnail/no-image.png";
                                }}
                            />
                            <div className="card-content">
                                <p><strong className="item-label">상품명</strong><span>{p.productName}</span></p>
                                <p><strong className="item-label">상품설명</strong><span>{p.productDescription}</span></p>
                                <p><strong className="item-label">구매수량</strong><span>{p.buyQty}</span></p>
                                <p><strong className="item-label">구매금액</strong><span>{Number(p.buyTotalPrice).toLocaleString()}원</span></p>
                                <p><strong className="item-label">구매일자</strong><span>{p.createdDate}</span></p>
                                <p><strong className="item-label">배송예정일</strong><span>{p.buyDeliveryDate}</span></p>
                            </div>
                        </div>
                    ))}
                </>
            )}
            <div className="pagination-box">
                <CustomPagination
                    defaultCurrent={page}
                    total={products.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default PurchaseProduct;
