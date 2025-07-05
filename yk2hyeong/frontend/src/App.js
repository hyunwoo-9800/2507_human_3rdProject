import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Member from "./pages/member/Member";
import Product from "./pages/product/Product";
import Header from "./components/common/Header";
import Home from "./pages/index/Home";
import Footer from "./components/common/Footer";

function App() {
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
        </Routes>
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default App;
