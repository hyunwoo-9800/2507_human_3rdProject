import React from "react";
import {Link} from "react-router-dom";

function MarketTrend(){
    return(
        <div className="trendy-price">
            <div className="trendy-price-header">
                <h1>시세추이</h1>
                <Link to="/member">
                    <p>더보기 <i className="fa-solid fa-plus"></i></p>
                </Link>
            </div>
            <div className="trendy-price-content">
                <table className="trendy-price-table">
                    <thead>
                    <tr>
                        <th>품목</th>
                        <th>현재가</th>
                        <th>전일가</th>
                        <th>전일 대비</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>양배추</td>
                        <td>1,702원</td>
                        <td>1,650원</td>
                        <td className="up">+52원 ▲</td>
                    </tr>
                    <tr>
                        <td>당근</td>
                        <td>1,344원</td>
                        <td>1,320원</td>
                        <td className="up">+24원 ▲</td>
                    </tr>
                    <tr>
                        <td>오이</td>
                        <td>1,440원</td>
                        <td>1,495원</td>
                        <td className="down">-55원 ▼</td>
                    </tr>
                    <tr>
                        <td>사과</td>
                        <td>1,722원</td>
                        <td>1,720원</td>
                        <td className="up">+2원 ▲</td>
                    </tr>
                    <tr>
                        <td>마늘</td>
                        <td>1,223원</td>
                        <td>1,253원</td>
                        <td className="down">-30원 ▼</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default MarketTrend;