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
import logo from '../assets/img/logo.png';

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
  const [showSearchHint, setShowSearchHint] = useState(false);

  const handleSearchSubmit = () => {
    const trimmedKeyword = searchKeyword.trim();

    if (trimmedKeyword.length < 2) {
      if (trimmedKeyword.length === 1) {
        setShowSearchHint(true);
      }
      return;
    }

    // 지도 페이지에서는 관광지 검색만 가능한 별도 API로 처리하고, 지도 화면 안에서 결과를 보여줍니다.
    const targetPath = location.pathname === '/map' ? '/map' : '/search';
    navigate(`${targetPath}?keyword=${encodeURIComponent(trimmedKeyword)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchKeyword(value);

    if (value.trim().length >= 2) {
      setShowSearchHint(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setShowSearchHint(false);
  };

  const renderSearchInput = () => (
    <div className="search-input">
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        value={searchKeyword}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />

      {searchKeyword && (
        <button
          type="button"
          className="icon clear"
          aria-label="검색어 지우기"
          onClick={handleClearSearch}
        >
          <XIcon />
        </button>
      )}

      <button
        type="button"
        className={`icon search-button ${
          searchKeyword.trim().length === 1 ? 'disabled' : ''
        }`}
        aria-label="검색"
        aria-disabled={searchKeyword.trim().length === 1}
        onClick={handleSearchSubmit}
      >
        <MagnifyingGlassIcon />
      </button>

      {showSearchHint && (
        <div className="search-hint">두 글자 이상부터 검색이 가능합니다.</div>
      )}
    </div>
  );

  return (
    <header className={`${type} ${title ? 'has-title' : ''}`}>
      <div className="container">
        {type === 'home' && (
          <h1 className="logo">
            <Link to="/">
              <img src={logo} alt="KRoute" />
            </Link>
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
                renderSearchInput()
              )}
            </section>
          </>
        )}

        {type === 'expanded' && (
          <section className="search">{renderSearchInput()}</section>
        )}

        {type === 'home' && (
          <section className="search">{renderSearchInput()}</section>
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
