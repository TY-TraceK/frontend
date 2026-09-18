import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import './Header.css';
import AuthService from '@/api/services/authSerivce.js';

function Header({ type = 'default', title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/';
    AuthService.logout();
  };
  const [searchActive, setSearchActive] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchSubmit = () => {
    const trimmedKeyword = searchKeyword.trim();

    if (!trimmedKeyword) return;

    // 지도 페이지에서는 관광지 검색만 가능한 별도 API로 처리하고, 지도 화면 안에서 결과를 보여줍니다.
    const targetPath = location.pathname === '/map' ? '/map' : '/search';
    navigate(`${targetPath}?keyword=${encodeURIComponent(trimmedKeyword)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <header className={type}>
      <div className="container">
        {type === 'home' && (
          <h1 className="logo">
            {/* TODO: 로고 변경 */}
            <Link to="/">K</Link>
          </h1>
        )}

        {type !== 'home' && (
          <button
            type="button"
            className="icon"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            <CaretLeftIcon />
          </button>
        )}

        {type === 'default' && (
          <>
            {!searchActive && title && <h1 className="title">{title}</h1>}

            <section className={`search ${searchActive ? 'active' : ''}`}>
              {!searchActive ? (
                <button
                  type="button"
                  className="icon"
                  onClick={() => setSearchActive(true)}
                >
                  <MagnifyingGlassIcon />
                </button>
              ) : (
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요."
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <button
                    type="button"
                    className="icon"
                    onClick={() => setSearchActive(false)}
                  >
                    <XIcon />
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {type === 'expanded' && (
          <section className="search">
            <div className="search-input">
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="button" className="icon" onClick={handleSearchSubmit}>
                <MagnifyingGlassIcon />
              </button>
            </div>
          </section>
        )}

        {type === 'home' && (
          <section className="search">
            <div className="search-input">
              <input
                type="text"
                placeholder="검색어를 입력하세요."
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <button type="button" className="icon" onClick={handleSearchSubmit}>
                <MagnifyingGlassIcon />
              </button>
            </div>
          </section>
        )}

        {type === 'mypage' && (
          <>
            <button
              type="button"
              className="icon"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <DotsThreeVerticalIcon />
            </button>

            {isMenuOpen && (
              <div className="profile-menu-tooltip">
                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
