import React from "react";
import {Route, Routes, Link} from "react-router-dom";
import Admin from './pages/admin/Admin';
import Member from "./pages/member/Member";
import Product from "./pages/product/Product";
import Header from "./components/common/Header";


function App() {
    return (
        <div>

        <header>
            <Header />
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
