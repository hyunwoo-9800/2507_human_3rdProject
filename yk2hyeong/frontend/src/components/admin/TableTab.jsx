import React, {useEffect, useState} from "react";
import axios from "axios";

function TableTab({tabType}){
    const [selectItem, setSelectItem] = useState(null);

    //테이블 게시글 리스트(db연결)
    const [item, setItem] = useState([]);

    useEffect(() => {

        setItem([]); //이전 데이터 초기화
        setSelectItem(null);// 선택한 항목 초기화

        console.log("받은 tabType: ", tabType);
        const apiUrl = tabType === 'member' ? '/api/member' : '/api/report';
        axios.get(apiUrl)
            .then((res)=>{
                console.log("불러온 데이터:" , res.data);
                const withCheckbox = res.data.map((p,index)=>({
                    ...p,
                    checked:false,
                    postNum : tabType === 'report' ? index+1 : undefined //게시글오름차순
                }));
                setItem(withCheckbox);
                console.log("불러온 데이터: ", withCheckbox);
            })
            .catch((err)=>{
                console.error("데이터 불러오기 실패:", err);
            });
    }, [tabType]);

    //전체 선택 체크박스 처리
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setItem(prev =>
            prev.map(item => ({...item, checked}))
        );
    };
    //개별 체크박스 처리
    const handleItemCheck = (id) => {
        setItem(prev =>
            prev.map(item =>
                tabType === 'report'
                    ? item.reportId === id ? { ...item, checked: !item.checked } : item
                    : item.memberId === id ? { ...item, checked: !item.checked} : item
            )
        );
    };

    const handleRowClick = (item) => {
        setSelectItem(item);
    };

    return (
        <div className="report-check-tab">
            <h2>{tabType === 'member' ? '유저관리 > 유저관리' : '신고관리 > 신고확인'}</h2>
            <table className="report-check-table">
                <thead>
                <tr>
                    <th>게시글 번호</th>
                    <th>신고분류</th>
                    <th>신고내용</th>
                    <th>제목</th>
                    <th>사업자명</th>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={item.every(item => item.checked)}
                        />
                    </th>
                </tr>
                </thead>
                <tbody>
                {item.filter(item => item && (item.reportId || item.memberId)).map((item) =>(
                    <tr key={tabType === 'report' ? item.reportId : item.memberId}>
                        <td onClick={()=>handleRowClick(item)}>
                            {tabType === 'report' ? item.postNum : item.memberName}
                        </td>
                        <td onClick={()=>handleRowClick(item)}>
                            {tabType === 'report' ? item.reasonName : item.memberRole}
                        </td>
                        <td onClick={()=>handleRowClick(item)}>
                            {tabType === 'report' ? item.reportContent : item.memberName}
                        </td>
                        <td onClick={()=>handleRowClick(item)}>
                            {tabType === 'report' ? item.productName : item.memberEmail}
                        </td>
                        <td onClick={()=>handleRowClick(item)}>
                            {tabType === 'report' ? item.reporterName : item.memberTel}
                        </td>
                        <td>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleItemCheck(item.reportId || item.memberId)}
                                className="table-checkbox"
                            />
                        </td>
                    </tr>
                ))}

                </tbody>
            </table>
        </div>
    )
}

export default TableTab;