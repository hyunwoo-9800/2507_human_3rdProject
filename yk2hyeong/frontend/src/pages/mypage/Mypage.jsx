import React,{useState} from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Notification from "./components/Notification";
import PurchaseProduct from "./components/PurchaseProduct";
import RegisteredProduct from "./components/RegisteredProduct";
import WishlistProduct from "./components/WishlistProduct";
import SelectGroup from "./components/SelectGroup";
import Pagination from "../../components/common/Pagination";
import RadioGroup from "./components/RadioGroup";
import "./Mypage.css";

function Mypage(){

    const [menuTab,setMenuTab] = useState("regist");
    const [currentPage, setCurrentPage] = useState(1);
    return(
        <div>
            <main>
                <div className="menu-bar">
                    <button
                        className="regist-product"
                        onClick={()=>setMenuTab("regist")}>
                        등록한 상품
                    </button>
                    <button
                        className="purchase-product"
                        onClick={()=>setMenuTab("purchase")}>
                        구매한 상품
                    </button>
                    <button
                        className="wishlist-product"
                        onClick={()=>setMenuTab("wishlist")}>
                        관심 상품
                    </button>
                    <button
                        className="notification"
                        onClick={()=>setMenuTab("notification")}>
                        알림
                    </button>
                </div>
                {menuTab ==="notification"?<RadioGroup/>:<SelectGroup/>}
                <div className="content">
                    {menuTab === "regist" && <RegisteredProduct/>}
                    {menuTab === "purchase" && <PurchaseProduct/>}
                    {menuTab === "wishlist" && <WishlistProduct/>}
                    {menuTab === "notification" && <Notification/>}
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={5}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </main>
        </div>
    )
}

export default Mypage;