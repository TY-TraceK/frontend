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
import ContentDetail from './pages/content/ContentDetail';
import Ranking from './pages/Ranking/Ranking';
import Map from './pages/Map/Map';
import Search from './pages/Search/Search';
import Archive from './pages/Archive/Archive';
import Profile from './pages/Profile/Profile';
import Header from './components/Header';
import GNB from './components/GNB';
import VerifyFab from './components/VerifyFab';
import VerifyModal from './components/VerifyModal';
import ListTemplate from './components/ListTemplate';
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

  // 페이지별 헤더 타입 (없을 경우 default)
  const headerConfig = {
    '/': {
      type: 'home',
    },
    '/ranking': {
      title: '실시간 순위 Top 10',
    },
    '/contents': {
      title: '콘텐츠 홈',
    },
    '/map': {
      type: 'expanded',
    },
    '/profile': {
      type: 'mypage',
    },
    '/list': {
      title: '리스트 페이지 타이틀',
    },
  };

  const header = headerConfig[location.pathname] ?? {
    type: 'default',
  };

  const handleVerifyClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setIsVerifyOpen(true);
  };

  return (
    <>
      <Header {...header} />

      <Routes>
        {/* 로그인 없이 접근 가능 */}
        <Route path="/" element={<Home />} />
        <Route path="/place" element={<Place />} />
        <Route path="/content/detail" element={<ContentDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/search" element={<Search />} />
        <Route path="/map" element={<Map />} />

        {/* 로그인 후 접근 가능한 페이지이나, 퍼블리싱 용이성을 위해 하단에 배치 */}
        <Route path="/archive" element={<Archive />} />
        <Route path="/profile" element={<Profile />} />

        {/* 로그인 후 접근 가능한 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/contents" element={<ContentsHome />} />
          <Route path="/list" element={<ListTemplate />} />
        </Route>
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
