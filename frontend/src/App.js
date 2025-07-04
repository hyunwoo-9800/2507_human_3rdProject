import React from "react";
import Admin from "./components/admin/Admin";
import Member from "./components/member/Member";
import Product from "./components/product/Product";
import {Route, Routes, Link} from "react-router-dom";

function App() {
    return (
        <div>

        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">홈</Link>
                    </li>
                    <li>
                        <Link to="/admin">관리자페이지</Link>
                    </li>
                    <li>
                        <Link to="/member">회원 페이지</Link>
                    </li>
                    <li>
                        <Link to="/product">상품 페이지</Link>
                    </li>
                </ul>
            </nav>
        </header>

        <main>
            <Routes>
                <Route path="/admin" element={<Admin></Admin>}></Route>
                <Route path="/member" element={<Member></Member>}></Route>
                <Route path="/product" element={<Product></Product>}></Route>
            </Routes>
        </main>

            <footer>
                <p>&copy; 리액트 테스트 페이지</p>
            </footer>

        </div>
    );
}

export default App;
