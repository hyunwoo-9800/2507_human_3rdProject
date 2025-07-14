import React, {useEffect, useState} from "react";
import ProductImgList from "./ProductImgList";

function UserForm({user}){
    const [form, setForm] = useState({
        memberId: "",
        memberEmail: "",
        memberPwd: "",
        memberName: "",
        memberBname: "",
        memberBnum: "",
        memberShipperName: "",
        memberTel: "",
        memberAddr: "",
        memberDetailAddr: "",
        memberBankCode: "",
        memberAccountNum: "",
        memberRole: "",
        memberStatus: "",
        createdDate: ""
    })

    useEffect(() => {
        if(user){
            setForm(user);
        }
    }, [user]);
    return(
        <form className="product-form-content">
            <label>
                <span>사용자명:</span>
                <input type="text" value={form.memberName} readOnly />
            </label>
            <label>
                <span>회원 역할:</span>
                <input type="text" value={form.memberRole} readOnly />
            </label>
            <label>
                <span>이메일:</span>
                <input type="email" value={form.memberEmail} readOnly />
            </label>
            <label>
                <span>연락처:</span>
                <input type="tel" value={form.memberTel} readOnly />
            </label>
            <label>
                <span>주소:</span>
                <input type="text" value={form.memberAddr} readOnly />
            </label>
            <label>
                <span>상세주소:</span>
                <input type="text" value={form.memberDetailAddr} readOnly />
            </label>
            <label>
                <span>출하자명:</span>
                <input type="text" value={form.memberShipperName} readOnly />
            </label>
            <label>
                <span>사업자명 (또는 상호명):</span>
                <input type="text" value={form.memberBname} readOnly />
            </label>
            <label>
                <span>사업자 등록번호:</span>
                <input type="text" value={form.memberBnum} readOnly />
            </label>
            <label>
                <span>은행코드:</span>
                <input type="text" value={form.memberBankCode} readOnly />
            </label>
            <label>
                <span>계좌번호:</span>
                <input type="text" value={form.memberAccountNum} readOnly />
            </label>
            <label>
                <span>등록일:</span>
                <input type="text" value={form.createdDate} readOnly />
            </label>
        </form>
    )
}

export default UserForm;