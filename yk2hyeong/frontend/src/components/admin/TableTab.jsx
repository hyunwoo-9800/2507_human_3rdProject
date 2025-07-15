import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "../common/Button";
import CustomPagination from "../common/CustomPagination";
import DropboxGroup from "./DropboxGroup";

function TableTab({tabType}){
    const [selectItem, setSelectItem] = useState(null);
    const [page, setPage] = useState(1);

    //테이블 게시글 리스트(db연결)
    const [item, setItem] = useState([]);

    // 유저 테이블 드롭박스 상태값 관리
    const [selectRole, setSelectRole] = useState('전체');
    const [selectStatus, setSelectStatus] = useState('전체');

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

    // 선택한 데이터 삭제
    const handleDelete = () => {
        const selectId = item
            .filter((i) => i.checked)
            .map((i) => tabType === 'report' ? i.reportId : i.memberId);

        if(selectId.length === 0){
            alert("삭제할 항목을 선택하세요.");
            return;
        }
        if(!window.confirm("정말 삭제하시겠습니까?")) return;

        axios
            .post(`/api/${tabType}/delete`, selectId)
            .then(() => {
                alert("삭제되었습니다.");
            //     삭제 후 기존 데이터 불러오기
                const apiUrl = tabType === 'report' ? '/api/report' : '/api/member';
                return axios.get(apiUrl);
            })
            .then((res) => {
                const withCheckbox = res.data.map((p) => ({
                    ...p,
                    checked: false,
                }));
                setItem(withCheckbox);
            })
            .catch((err) => {
                console.error("삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            });
    };

    //코드 정리, td항상 12줄 고정
    const renderDataRow = (item) => {
        const isReport = tabType === "report";
        const key = isReport ? item.reportId : item.memberId;

        const columns = [
            <td onClick={() => handleRowClick(item)}>{isReport ? item.postNum : item.memberName}</td>,
            <td onClick={() => handleRowClick(item)}>{isReport ? item.reasonName : item.memberRoleName}</td>,
            <td onClick={() => handleRowClick(item)}>{isReport ? item.reportContent : item.memberBname}</td>,
            <td onClick={() => handleRowClick(item)}>{isReport ? item.productName : item.memberEmail}</td>,
            <td onClick={() => handleRowClick(item)}>{isReport ? item.reporterName : item.memberStatusName}</td>,
            <td>
                <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleItemCheck(key)}
                    className="table-checkbox"
                />
            </td>
        ];

        const padding = Array.from({ length: 12 - columns.length }, (_, i) => (
            <td key={`pad-${i}`}>&nbsp;</td>
        ));
        return <tr key={key}>{[...columns, ...padding]}</tr>;
    };

    const renderEmptyRows = () => {
        const emptyRowCount = Math.max(0, 12 - item.length);
        return Array.from({ length: emptyRowCount }, (_, rowIdx) => (
            <tr key={`empty-${rowIdx}`}>
                {Array.from({ length: 12 }, (_, i) => (
                    <td key={`empty-td-${rowIdx}-${i}`}>&nbsp;</td>
                ))}
            </tr>
        ));
    };

    // 페이지네이션

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="report-check-tab">
            <h2>{tabType === 'member' ? '유저관리 > 유저관리' : '신고관리 > 신고확인'}</h2>

            {/*member 드롭박스*/}
            {tabType === 'member' &&(
                <DropboxGroup
                    selectStatus={selectStatus}
                    selectRole={selectRole}
                    onRoleChange={setSelectRole}
                    onStatusChange={setSelectStatus}
                    roleOption={[...new Set(item.map(i => i.memberRoleName).filter(Boolean))]}
                    statusOption={[...new Set(item.map(i=>i.memberStatusName).filter(Boolean))]}
                />
            )}

            <table className="report-check-table">
                <colgroup>
                    <col style={{ width: "10%" }} />  {/* 사용자 번호 */}
                    <col style={{ width: "18%" }} />  {/* 분류 */}
                    <col style={{ width: "27%" }} />  {/* 이름 */}
                    <col style={{ width: "20%" }} />  {/* 이메일 */}
                    <col style={{ width: "20%" }} />  {/* 연락처 */}
                    <col style={{ width: "5%" }} />   {/* 체크박스 */}
                </colgroup>
                <thead>
                <tr>
                    <th>{tabType === 'report'?'게시글 번호' :'이름'} </th>
                    <th>{tabType === 'report'?'분류' :'분류'}</th>
                    <th>{tabType === 'report'?'신고내용' :'사업자명'}</th>
                    <th>{tabType === 'report'?'제목' :'이메일'}</th>
                    <th>{tabType === 'report'?'사업자명' :'상태'}</th>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={item.length > 0 && item.every((i) => i.checked)}
                        />
                    </th>
                    {[...Array(6)].map((_,i) => (
                        <th key={`head-pad-${i}`}></th>
                    ))}
                </tr>
                </thead>
                <tbody>
                    {item
                        .filter((i) => i && (i.reportId || i.memberId))
                        .filter((i)=>
                            tabType === 'member'
                                ? (selectRole === '전체' || i.memberRoleName === selectRole) &&
                                (selectStatus === '전체' || i.memberStatusName === selectStatus)
                                : true
                        )
                        .slice((page -1)*10, page * 10)
                        .map(renderDataRow)}
                    {renderEmptyRows()}
                </tbody>
            </table>
            <div className="pagination-wrapper">
                <CustomPagination defaultCurrent={page} total={item.length} pageSize={10} onChange={(p) => setPage(p)}/>
            </div>
            <Button color="error" onClick={handleDelete} className="delete-btn">삭제</Button>
        </div>
    )
}

export default TableTab;