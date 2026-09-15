import {
  BookmarkSimpleIcon,
  CaretRightIcon,
  HeartIcon,
  MapPinSimpleAreaIcon,
  PencilSimpleLineIcon,
  StarIcon,
} from '@phosphor-icons/react';
import './Profile.css';
import { Link } from 'react-router-dom';

function Profile() {
  return (
    <main className="profile">
      <div className="container">
        <section className="user-info">
          <div className="image">
            <img src="https://picsum.photos/id/121/400/600" alt="" />
          </div>
          <h2>NICKNAME</h2>
          <button className="icon profile-edit">
            <PencilSimpleLineIcon />
          </button>
        </section>
        <section className="recent-place">
          <div className="title-row">
            <h3 className="title">최근 본 여행지</h3>
            <Link to="#" className="accent-text">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="list">
            <li className="item">
              <Link to="#">
                <div className="image">
                  <img src="https://picsum.photos/id/123/600/400" alt="" />
                </div>
                <span className="location">부산광역시</span>
                <p className="name ellipsis-1">
                  가게명가게명가게명가게명가게명가게명
                </p>
              </Link>
            </li>
            <li className="item">
              <Link to="#">
                <div className="image">
                  <img src="https://picsum.photos/id/123/600/400" alt="" />
                </div>
                <span className="location">부산광역시</span>
                <p className="name ellipsis-1">
                  가게명가게명가게명가게명가게명가게명
                </p>
              </Link>
            </li>
            <li className="item">
              <Link to="#">
                <div className="image">
                  <img src="https://picsum.photos/id/123/600/400" alt="" />
                </div>
                <span className="location">부산광역시</span>
                <p className="name ellipsis-1">
                  가게명가게명가게명가게명가게명가게명
                </p>
              </Link>
            </li>
            <li className="item">
              <Link to="#">
                <div className="image">
                  <img src="https://picsum.photos/id/123/600/400" alt="" />
                </div>
                <span className="location">부산광역시</span>
                <p className="name ellipsis-1">
                  가게명가게명가게명가게명가게명가게명
                </p>
              </Link>
            </li>
          </ul>
        </section>
        <section className="statistics">
          <div className="fan-stat stat-box">
            <span className="icon star">
              <StarIcon weight="fill" />
            </span>
            <p className="number">8</p>
            <p className="description">아티스트 & 미디어</p>
          </div>
          <div className="verify-stat stat-box">
            <span className="icon accent-text">
              <MapPinSimpleAreaIcon weight="fill" />
            </span>
            <p className="number">4</p>
            <p className="description">방문 인증한 장소</p>
          </div>
          <div className="haert-stat stat-box">
            <span className="icon heart">
              <HeartIcon weight="fill" />
            </span>
            <p className="number">127</p>
            <p className="description">좋아한 장소</p>
          </div>
          <div className="bookmark-stat stat-box">
            <span className="icon bookmark">
              <BookmarkSimpleIcon weight="fill" />
            </span>
            <p className="number">26</p>
            <p className="description">북마크한 장소</p>
          </div>
        </section>
        <section className="recent-verify-place">
          <h3>최근 방문 인증</h3>
          <div className="verify">
            <div className="image">
              <img src="https://picsum.photos/id/128/400/600" alt="" />
            </div>
            <div className="info">
              <span className="tag">부산광역시</span>
              <h4>송도해수욕장</h4>
              <p className="verify-content">
                <span className="artist">김종국 외 n명</span>
                <span className="media">런닝맨</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;
