import React, {useState, useEffect} from "react";
import ButtonGroup from "./ButtonGroup";
import axios from "axios";
import ProductForm from "./ProductForm";
import UserForm from "./UserForm";
import UserApproveButton from "./UserApproveButton";

function FormTab({tabType}){
    const [selectItem, setSelectItem] = useState(null);
    const [item, setItem] = useState([]);

    const idKey = tabType === 'product' ? 'productId' : 'memberId';

    useEffect(() => {
        setItem([]);
        setSelectItem(null);
        const apiUrl = tabType === 'product' ? '/api/product/pending' : '/api/member/pending';
        axios.get(apiUrl)
            .then((res) => {
                const withCheckbox = res.data.map(p => ({
                    ...p,
                    checked: false
                }));
                setItem(withCheckbox);
            })
            .catch((err) => {
                console.error("데이터 불러오기 실패:", err);
            });
    }, [tabType]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setItem(prev =>
            prev.map(item => ({...item, checked}))
        );
    };

    const handleItemCheck = (id) => {
        setItem(prev =>
            prev.map(item =>
                item[idKey] === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    // ✅ tr 클릭 시 체크박스도 같이 토글되도록
    const handleRowClick = (clickedItem) => {
        setSelectItem(clickedItem);
        setItem(prev =>
            prev.map(item =>
                item[idKey] === clickedItem[idKey]
                    ? { ...item, checked: !item.checked }
                    : item
            )
        );
    };

    return (
        <div className="report-check-tab">
            <h2>{tabType === 'product' ? '게시글관리 > 상품등록승인' : '유저관리 > 회원가입승인'}</h2>
            <div className="form-section">
                <div className="scroll-table-wrapper">
                    <table className="scroll-table">
                        <thead>
                        <tr>
                            <th className="checkbox-title">전체선택</th>
                            <th>
                                <input
                                    type="checkbox"
                                    id="select-all-checkbox"
                                    onChange={handleSelectAll}
                                    checked={item.length > 0 && item.every(item => item.checked)}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.map((row) => {
                            const rowId = row[idKey];
                            return (
                                <tr
                                    key={rowId}
                                    onClick={() => handleRowClick(row)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{tabType === 'product' ? row.productName : row.memberName}</td>
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={row.checked}
                                            onChange={() => handleItemCheck(rowId)}
                                            className="table-checkbox"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="product-form">
                    {tabType === 'product'
                        ? <ProductForm product={selectItem}/>
                        : <UserForm user={selectItem}/>}
                </div>
            </div>
            {tabType ==='product' ? (
                <ButtonGroup tabType={tabType} selectItem={selectItem}/>
            ):(
                <UserApproveButton user={selectItem}/>
            )}

        </div>
    );
}

export default FormTab;
