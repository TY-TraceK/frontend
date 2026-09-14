import { useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import Place from "./pages/Place/Place";
import ContentDetail from "./pages/content/ContentDetail";
import Header from "./components/Header";
import GNB from "./components/GNB";
import VerifyFab from "./components/VerifyFab";
import VerifyModal from "./components/VerifyModal";
import { KakaoCallback, Login } from "@/pages/Login";
import TokenStorage from "@/api/tokenStorage.js";

function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem("accessToken");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = !!TokenStorage.getAccessToken();

  const handleVerifyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setIsVerifyOpen(true);
  };

  return (
    <>
      <Header />

      <Routes>
        {/* 로그인 없이 접근 가능 */}
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<Place />} />

        <Route path="/content/detail" element={<ContentDetail />} />

        <Route path="/login" element={<Login />} />

        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

        {/* 로그인 후 접근 가능한 페이지 */}
        <Route element={<ProtectedRoute />}></Route>
      </Routes>

      <VerifyFab onClick={handleVerifyClick} />

      <VerifyModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
      />

      <GNB />
    </>
  );
}

export default App;
