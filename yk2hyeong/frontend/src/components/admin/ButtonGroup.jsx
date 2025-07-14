// import React from "react";
// import CustomModal from "../common/CustomModal";
// import Button from "../common/Button";
//
// function ButtonGroup(){
//     return (
//         <div className="btn-container">
//             <Button color="primary" onClick={handleRegister}>승인</Button>
//             <CustomModal
//                 type="error"
//                 title="거부"
//                 content={
//                     <>
//                         <p>정말 삭제하시겠습니까?</p>
//                         <textarea
//                             value={reason}
//                             onChange={(e) => setReason(e.target.value)}
//                             placeholder="거부 사유를 입력하세요"
//                         />
//                     </>
//                 }
//                 onCancel={() => console.log('등록거부 취소')}
//                 onOk={() => console.log('등록 처리 로직 실행')}
//                 successMessage="상품등록 거부되었습니다."
//                 cancelMessage="상품등록 거부가 취소되었습니다."
//                 buttonLabel="거부"/>
//         </div>
//     )
// }
//
// export default ButtonGroup;