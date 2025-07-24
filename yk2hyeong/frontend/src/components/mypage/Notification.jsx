import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomPagination from "../common/CustomPagination";
import {useNavigate} from "react-router-dom";
import CustomModal from "../common/CustomModal";

function Notification({memberId, readStatus}) {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();
    const [modalConfig, setModalConfig] = useState(null);

    const [products, setProducts] = useState([]);
    const [soldExtraData, setSoldExtraData] = useState([]);

    // 데이터 필터링
    const filterNotifications = notifications.filter((noti) => {
        if(readStatus === "read") return noti.isRead === "Y";
        if(readStatus === "unread") return noti.isRead ==="N";
        return true;
    });

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
            label: "판매중단",
            class: "status-reported"
        },
        expired: {
            icon: "fa-triangle-exclamation",
            label: "거래만료",
            class: "status-expired"
        }
    };
    // 상태별 들어가는 내용 구별
    const columnsByStatus = {
        purchased: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate'],
        sold: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate', 'buyerName', 'deliveryDate','deliveryAddr'],
        approved: ['sellerCompany', 'approvedDate', 'productUnitPrice', 'createdDate', 'productName'],
        rejected: ['sellerCompany', 'productUnitPrice', 'productName', 'createdDate', 'rejectedReason'],
        reported: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate'],
        expired: ['sellerCompany', 'productName', 'productUnitPrice', 'createdDate', 'expiredDate'],
    };


    useEffect(() => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) return;

        // 알림 불러오기
        axios.get(`/api/mypage/notification?memberId=${memberId}`)
            .then(res => {
                console.log("알림 전체 데이터:", res.data);
                if (Array.isArray(res.data)) setNotifications(res.data);
            }).catch(err => console.error("알림 오류:", err));

        // 모든 상품 정보 (공통)
        axios.get(`/api/products?memberId=${memberId}`)
            .then(res => setProducts(res.data))
            .catch(err => console.error("상품 오류:", err));

        // 판매완료일 경우 추가 정보
        axios.get(`/api/mypage/sold-notification?memberId=${memberId}`)
            .then(res => setSoldExtraData(res.data))
            .catch(err => console.error("sold 알림 오류:", err));
    }, [memberId]);
    // 페이지네이션
    const paginatedNotifications = filterNotifications.slice(
        (page - 1)*pageSize,
        page * pageSize
    );
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    // 카드 내 이벤트 추가하는 함수
    const handleCardClick = (item)=>{
        console.log("카드 클릭 이벤트 활성화");
        axios.put(`/api/mypage/notification/read/${item.alarmId}`)
            .then(() => {
            //     isRead 갱신
                setNotifications(prev =>
                    prev.map(noti =>
                        noti.alarmId === item.alarmId ? {...noti, isRead: "Y"} : noti
                    )
                );
            //     상태별 동작 분기
                switch (item.status){
                    case "purchased":
                    case "sold":
                    case "approved":
                        navigate(`/product/${item.productId}`);
                        break;
                    case "rejected":
                        setModalConfig({
                            type: "error",
                            title: "오류 발생",
                            content: `해당 상품은 승인거부되었습니다. <br/>거부사유: ${item.alarmContent || "사유없음"}`,
                            buttonLabel: "확인",
                            showCancel: false,
                            showOnMount: true
                        });
                        break;
                    case "reported":
                        setModalConfig({
                            type: "error",
                            title: "오류 발생",
                            content: `해당 상품은 승인거부되었습니다. 거부사유: ${item.alarmContent || "사유없음"}`,
                            buttonLabel: "확인",
                            showCancel: false,
                            showOnMount: true
                        });
                        break;
                    case "expired":
                        setModalConfig({
                            type: "warning",
                            title: "주의하세요!",
                            content: "해당 상품은 판매기간이 만료되었습니다.",
                            buttonLabel: "확인",
                            buttonColor: "warning",
                            showCancel: false,
                            showOnMount: true
                        });
                        break;

                    default:
                        alert("알 수 없는 알림입니다.");
                }
            })
            .catch(err => {
                console.log("알림 읽음 처리 실패:",err);
            });
    };


    return (
        <div className="card-list">
            {filterNotifications.length === 0 ? (
                <p>알림이 없습니다.</p>
            ) : (
                <>
                    {paginatedNotifications.map((item, index) => {
                        const current = statusInfo[item.status] || statusInfo["reported"];
                        console.log("status:", item.status, "productId:", item.productId);
                        return (
                            <div className={`noti-card ${item.isRead === "Y" ? "read" : ""}`} key={index} onClick={()=>handleCardClick(item)}>
                                <div className="img-container">
                                    <img
                                        src={
                                            item.imageName
                                                ? `/static/images/thumbnail/${item.imageName}`
                                                : "/static/images/thumbnail/carrot.png"
                                        }
                                        alt="product"
                                        onError={(e) => {
                                            if (!e.target.dataset.fallback) {
                                                e.target.src = "/static/images/thumbnail/no-image.png";
                                                e.target.dataset.fallback = "true"; // 플래그 설정
                                            }
                                        }}
                                    />
                                    <div className={`product-img-overlay ${current.class}`}>
                                        <i className={`fa-solid ${current.icon}`}></i>
                                        {current.label}
                                    </div>
                                </div>
                                <div className="noti-card-content">
                                    {item.status === "reported" && (
                                        <div className="report-row">
                                            <h3 className="reported-message">상품이 숨김처리 되었습니다.</h3>
                                            <h3 className="reported-message">신고 사유: </h3>
                                        </div>
                                    )}

                                    {/* 상태별 컬럼 렌더링 */}
                                    {columnsByStatus[item.status]?.map((colKey, idx) => {
                                        let value = "";

                                        if (item.status === "sold") {
                                            console.log("알림 항목:", item);
                                            console.log("현재 status:", item.status);
                                            const extra = soldExtraData.find(e => e.productId === item.productId);
                                            if (extra) {
                                                if (colKey === "deliveryAddr") {
                                                    value = `${extra.memberAddr || ""} ${extra.memberDetailAddr || ""}`;
                                                } else {
                                                    value = extra[colKey];
                                                }
                                            }
                                        } else {
                                            const product = products.find(p => p.productId === item.productId);
                                            if (product) {
                                                if (colKey === "approvedDate" || colKey === "expiredDate") {
                                                    value = item.createdDate?.split(" ")[0];
                                                } else if (colKey === "rejectedReason") {
                                                    value = item.alarmContent;
                                                } else {
                                                    value = product[colKey];
                                                }
                                            }
                                        }

                                        if (!value) value = "-";

                                        const labelMap = {
                                            sellerCompany: "출하자",
                                            deliveryDate: "배송예정일",
                                            productName: "상품명",
                                            createdDate: "등록일자",
                                            buyerName: "구매자",
                                            deliveryAddr: "배송지",
                                            productUnitPrice: "단위 당 가격",
                                            approvedDate: "승인날짜",
                                            rejectedReason: "거부사유",
                                            expiredDate: "만료일자"
                                        };

                                        // 거부사유 항목
                                        if (colKey === "rejectedReason") {
                                            return (
                                                <p className="rejected-reason" key={idx}>
                                                    <strong className="item-label reject">거부사유: </strong>
                                                    <span>{value}</span>
                                                </p>
                                            );
                                        }

                                        return (
                                            <p key={idx}>
                                                <strong className="item-label">{labelMap[colKey]}</strong>
                                                <span>{value}</span>
                                            </p>
                                        );
                                    })}
                                </div>

                                <i
                                    className="fa-solid fa-xmark"
                                    id="delete-btn"
                                    onClick={(e) => {e.stopPropagation();}}
                                >
                                </i>
                            </div>
                        );
                    })}
                    <div className="pagination-box">
                        <CustomPagination
                            defaultCurrent={page}
                            total={filterNotifications.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            )}
            {modalConfig &&(
                <CustomModal
                    {...modalConfig}
                    onOk={()=>setModalConfig(null)}
                />
            )}
        </div>
    );
}

export default Notification;
