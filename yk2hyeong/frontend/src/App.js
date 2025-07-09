import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, Link } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Member from "./pages/member/Member";
import Product from "./pages/product/Product";
import Header from "./components/common/Header";
import Home from "./pages/index/Home";
import Footer from "./components/common/Footer";
import JoinSelect from "./pages/member/JoinSelect";
import SellerJoinForm from "./pages/member/SellerJoinForm";
import BuyerJoinForm from "./pages/member/BuyerJoinForm";
import Login from "./pages/login/Login";
import NoticePage from "./pages/notice/NoticePage";
import NoticeDetail from "./components/notice/NoticeDetail";
import ComponentCollection from "./pages/ComponentCollection";
import Mypage from "./pages/mypage/Mypage";

function App() {
  const [loginMember, setLoginMember] = useState(null);

  useEffect(() => {
    // 최초 실행 시 백엔드 세션 존재 여부 확인
    const fetchSession = async () => {
      try {
        const res = await axios.get("/api/session-check");
        localStorage.setItem("loginMember", JSON.stringify(res.data)); // 세션 있으면 로컬 저장
      } catch {
        localStorage.removeItem("loginMember");                       // 세션 만료되면 클리어
      }
    };
    fetchSession();
  }, []);

  return (
    <div>
      <header>
        <Header></Header>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/admin" element={<Admin></Admin>}></Route>
          <Route path="/member" element={<Member></Member>}></Route>
          <Route path="/product" element={<Product></Product>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/mypage" element={<Mypage></Mypage>}></Route>
          <Route
            path="/member/join"
            element={<JoinSelect></JoinSelect>}
          ></Route>
          <Route
            path="/member/join/seller"
            element={<SellerJoinForm></SellerJoinForm>}
          ></Route>
          <Route
            path="/member/join/buyer"
            element={<BuyerJoinForm></BuyerJoinForm>}
          ></Route>

          <Route
            path="/notice"
            element={<NoticePage></NoticePage>}
          ></Route>

          <Route
            path="/notice/:id"
            element={<NoticeDetail></NoticeDetail>}
          ></Route>

          <Route
              path="/css"
              element={<ComponentCollection />}
          ></Route>

          </Routes>

      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>

  );
}

export default App;
