import React, { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Notification from "../../components/mypage/Notification";
import PurchaseProduct from "../../components/mypage/PurchaseProduct";
import RegisteredProduct from "../../components/mypage/RegisteredProduct";
import WishlistProduct from "../../components/mypage/WishlistProduct";
import SelectGroup from "../../components/mypage/SelectGroup";
import RadioGroup from "../../components/mypage/RadioGroup";
import "./Mypage.css";

function Mypage() {
    const [menuTab, setMenuTab] = useState("regist");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState("total");

    const [readStatus, setReadStatus] = useState("total");
    const memberId = localStorage.getItem("memberId");

    return (
        <div>
            <main>
                <div className="menu-bar">
                    <button
                        className="regist-product"
                        onClick={() => setMenuTab("regist")}>등록한 상품</button>
                    <button
                        className="purchase-product"
                        onClick={() => setMenuTab("purchase")}>구매한 상품</button>
                    <button
                        className="wishlist-product"
                        onClick={() => setMenuTab("wishlist")}>관심 상품</button>
                    <button
                        className="notification"
                        onClick={() => setMenuTab("notification")}>알림</button>
                </div>

                {menuTab === "notification" ? (
                    <RadioGroup
                        readStatus={readStatus}
                        setReadStatus={setReadStatus}
                    />
                ) : (
                    <SelectGroup
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        onYearChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        onMonthChange={(e) => setSelectedMonth(e.target.value)}
                    />
                )}

                <div className="content">
                    {menuTab === "regist" && (
                        <RegisteredProduct
                            selectedYear={selectedYear}
                            selectedMonth={selectedMonth}
                        />
                    )}
                    {menuTab === "purchase" && (
                        <PurchaseProduct
                            selectedYear={selectedYear}
                            selectedMonth={selectedMonth}
                        />
                    )}
                    {menuTab === "wishlist" && (
                        <WishlistProduct
                            selectedYear={selectedYear}
                            selectedMonth={selectedMonth}
                        />
                    )}
                    {menuTab === "notification" && <Notification memberId={memberId} readStatus={readStatus}/>}
                </div>
            </main>
        </div>
    );
}

export default Mypage;
