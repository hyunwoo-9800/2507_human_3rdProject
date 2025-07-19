import React from "react";
import Pagination from "../common/Pagination";

function Notification({status}){
    const statusInfo = {
        purchased: {
            icon: "fa-check-circle",
            label: "구매완료",
            class: "status-purchased"
        },
        sold: {
            icon: "fa-check-circle",
            label: "판매완료",
            class: "status-sold"
        },
        approved: {
            icon: "fa-check-circle",
            label: "승인완료",
            class: "status-approved"
        },
        rejected: {
            icon: "fa-circle-xmark",
            label: "승인거부",
            class: "status-rejected"
        },
        reported: {
            icon: "fa-triangle-exclamation",
            label: "신고누적",
            class: "status-reported"
        },
        expired: {
            icon: "fa-triangle-exclamation",
            label: "거래만료",
            class: "status-expired"
        }
    };
    const notifications = [
        { status: "purchased", seller: "천안청과(주)", name: "스테비아 방울토마토", price: "10,500원", date: "yyyy/mm/dd" },
        { status: "sold", buyer: "고라니", address: "아마존 유역", deliveryDate: "yyyy/mm/dd" },
        { status: "approved", approvedDate: "yyyy/mm/dd" },
        { status: "rejected", reason: "칼퇴해야해서" },
        { status: "reported", hidden: true },
        { status: "expired", expiredDate: "yyyy/mm/dd" }
    ];

    return (
        <div className="card-list">
            {notifications.map((item, index) => {
                const current = statusInfo[item.status];

                return (
                    <div className="noti-card" key={index}>
                        <div className="img-container">
                            <img src="/static/images/detailimages/carrot.png" alt="product"/>
                            <div className={`product-img-overlay ${current.class}`}>
                                <i className={`fa-solid ${current.icon}`}></i>
                                {current.label}
                            </div>
                        </div>
                        <div className="noti-card-content">
                            {item.hidden && (
                                <div className="report-row">
                                    <h3 className="reported-message">상품이 숨김처리 되었습니다.</h3>
                                </div>
                            )}

                            <p><strong className="item-label">출하자</strong><span>{item.seller || "천안청과(주)"}</span></p>
                            <p><strong className="item-label">상품명</strong><span>{item.name || "스테비아 방울토마토"}</span></p>
                            <p><strong className="item-label">단위 당 가격</strong><span>{item.price || "10,500원"}</span></p>
                            <p><strong className="item-label">등록일자</strong><span>{item.date || "yyyy/mm/dd"}</span></p>

                            {item.buyer && <p><strong className="item-label">구매자</strong><span>{item.buyer}</span></p>}
                            {item.address && <p><strong className="item-label">배송지</strong><span>{item.address}</span></p>}
                            {item.deliveryDate && <p><strong className="item-label">배송예정일</strong><span>{item.deliveryDate}</span></p>}
                            {item.approvedDate && <p><strong className="item-label">승인날짜</strong><span>{item.approvedDate}</span></p>}
                            {item.reason && (
                                <p className="rejected-reason">
                                    <strong className="item-label reject">거부사유: </strong>
                                    <span>{item.reason}</span>
                                </p>
                            )}
                            {item.expiredDate && <p><strong className="item-label">만료일자</strong><span>{item.expiredDate}</span></p>}

                        </div>
                        <i className="fa-solid fa-xmark" id="delete-btn"></i>
                    </div>
                );
            })}
        </div>
    )
}

export default Notification;