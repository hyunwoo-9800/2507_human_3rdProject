import React, {useState, useEffect} from "react";
import ButtonGroup from "./ButtonGroup";
import axios from "axios";

function FormTab(){
    //테이블 게시글 리스트(db연결)
    const [item, setItem] = useState([]);
    useEffect(() => {
        axios.get("/api/product/pending")
            .then((res)=>{
                const withCheckbox = res.data.map((p)=>({
                    ...p,
                    checked:false
                }));
                setItem(withCheckbox);
            })
            .catch((err)=>{
                console.error("상품 데이터 불러오기 실패:", err);
            });
    }, []);

    const handleSeletAll = (e) => {
        const checked = e.target.checked;
        setItem(prev =>
            prev.map(item => ({...item, checked}))
        );
    };
    const handleItemCheck = (id) => {
        setItem(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    return (
        <div className="report-check-tab">
            <h2>게시글관리 &gt; 상품등록승인</h2>
            <div className="form-section">
                <div className="scroll-table-wrapper">
                    <table className="scroll-table">
                        <thead>
                        <tr>
                            <th colSpan="1">전체선택</th>
                            <th>
                                <input
                                    type="checkbox"
                                    id="select-all-checkbox"
                                    onChange={handleSeletAll}
                                    checked={item.every(item => item.checked)}
                                />
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {item.map((item) =>(
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={()=>handleItemCheck(item.id)}
                                        className="table-checkbox"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="product-form">
                    <h2>상품등록페이지 폼 가져오기</h2>

                </div>
            </div>
            <ButtonGroup/>
        </div>

)
}

export default FormTab;