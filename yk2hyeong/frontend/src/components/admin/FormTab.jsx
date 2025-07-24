import React, {useState, useEffect} from "react";
import ButtonGroup from "./ButtonGroup";
import axios from "axios";
import ProductForm from "./ProductForm";
import UserForm from "./UserForm";
import UserApproveButton from "./UserApproveButton";

function FormTab({tabType}){
    const [selectItem, setSelectItem] = useState(null);
    const [item, setItem] = useState([]);
    const selectedItems = item.filter(i => i.checked);
    const idKey = tabType === 'product' ? 'productId' : 'memberId';

    console.log("📦 selectedItems (즉시 출력):", selectedItems);

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
    useEffect(() => {
        console.log("🧪 selectedItems 상태:", selectedItems);
    }, [selectedItems]);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setItem(prev =>
            prev.map(item => ({...item, checked}))
        );
    };

    const handleItemCheck = (id) => {
        setItem(prev => {
            const updated = prev.map(item =>
                item[idKey] === id ? { ...item, checked: !item.checked } : item
            );
            console.log("🧪 handleItemCheck 이후 item:", updated);
            const selected = updated.find(item => item[idKey] === id);
            setSelectItem({ ...selected }); // ← 여기 추가!
            return updated;
        });
    };

    // ✅ tr 클릭 시 체크박스도 같이 토글되도록
    const handleRowClick = (clickedItem) => {
        const updatedChecked = !clickedItem.checked;
        setSelectItem({ ...clickedItem, checked: updatedChecked }); // <- checked 값 반영
        setItem(prev =>
            prev.map(item =>
                item[idKey] === clickedItem[idKey]
                    ? { ...item, checked: updatedChecked }
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
                                    onClick={(e) => {
                                        // 클릭된 게 체크박스면 무시
                                        if (e.target.type === 'checkbox') return;
                                        handleRowClick(row);
                                    }}
                                    style={{ cursor: "pointer" }
                                    }
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
            <div className="form-button-group">
                {tabType ==='product' ? (
                    <ButtonGroup tabType={tabType} selectedItems={selectedItems}/>
                ):(
                    <UserApproveButton user={selectedItems}/>
                )}
            </div>
        </div>
    );
}

export default FormTab;
