import React from "react";

function GuideModal({ type, onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <strong className="guide-modal-title">{type === 'seller' ? '판매자 회원가입 안내' : '구매자 회원가입 안내'}</strong>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {type === 'seller' ? (
                        <ol>
                            <p>영근이형(YH)는 허가된 사용자만 이용 가능합니다.</p>
                            <li>이용약관 등 동의: 서비스이용약관과 개인정보처리방침, 3자 정보제공, 마케팅 활용 등에 대한 동의 과정(사업자명과 사업자등록번호를 기준으로 가입 여부를 확인합니다.)</li>
                            <li>기본정보 입력: 신청 및 가입 심사에 필요한 정보를 입력하고 필요 서류를 제출합니다.</li>
                            <li>가입신청서를 제출하면 사이트 운영자의 승인 심사를 거쳐 가입이 확정됩니다.</li>
                            <li>신청 시에 정한 메일과 비밀번호를 이용하여 사이트에 로그인하면 서비스 이용이 가능합니다.</li>
                        </ol>
                    ) : (
                        <ol>
                            <p>영근이형(YH)는 허가된 사용자만 이용 가능합니다.</p>
                            <li>이용약관 등 동의: 서비스이용약관과 개인정보처리방침, 3자 정보제공, 마케팅 활용 등에 대한 동의 과정(사업자명과 사업자등록번호를 기준으로 가입 여부를 확인합니다.)</li>
                            <li>기본정보 입력: 신청 및 가입 심사에 필요한 정보를 입력하고 필요 서류를 제출합니다.</li>
                            <li>가입신청서를 제출하면 사이트 운영자의 승인 심사를 거쳐 가입이 확정됩니다.</li>
                            <li>신청 시에 정한 메일과 비밀번호를 이용하여 사이트에 로그인하면 서비스 이용이 가능합니다.</li>
                        </ol>
                    )}
                </div>

                {/*<div className="modal-footer">*/}
                {/*    <button onClick={onClose}>닫기</button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default GuideModal;