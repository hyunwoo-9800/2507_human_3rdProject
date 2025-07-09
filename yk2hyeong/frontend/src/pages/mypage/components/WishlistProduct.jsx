import React from "react";
import Pagination from "../../../components/common/Pagination";

function WishlistProduct(){
    return (
        <div className="card-list">
            <div className="card">
                <img src="/static/images/product3.jpg" alt="product"/>
                <div className="card-content">
                    <p>
                        <strong className="item-label">출하자</strong>
                        <span>천안청과(주)</span>
                    </p>
                    <p>
                        <strong className="item-label">상품명</strong>
                        <span>스테비아 방울토마토</span>
                    </p>
                    <p>
                        <strong className="item-label">단위/포장</strong>
                        <span>2kg 상자</span>
                    </p>
                    <p>
                        <strong className="item-label">단위 당 가격</strong>
                        <span>10,500원</span>
                    </p>
                    <p>
                        <strong className="item-label">최소구매수량</strong>
                        <span>100</span>
                    </p>
                    <p>
                        <strong className="item-label">등록일자</strong>
                        <span>yyyy/mm/dd</span>
                    </p>
                </div>
            </div>
            <div className="card">
                <img src="/static/images/product3.jpg" alt="product"/>
                <div className="card-content">
                    <p>
                        <strong className="item-label">출하자</strong>
                        <span>천안청과(주)</span>
                    </p>
                    <p>
                        <strong className="item-label">상품명</strong>
                        <span>스테비아 방울토마토</span>
                    </p>
                    <p>
                        <strong className="item-label">단위/포장</strong>
                        <span>2kg 상자</span>
                    </p>
                    <p>
                        <strong className="item-label">단위 당 가격</strong>
                        <span>10,500원</span>
                    </p>
                    <p>
                        <strong className="item-label">최소구매수량</strong>
                        <span>100</span>
                    </p>
                    <p>
                        <strong className="item-label">등록일자</strong>
                        <span>yyyy/mm/dd</span>
                    </p>
                </div>
            </div>
            <Pagination/>
        </div>
    )
}

export default WishlistProduct;