import React, { useState } from "react";
import CustomModal from "../common/CustomModal";
import Button from "../common/Button";
import axios from "axios";

function ButtonGroup({selectItem}) {
    const [reason, setReason] = useState("");
    const productId = selectItem?.productId;

    const handleRegister = async () => {
        if (!productId) {
            alert("선택된 상품이 없습니다!");
            return;
        }

        try {
            // 승인 처리 API 호출 (DB 업데이트 + 알림 삽입)
            await axios.post("/api/alarm/approve", {
                productId: productId,
            });

            alert("승인 처리 완료!");
        } catch (err) {
            console.error("승인 요청 실패:", err);
            alert("승인 요청 중 오류가 발생했습니다.");
        }
    };

    const handleReject = async () => {
        if (!reason.trim()) {
            alert("거부 사유를 입력해주세요!");
            return;
        }

        try {
            await sendAlarm({
                type: '012',
                content: reason,
                productId: productId ?? "",  // 없으면 빈 문자열로
            });
            console.log("product_id: ",productId);
            if(!productId){
                alert("선택된 상품이 없습니다")
                return;
            }
            setReason(""); // 성공 시 초기화
        } catch (err) {
            alert("알림 전송에 실패했습니다!");
        }
    };

    const handleCancel = () => {
        setReason(""); // 입력 초기화
    };

    //알림 전송 함수(승인/거부 공통)
    const sendAlarm = async({type, content}) => {
        try{
            const response = await axios.post('/api/alarm/reject',{
                alarmType: type,
                alarmContent: content,
                receiverId: '29E46778F8E3430D9C560B84E4861786',
                productId: productId,
            });
            console.log("알림 전송 성공: ", response.data);
        }catch (err){
            console.log("알림 전송 실패: ", err);
        }
    };

    return (
        <div className="btn-container">
            <Button color="primary" onClick={handleRegister}>승인</Button>

            {/* 버튼+모달 일체형 */}
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
                onOk={handleReject}
                onCancel={handleCancel}
                successMessage="상품등록 거부되었습니다."
                cancelMessage="상품등록 거부가 취소되었습니다."
                buttonLabel="거부"
                useInputMode={true}
            />
        </div>
    );
}

export default ButtonGroup;
