import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";

export default function MemberJoinForm({ role }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    shipperName: "",
    bnum: "",
    bname: "",
    bankname: "",
    accnum: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      memberEmail: form.email,
      memberPwd: form.password,
      memberName: form.name,
      memberTel: form.phone,
      memberAddr: form.address,
      memberRole: role,
      memberStatus: "미승인",
      memberShipperName: form.shipperName,
      memberBnum: form.bnum,
      memberBname: form.bname,
      memberBankname: form.bankname,
      memberAccnum: form.accnum,
    };

    console.log("전송 데이터 확인:", dataToSend);

    try {
      const res = await axios.post("/api/member/register", dataToSend);
      alert("회원가입 성공! 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패", err);
      setError("회원가입에 실패했습니다. 이메일 중복 등을 확인해주세요.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{role === "SELLER" ? "판매자" : "구매자"} 회원가입</h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <Input
          label="이름"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          label="이메일"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <Input
          label="전화번호"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="주소"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <Input
          label="출하자 명"
          name="shipperName"
          value={form.shipperName}
          onChange={handleChange}
        />

        <Input
          label="사업자 번호"
          name="bnum"
          value={form.bnum}
          onChange={handleChange}
        />

        <Input
          label="사업자 명"
          name="bname"
          value={form.bname}
          onChange={handleChange}
        />

        <Select
          label="은행"
          name="bankname"
          value={form.bankname}
          onChange={handleChange}
          options={[
            { label: "선택", value: "" },
            { label: "농협", value: "농협" },
            { label: "국민은행", value: "국민은행" },
            { label: "신한은행", value: "신한은행" },
            { label: "영근론", value: "영근론" },
          ]}
        />

        <Input
          label="계좌번호"
          name="accnum"
          value={form.accnum}
          onChange={handleChange}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button type="submit">회원가입</Button>
      </form>
    </div>
  );
}
