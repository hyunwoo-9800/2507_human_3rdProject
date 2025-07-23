import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function PopularItem(){

    // 최다 판매품목 담기
    const [bestSell,setBestSell] = useState([]);

    useEffect(() => {

        axios.get("/api/main/bestSell")
            .then(response => {

                setBestSell(response.data);
                
            })
            .catch(error => {
                
                console.log("판매건수 불러오기 실패", error);
                
            });
    }, []);
    
    return(
        <div className="brand-leader">
            <h1>일일 최다판매품목</h1>
            <div className="brand-leader-content">
                <ul>
                    {bestSell.length === 0 ? (
                        <li>판매된 상품이 없습니다.</li>
                    ):(
                        bestSell.map((item, index) => (
                            <li key={index}>
                                {item.productName}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default PopularItem;