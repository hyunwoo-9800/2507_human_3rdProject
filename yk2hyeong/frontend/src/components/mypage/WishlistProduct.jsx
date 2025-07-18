import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../common/CustomPagination";

function WishlistProduct() {
    const [products, setProducts] = useState([]);
    const memberId = localStorage.getItem("memberId");

    // 페이지네이션
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        if (!memberId) {
            console.warn("로그인 정보 없음: memberId가 없습니다.");
            setProducts([]);
            return;
        }



        const fetchWishlistProducts = async () => {
            try {
                const favoriteRes = await axios.get(`http://localhost:8080/api/favorites?memberId=${memberId}`);
                const favoriteIds = favoriteRes.data;

                if (!favoriteIds || favoriteIds.length === 0) {
                    setProducts([]);
                    return;
                }

                const productRes = await axios.get("http://localhost:8080/api/products");
                const allProducts = productRes.data;

                const matchedProducts = allProducts.filter((p) =>
                    favoriteIds.includes(p.productId)
                );

                const uniqueProducts = matchedProducts.filter(
                    (item, index, self) =>
                        index === self.findIndex(t => t.productId === item.productId)
                );

                setProducts(uniqueProducts);
            } catch (err) {
                console.error("관심상품 불러오기 실패:", err);
            }
        };


        fetchWishlistProducts();
    }, [memberId]);

    // 페이지네이션
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    // 현재 페이지의 상품 6개만 추출
    const paginatedProducts = products.slice(
        (page - 1) * pageSize,
        page * pageSize
    );


    return (
        <div className="card-list">
            {paginatedProducts.map((item) => (
                <div className="card" key={item.productId}>
                    <img
                        src={
                            item.imagePath && item.imageName
                                ? `/static${item.imagePath}/thumbnail/${item.imageName}`
                                : "/static/images/product3.jpg"
                        }
                        alt="product"
                    />
                    <div className="card-content">
                        <p><strong className="item-label">출하자</strong><span>{item.sellerCompany}</span></p>
                        <p><strong className="item-label">상품명</strong><span>{item.productName}</span></p>
                        <p><strong className="item-label">단위 당 가격</strong><span>{item.productUnitPrice}원</span></p>
                        <p><strong className="item-label">최소구매수량</strong><span>{item.productMinQtr}</span></p>
                        <p><strong className="item-label">등록일자</strong><span>{item.createdDate}</span></p>
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

export default WishlistProduct;
