import { Link } from 'react-router-dom';
import { CaretRightIcon } from '@phosphor-icons/react';
import './ContentsHome.css';

function ContentsHome() {
  return (
    <main className="contents-home">
      <div className="container">
        <section className="ranking">
          <div className="header">
            <div className="title">
              <h2>실시간 순위</h2>
              <span className="region accent-text">부산광역시</span>
            </div>
            <Link className="go-to-ranking accent-text" to="/ranking">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="ranking-list">
            <li className="item relative">
              <Link>
                <span className="rank top-1">1</span>
                <div className="image">
                  <img src="https://picsum.photos/id/46/600/400" alt="" />
                </div>
                <p className="name">장소명</p>
              </Link>
            </li>
            <li className="item relative">
              <Link>
                <span className="rank">2</span>
                <div className="image">
                  <img src="https://picsum.photos/id/46/600/400" alt="" />
                </div>
                <p className="name">장소명</p>
              </Link>
            </li>
            <li className="item relative">
              <Link>
                <span className="rank">3</span>
                <div className="image">
                  <img src="https://picsum.photos/id/46/600/400" alt="" />
                </div>
                <p className="name">장소명</p>
              </Link>
            </li>
          </ul>
        </section>
        <section className="favorite-section favorite-artists">
          <div className="header">
            <h3>내가 좋아하는 아티스트</h3>
            <Link className="more-artists accent-text">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/11/400/600" alt="" />
                </div>
                <div className="title">name or title</div>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/11/400/600" alt="" />
                </div>
                <div className="title">name</div>
              </Link>
            </li>
          </ul>
        </section>
        <section className="favorite-section favorite-media">
          <div className="header">
            <h3>내가 좋아하는 미디어</h3>
            <Link className="more-media accent-text">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/11/400/600" alt="" />
                </div>
                <div className="title">name or title</div>
              </Link>
            </li>
          </ul>
        </section>
        <section className="favorite-section favorite-places">
          <div className="header">
            <h3>내가 좋아하는 여행지</h3>
            <Link className="more-places accent-text">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/11/400/600" alt="" />
                </div>
                <div className="title">name or title</div>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default ContentsHome;
