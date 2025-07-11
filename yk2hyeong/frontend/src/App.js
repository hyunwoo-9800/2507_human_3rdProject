import Header from "./components/common/Header"; // 헤더 컴포넌트
import Footer from "./components/common/Footer"; // 푸터 컴포넌트
import AppRouter from "./AppRouter"; // 라우팅을 담당하는 AppRouter 컴포넌트
import { LoginProvider } from "./pages/login/LoginContext"; // 로그인 상태를 전역에서 관리하기 위한 LoginContext 제공자

function App() {
    return (

        // LoginProvider로 감싸서 애플리케이션 전체에서 로그인 상태를 관리
        <LoginProvider>

            {/* 헤더 컴포넌트 (사이트의 상단) */}
            <Header />

            <main>

                {/* AppRouter 컴포넌트를 통해 페이지 라우팅 */}
                <AppRouter />

            </main>

            {/* 푸터 컴포넌트 (사이트의 하단) */}
            <Footer />

        </LoginProvider>

    );
}

export default App;
