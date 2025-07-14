import React, { useState } from "react";
import CustomModal from "../common/CustomModal";
import Button from "../common/Button";

function ButtonGroup() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState("");

    const handleRegister = () => {
        alert("승인 처리 완료!");
    };

    const handleRejectConfirm = () => {
        if (!reason.trim()) {
            alert("거부 사유를 입력해주세요!");
            return;
        }
        console.log("거부 사유:", reason);
        setIsModalOpen(false);
        setReason("");
    };

    return (
        <div className="btn-container">
            <Button color="primary" onClick={handleRegister}>승인</Button>
            <Button color="error" onClick={() => setIsModalOpen(true)}>거부</Button>

            {isModalOpen && (
                <CustomModal
                    type="error"
                    title="거부"
                    content={
                        <>
                            <p>정말 거부하시겠습니까?</p>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="거부 사유를 입력하세요"
                                style={{ width: "100%", height: "80px", marginTop: "10px" }}
                            />
                        </>
                    }
                    onCancel={() => {
                        setIsModalOpen(false);
                        setReason("");
                    }}
                    onOk={handleRejectConfirm}
                    successMessage="상품등록 거부되었습니다."
                    cancelMessage="상품등록 거부가 취소되었습니다."
                    buttonLabel="확인"
                />
            )}
        </div>
    );
}

export default ButtonGroup;
