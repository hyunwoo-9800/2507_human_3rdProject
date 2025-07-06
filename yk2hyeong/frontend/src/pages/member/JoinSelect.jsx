// src/pages/member/JoinSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function JoinSelect() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>회원가입 유형 선택</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
        {/* 판매자 카드 */}
        <Card
          title="판매자 회원가입"
          footer={
            <Button onClick={() => navigate("/member/join/seller")}>
              회원가입
            </Button>
          }
        >
          <p>직접판매자, 위탁판매자, 시장도매인 등</p>
        </Card>

        {/* 구매자 카드 */}
        <Card
          title="구매자 회원가입"
          footer={
            <Button onClick={() => navigate("/member/join/buyer")}>
              회원가입
            </Button>
          }
        >
          <p>유통업체, 식자재업체, 가공업체 등</p>
        </Card>
      </div>
    </div>
  );
}
