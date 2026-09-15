import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import './Header.css';

function Header({ type = 'default', title }) {
  return (
    <header className={type}>
      <div className="container">
        {type === 'home' && (
          <h1>
            {/* TODO: 로고 변경 */}
            <Link to="/">K</Link>
          </h1>
        )}

        {type !== 'home' && (
          <button type="button" className="icon">
            <ArrowLeftIcon />
          </button>
        )}

        {type === 'default' && (
          <>
            {title && <h1>{title}</h1>}

            <section className="search">
              <button type="button" className="icon">
                <MagnifyingGlassIcon />
              </button>
            </section>
          </>
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
        )}
      </div>
    </header>
  );
}

export default Header;
