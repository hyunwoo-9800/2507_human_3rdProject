import React, {useState, useEffect} from "react";
import ButtonGroup from "./ButtonGroup";
import axios from "axios";
import ProductForm from "./ProductForm";
import UserForm from "./UserForm";

function FormTab({tabType}){
    //테이블 게시글 눌렀을 때 오른쪽에 상품등록폼 띄우기
    const [selectItem, setSelectItem] = useState(null);

    //테이블 게시글 리스트(db연결)
    const [item, setItem] = useState([]);

    useEffect(() => {

        setItem([]); //이전 데이터 초기화
        setSelectItem(null);// 선택한 항목 초기화
        const apiUrl = tabType === 'product' ? '/api/product/pending' : '/api/member/pending';
        axios.get(apiUrl)
            .then((res)=>{
                console.log("불러온 데이터:" , res.data);
                const withCheckbox = res.data.map((p)=>({
                    ...p,
                    checked:false
                }));
                setItem(withCheckbox);
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
                tabType === 'product'
                    ? item.productId === id ? { ...item, checked: !item.checked } : item
                    : item.userId === id ? { ...item, checked: !item.checked} : item
            )
        );
    };

    const handleRowClick = (item) => {
        setSelectItem(item);
    };

    return (
        <div className="report-check-tab">
            <h2>{tabType === 'product' ? '게시글관리 > 상품등록승인' : '유저관리 > 회원가입승인'}</h2>
            <div className="form-section">
                <div className="scroll-table-wrapper">
                    <table className="scroll-table">
                        <thead>
                        <tr>
                            <th
                                colSpan="1"
                                className="checkbox-title"
                            >
                                전체선택
                            </th>
                            <th>
                                <input
                                    type="checkbox"
                                    id="select-all-checkbox"
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setItem(prev =>
                                            prev.map(item => ({...item, checked}))
                                        );
                                    }}
                                    checked={item.every(item => item.checked)}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.map((item) =>(
                            <tr key={tabType === 'product' ? item.productId : item.memberId}>
                                <td onClick={()=>handleRowClick(item)}>
                                    {tabType === 'product' ? item.productName : item.memberName}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => {
                                            setItem(prev =>
                                                prev.map(i =>
                                                    tabType === 'product'
                                                        ? i.productId === item.productId ? { ...i, checked: !i.checked } : i
                                                        : i.memberId === item.memberId ? { ...i, checked: !i.checked } : i
                                                )
                                            );
                                        }}
                                        className="table-checkbox"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="product-form">
                    {tabType === 'product' ? <ProductForm product={selectItem}/> : <UserForm user={selectItem}/>}
                </div>
            </div>
            <ButtonGroup/>
        </div>

)
}

export default FormTab;