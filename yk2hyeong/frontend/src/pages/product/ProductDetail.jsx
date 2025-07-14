import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`/api/products`) // 또는 `/api/products/${productId}` 라우터 있으면 단건 조회
            .then(res => {
                const found = res.data.find(p => p.productId === productId);
                setProduct(found);
            });
    }, [productId]);

    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h1>{product.productName}</h1>
            <img src={`/static${product.imagePath}/${product.imageName}`} alt={product.productName} />
            <p>판매처: {product.sellerCompany}</p>
            <p>가격: {product.productUnitPrice}원</p>
            <p>최소 주문 수량: {product.productMinQtr}</p>
        </div>
    );
}
