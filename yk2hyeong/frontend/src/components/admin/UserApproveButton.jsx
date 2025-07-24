import React from "react";
import Button from "../common/Button";
import axios from "axios";

function UserApproveButton({ user }) {
    const handleApprove = async () => {
        if (!user || !user.length === 0) {
            alert("선택된 회원이 없습니다");
            return;
        }

        const memberIds = user.map(user => user.memberId);

        try {
            await axios.put("/api/member/approve",memberIds);
            alert("회원 승인 완료");
        } catch (err) {
            console.error("회원 승인 실패:", err);
            alert("회원 승인 중 오류가 발생했습니다.");
        }
    };

    return (
        <Button color="primary" onClick={handleApprove}>
            승인
        </Button>
    );
}

export default UserApproveButton;
