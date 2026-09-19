import { Link, useLocation } from 'react-router-dom';
import './GNB.css';
import {
  ArchiveIcon,
  HouseIcon,
  MapTrifoldIcon,
  StarIcon,
  UserIcon,
} from '@phosphor-icons/react';

function GNB() {
  const location = useLocation();

  return (
    <nav>
      <div className="container">
        <section className="navigation">
          <Link
            to="/"
            className={`menu home ${location.pathname === '/' ? 'current' : ''}`}
          >
            <span className="icon">
              <HouseIcon />
            </span>
            <span className="menu-name">홈</span>
          </Link>

          <Link
            to="/contents"
            className={`menu contents ${
              location.pathname.startsWith('/contents') ||
              location.pathname.startsWith('/content') ||
              location.pathname.startsWith('/place')
                ? 'current'
                : ''
            }`}
          >
            <span className="icon">
              <StarIcon />
            </span>
            <span className="menu-name">콘텐츠</span>
          </Link>

          <Link
            to="/map"
            className={`menu map ${
              location.pathname.startsWith('/map') ? 'current' : ''
            }`}
          >
            <span className="icon">
              <MapTrifoldIcon />
            </span>
            <span className="menu-name">지도</span>
          </Link>

          <Link
            to="/archive"
            className={`menu archive ${
              location.pathname.startsWith('/archive') ? 'current' : ''
            }`}
          >
            <span className="icon">
              <ArchiveIcon />
            </span>
            <span className="menu-name">아카이브</span>
          </Link>

          <Link
            to="/profile"
            className={`menu profile ${
              location.pathname.startsWith('/profile') ? 'current' : ''
            }`}
          >
            <span className="icon">
              <UserIcon />
            </span>
            <span className="menu-name">프로필</span>
          </Link>
        </section>
      </div>
    </nav>
  );
}

export default GNB;
