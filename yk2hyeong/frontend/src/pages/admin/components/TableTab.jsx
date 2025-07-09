import React from "react";

function TableTab(){
    return (
        <div className="report-check-tab">
            <h2>신고관리 &gt; 신고확인</h2>
            <table className="report-check-table">
                <thead>
                <tr>
                    <th>게시글 번호</th>
                    <th>신고분류</th>
                    <th>신고내용</th>
                    <th>제목</th>
                    <th>사업자명</th>
                    <th><input type="checkbox"/></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>12486</td>
                    <td>허위사실 기재</td>
                    <td>당도 100%는 무슨 먹자마자 뱉었어요</td>
                    <td>복숭아/털복숭아</td>
                    <td>천안청과(주)</td>
                    <td><input type="checkbox"/></td>
                </tr>
                <tr>
                    <td>12525</td>
                    <td>스팸 및 중복 게시글</td>
                    <td>연달아서 3번 올렸어요</td>
                    <td>복숭아/털복숭아</td>
                    <td>영범이형(주)</td>
                    <td><input type="checkbox"/></td>
                </tr>
                <tr>
                    <td>10025</td>
                    <td>부적절한 품목</td>
                    <td>이걸 파는게 맞아요?</td>
                    <td>사과모양 나무조각</td>
                    <td>목재좋아(주)</td>
                    <td><input type="checkbox"/></td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                <tr>
                    <td colSpan="6">&nbsp;</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TableTab;