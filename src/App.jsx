import { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
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
import Header from './components/layout/Header';
import GNB from './components/layout/GNB';
import VerifyFab from './components/verify/VerifyFab';
import VerifyModal from './components/verify/VerifyModal';
import ListTemplate from './components/common/ListTemplate';
import RecentLocationStorage from '@/api/recentLocationStorage.js';
import { KakaoCallback, Login } from '@/pages/Login';
import TokenStorage from '@/api/tokenStorage.js';
import UserService from '@/api/services/userService.js';

function ProtectedRoute() {
  const isLoggedIn = !!localStorage.getItem('accessToken');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();
  const listType = searchParams.get('type');

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
    '/search': {
      type: 'expanded',
    },
    '/profile': {
      type: 'mypage',
    },
    '/list': {
      title:
        listType === 'artist'
          ? '아티스트'
          : listType === 'media'
            ? '콘텐츠'
            : listType === 'place'
              ? '관광지'
              : '리스트',
    },
    '/profile/recent-locations': {
      title: '최근 본 여행지',
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

  useEffect(() => {
    const fetchList = async () => {
      setListItems([]);

      try {
        if (listType === 'place') {
          const data = await UserService.getMyLikedLocations();
          setListItems(data ?? []);
        } else if (listType === 'artist' || listType === 'media') {
          const data = await UserService.getMyFans();

          setListItems(
            listType === 'artist' ? (data.artist ?? []) : (data.content ?? [])
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchList();
  }, [listType]);

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
        <Route path="/archive" element={<Archive />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/profile/recent-locations"
          element={
            <ListTemplate
              items={RecentLocationStorage.getAll()}
              filters={[
                {
                  name: 'region',
                  defaultValue: '전체',
                  options: [
                    '전체',
                    ...new Set(
                      RecentLocationStorage.getAll()
                        .map((item) => item.city)
                        .filter(Boolean)
                    ),
                  ],
                },
              ]}
              filterItems={(items, selectedFilters) =>
                selectedFilters.region === '전체'
                  ? items
                  : items.filter((item) => item.city === selectedFilters.region)
              }
              emptyMessage="최근 본 여행지가 없습니다."
              getItemLink={(item) => `/place?id=${item.id}`}
              getImageUrl={(item) => item.mainImageUrl}
              getImageAlt={(item) => item.name}
              getItemTitle={(item) => item.name}
            />
          }
        />

        {/* 로그인 후 접근 가능한 페이지이나, 퍼블리싱 용이성을 위해 하단에 배치 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/contents" element={<ContentsHome />} />
          <Route
            path="/list"
            element={
              <ListTemplate
                items={listItems}
                emptyMessage={
                  listType === 'artist'
                    ? '아직 좋아하는 아티스트가 없어요.'
                    : listType === 'media'
                      ? '아직 좋아하는 미디어가 없어요.'
                      : listType === 'place'
                        ? '아직 좋아하는 여행지가 없어요.'
                        : '목록이 없습니다.'
                }
                getItemLink={(item) => {
                  if (listType === 'artist') {
                    return `/content/detail?type=artist&id=${item.id}`;
                  }

                  if (listType === 'media') {
                    return `/content/detail?id=${item.id}`;
                  }

                  if (listType === 'place') {
                    return `/place?id=${item.id}`;
                  }

                  return '#';
                }}
                getImageUrl={(item) => {
                  if (listType === 'place') {
                    return item.mainImageUrl;
                  }

                  if (listType === 'artist' || listType === 'media') {
                    return item.pictureUrl;
                  }

                  return null;
                }}
                getImageAlt={(item) => item.name}
                getItemTitle={(item) => item.name}
              />
            }
          />
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
