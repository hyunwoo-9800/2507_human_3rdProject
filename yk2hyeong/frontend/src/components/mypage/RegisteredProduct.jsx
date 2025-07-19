import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../common/CustomPagination";

function RegisteredProduct({ selectedYear, selectedMonth }) {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) {
            setProducts([]);
            return;
        }

        axios.get(`/api/products?memberId=${memberId}`)
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
                        sellerCompany: product.sellerCompany,
                        productName: product.productName,
                        productDescription: product.productDescription,
                        productMinQtr: product.productMinQtr,
                        productUnitPrice: product.productUnitPrice,
                        createdDate: formatDate(product.createdDate),
                        imageType: product.imageType,
                        imagePath: product.imageType === 200 ? product.imagePath : null,
                        imageName: product.imageName
                    };
                });

                setProducts(cardData);
                setPage(1);
            })
            .catch((err) => {
                console.error("상품 데이터 로딩 실패:", err);
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
                        <div className="card-content-left">
                            <p><strong className="item-label">출하자</strong><span>{p.sellerCompany}</span></p>
                            <p><strong className="item-label">상품명</strong><span>{p.productName}</span></p>
                            <p><strong className="item-label">상품설명</strong><span className="description-text">{p.productDescription}</span></p>
                        </div>
                        <div className="card-content-right">
                            <p><strong className="item-label">단위 당 가격</strong><span>{Number(p.productUnitPrice).toLocaleString()}원</span></p>
                            <p><strong className="item-label">최소구매수량</strong><span>{p.productMinQtr}kg</span></p>
                            <p><strong className="item-label">등록일자</strong><span>{p.createdDate}</span></p>
                        </div>
                    </div>
                </div>
            ))}
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

export default RegisteredProduct;