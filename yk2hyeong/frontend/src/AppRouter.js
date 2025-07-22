import {Routes, Route} from 'react-router-dom'
import Home from './pages/index/Home' // 홈 페이지
import Admin from './pages/admin/Admin' // 관리자 페이지
import Mypage from './pages/mypage/Mypage' // 마이 페이지
import NoticePage from './pages/notice/NoticePage' // 공지사항 목록 페이지
import NoticeDetail from './components/notice/NoticeDetail' // 공지사항 상세 페이지
import NoticeForm from './components/notice/NoticeForm' // 공지사항 작성 페이지
import NoticeEdit from './components/notice/NoticeEdit' // 공지사항 수정 페이지
import ComponentCollection from './pages/ComponentCollection' // CSS 컴포넌트 모음 페이지
import Login from './pages/login/Login' // 로그인 페이지
import SignupRoleSelect from './pages/member/SignupRoleSelect' // 회원가입 역할 선택 페이지
import SellerTerms from './pages/member/SellerTerms' // 판매자 약관 페이지
import BuyerTerms from './pages/member/BuyerTerms' // 구매자 약관 페이지
import SignupForm from './pages/member/SignupForm' // 회원가입 폼 페이지
import EditMember from "./components/mypage/EditMember";
import FindId from './pages/login/FindId'
import FindPassword from './pages/login/FindPassword'
import ResetPassword from './pages/login/ResetPassword'
import ProductList from "./pages/product/ProductList";
import PriceChartPage from "./pages/chart/PriceChartPage";
import ProductDetail from "./pages/product/ProductDetail";
import ProductRegister from "./pages/product/ProductRegister";
import SiteInfo from "./pages/about/SiteInfo";
import PaymentSuccessPage from "./pages/product/PaymentSuccessPage";

export default function AppRouter() {
    return (
        <Routes>
            {/* 기본 홈 페이지 */}
            <Route path="/" element={<Home/>}/>

            {/*사이트소개 페이지*/}
            <Route path="/siteinfo" element={<SiteInfo/>}/>

            {/* 관리자 페이지 */}
            <Route path="/admin" element={<Admin/>}/>

            {/* 마이 페이지 */}
            <Route path="/mypage" element={<Mypage/>}/>

            {/* 공지사항 목록 페이지 */}
            <Route path="/notice" element={<NoticePage/>}/>

            {/* 공지사항 상세 페이지 (동적 경로 사용) */}
            <Route path="/notice/:id" element={<NoticeDetail/>}/>

            {/* 공지사항 작성 페이지 */}
            <Route path="/notice/write" element={<NoticeForm/>}/>

            {/* 공지사항 수정 페이지 (동적 경로 사용) */}
            <Route path="/notice/edit/:id" element={<NoticeEdit/>}/>

            {/* CSS 컴포넌트 모음 페이지 */}
            <Route path="/css" element={<ComponentCollection/>}/>

            {/* 로그인 페이지 */}
            <Route path="/login" element={<Login/>}/>

            {/* 아이디 찾기 페이지 */}
            <Route path="/findId" element={<FindId/>}/>

            {/* 비밀번호 찾기 페이지 */}
            <Route path="/findPwd" element={<FindPassword/>}/>

            {/* 비밀번호 재설정 페이지 */}
            <Route path="/findPwd" element={<ResetPassword/>}/>

            {/* 회원가입 역할 선택 페이지 */}
            <Route path="/signup" element={<SignupRoleSelect/>}/>

            {/* 판매자 약관 페이지 */}
            <Route path="/signup/seller" element={<SellerTerms/>}/>

            {/* 구매자 약관 페이지 */}
            <Route path="/signup/buyer" element={<BuyerTerms/>}/>

            {/* 판매자 회원가입 폼 페이지 */}
            <Route path="/signup/seller/form" element={<SignupForm role="SELLER"/>}/>

            {/* 구매자 회원가입 폼 페이지 */}
            <Route path="/signup/buyer/form" element={<SignupForm role="BUYER"/>}/>

            {/* 상품리스트 페이지 */}
            <Route path="/productlist" element={<ProductList/>}/>

            {/* 시세 추이 페이지 */}
            <Route path="/chart" element={<PriceChartPage/>}/>

            {/* 상품상세 페이지 */}
            <Route path="/product/:productId" element={<ProductDetail/>}/>

            {/* 상품등록 페이지 */}
            <Route path="/product/register" element={<ProductRegister/>}/>

            {/* 회원정보수정 페이지 */}
            <Route path="/EditMember" element={<EditMember/>}/>

            <Route path="/payment/success" element={<PaymentSuccessPage/>}/>

            {/*<Route path="/payment/fail" element={<PaymentFailPage/>}/>*/}

        </Routes>
    )
}
