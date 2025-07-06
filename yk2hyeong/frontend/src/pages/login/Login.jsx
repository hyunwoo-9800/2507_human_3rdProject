import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", {
        memberEmail: form.email,
        memberPwd: form.password,
      });
      alert("로그인 성공!");
      // 로그인 성공 후 로컬스토리지 저장 가능
      localStorage.setItem("loginMember", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      console.error("로그인 실패", err);
      setError(err.response?.data || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>로그인</h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <Input
          name="email"
          label="이메일"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          label="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit">로그인</Button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          아직 계정이 없으신가요?{" "}
          <Link to="/member/join" style={{ textDecoration: "underline" }}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
