import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import './Header.css';

function Header({ type = 'default', title }) {
  const [searchActive, setSearchActive] = useState(false);

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
          <button type="button" className="icon">
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
                  <input type="text" placeholder="검색어를 입력하세요." />
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
              <input type="text" placeholder="검색어를 입력하세요." />
              <button type="button" className="icon">
                <MagnifyingGlassIcon />
              </button>
            </div>
          </section>
        )}

        {type === 'home' && (
          <section className="search">
            <div className="search-input">
              <input type="text" placeholder="검색어를 입력하세요." />
              <button type="button" className="icon">
                <MagnifyingGlassIcon />
              </button>
            </div>
          </section>
        )}

        {type === 'mypage' && (
          <button type="button" className="icon">
            <DotsThreeVerticalIcon />
          </button>
          // TODO: 로그아웃, 회원 탈퇴, 고객센터
        )}
      </div>
    </header>
  );
}

export default Header;
