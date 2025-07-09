import React from "react";
import ButtonGroup from "./ButtonGroup";

function FormTab(){
    return (
        <div className="report-check-tab">
            <h2>게시글관리 &gt; 상품등록승인</h2>
            <div className="form-section">
                <table className="scroll-table">
                    <thead>
                    <tr>
                        <th colSpan="1">전체선택</th>
                        <th><input type="checkbox" id="select-all-checkbox"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>신선한 가지</td>
                        <td><input type="checkbox"/></td>
                    </tr>
                    <tr>
                        <td>달콤한 포도</td>
                        <td><input type="checkbox"/></td>
                    </tr>
                    <tr>
                        <td>10년전 잃어버린 동생을 찾습니다.</td>
                        <td><input type="checkbox"/></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                        <td></td>
                    </tr>

                    </tbody>
                </table>
                <div className="product-form">
                    <h2>상품등록페이지 폼 가져오기</h2>

                </div>
            </div>
            <ButtonGroup/>
        </div>

)
}

export default FormTab;