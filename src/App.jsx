import { useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import Home from './pages/Home/Home';
import Place from './pages/Place/Place';
import ContentsHome from './pages/content/ContentsHome';
import ContentsList from './pages/content/ContentsList';
import ContentDetail from './pages/content/ContentDetail';
import Ranking from './pages/Ranking/Ranking';
import Search from './pages/Search/Search';
import Header from './components/Header';
import GNB from './components/GNB';
import VerifyFab from './components/VerifyFab';
import VerifyModal from './components/VerifyModal';
import { KakaoCallback, Login } from '@/pages/Login';
import TokenStorage from '@/api/tokenStorage.js';

function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!TokenStorage.getAccessToken();

  // 공통 Header를 사용하지 않는 페이지
  const hideHeader = location.pathname === '/ranking';

  const handleVerifyClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setIsVerifyOpen(true);
  };

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        {/* 로그인 없이 접근 가능 */}
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<Place />} />
        <Route path="/content/detail" element={<ContentDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/search" element={<Search />} />

        {/* 로그인 후 접근 가능한 페이지이나, 퍼블리싱 용이성을 위해 하단에 배치 */}
        <Route path="/contents" element={<ContentsHome />} />
        <Route path="/contents/list" element={<ContentsList />} />

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
