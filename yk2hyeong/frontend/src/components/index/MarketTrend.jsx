import React from "react";
import {Link} from "react-router-dom";
import PriceChangeTable from "../chart/PriceChangeTable";

function MarketTrend(){
    return(
        <div className="trendy-price">
            <div className="trendy-price-header">
                <h1>시세추이</h1>
                <Link to="/chart">
                    <p>더보기 <i className="fa-solid fa-plus"></i></p>
                </Link>
            </div>
            <div className="trendy-price-content">
                <PriceChangeTable limit={5} />
            </div>
        </div>
    );
}
export default MarketTrend;