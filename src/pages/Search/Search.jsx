import { Link } from 'react-router-dom';
import './Search.css';

function Search() {
  return (
    <main className="search">
      <div className="container">
        {/* MEMO: 아티스트, 미디어, 플레이스 중 검색 결과가 없는 경우, 해당 섹션 hidden 클래스 추가 부탁드립니다. */}
        <section className="artist-area">
          <h2>아티스트</h2>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/10/400/600" alt="" />
                </div>
                <p className="name">artist name</p>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/10/400/600" alt="" />
                </div>
                <p className="name">artist name</p>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/10/400/600" alt="" />
                </div>
                <p className="name">artist name</p>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/10/400/600" alt="" />
                </div>
                <p className="name">artist name</p>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/10/400/600" alt="" />
                </div>
                <p className="name">artist name</p>
              </Link>
            </li>
          </ul>
        </section>
        <section className="media-area">
          <h2>미디어</h2>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/55/400/600" alt="" />
                </div>
                <div className="info">
                  <span className="tag">예능</span>
                  <p className="title">media title</p>
                </div>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/55/400/600" alt="" />
                </div>
                <div className="info">
                  <span className="tag">예능</span>
                  <p className="title">media title</p>
                </div>
              </Link>
            </li>
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/55/400/600" alt="" />
                </div>
                <div className="info">
                  <span className="tag">예능</span>
                  <p className="title">media title</p>
                </div>
              </Link>
            </li>
          </ul>
        </section>
        <section className="place-area">
          <h2>장소</h2>
          <ul className="list">
            <li className="item">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/55/400/600" alt="" />
                </div>
                <div className="info">
                  <span className="tag">부산광역시</span>
                  <p className="title">place title</p>
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Search;
