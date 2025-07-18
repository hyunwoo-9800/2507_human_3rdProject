import React, {useEffect, useState} from "react";
import Pagination from "../common/Pagination";
import axios from "axios";
import CustomPagination from "../common/CustomPagination";

function PurchaseProduct(){
    const [products, setProducts] = useState([]);
    // 페이지네이션
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        const memberId = localStorage.getItem("memberId");
        console.log("memberId from localStorage: ", memberId);

        axios.get(`/api/mypage/purchased?memberId=${memberId}`)
            .then((res) => {
                const raw = res.data;

                // productId 기준 중복 제거
                const uniqueProducts = raw.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t.productId === item.productId)
                );

                const cardData = raw.map(product => {
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
            })
            .catch((err) => {
                console.error("구매 상품 데이터 로딩 실패:", err);
            });
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    };

    const getImageSrc = (imageName) => {
        if (!imageName) return "/static/images/thumbnail/no-image.png";
        return `/static/images/thumbnail/${imageName}`;
    };

    // 페이지네이션
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    //현재 페이지의 상품 4개만 추출
    const paginatedProducts  = products.slice(
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
                        <p><strong className="item-label">상품명</strong><span>{p.productName}</span></p>
                        <p><strong className="item-label">상품설명</strong><span>{p.productDescription}</span></p>
                        <p><strong className="item-label">구매수량</strong><span>{p.buyQty}</span></p>
                        <p><strong className="item-label">구매금액</strong><span>{Number(p.buyTotalPrice).toLocaleString()}원</span></p>
                        <p><strong className="item-label">구매일자</strong><span>{p.createdDate}</span></p>
                        <p><strong className="item-label">배송예정일</strong><span>{p.buyDeliveryDate}</span></p>
                    </div>
                </div>
            ))}
            <CustomPagination
                defaultCurrent={page}
                total={products.length}
                pageSize={pageSize}
                onChange={handlePageChange}
            />
        </div>
    );
}

export default PurchaseProduct;