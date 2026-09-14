import { Link } from 'react-router-dom';
import './Ranking.css';
import {
  CaretDownIcon,
  CaretUpIcon,
  MapPinSimpleAreaIcon,
} from '@phosphor-icons/react';

import rank1 from '../../assets/ranking/rank-1.svg';

function Ranking() {
  return (
    <main className="ranking">
      <div className="container">
        <section className="ranking-filter">
          <span className="filter">필터 위치: 부산광역시</span>

          <div className="category-tabs">
            <div className="category-list">
              <button className="tab active">전체</button>
              <button className="tab">관광지/명소</button>
              <button className="tab">문화시설</button>
              <button className="tab">축제/행사</button>
              <button className="tab">촬영지</button>
              <button className="tab">음식점</button>
              <button className="tab">카페</button>
              <button className="tab">숙박</button>
              <button className="tab">쇼핑</button>
              <button className="tab">기타</button>
            </div>

            <button className="toggle">
              <span className="icon">
                <CaretDownIcon />
              </span>
            </button>
          </div>
        </section>
        <section className="ranking-section">
          {/* Top 3 */}
          <ol className="list top3-list">
            {/* 1위 */}
            <li className="item rank-1">
              <Link to="#">
                <span className="rank">
                  <img src={rank1} alt="1위" />
                </span>

                <div className="image">
                  <img src="https://picsum.photos/id/833/600/400" alt="" />
                </div>

                <div className="info">
                  <div className="place">
                    <span className="tag">부산광역시</span>
                    <span className="title">송도해상케이블카</span>
                  </div>

                  <span className="verify-count accent-text">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    N,NNN건
                  </span>
                </div>
              </Link>
            </li>
          </ol>

          {/* 4~10위 */}
          <ol className="list default-list" start="4">
            <li className="item">
              <Link to="#">
                <span className="rank">4</span>

                <div className="image">
                  <img src="https://picsum.photos/id/836/600/400" alt="" />
                </div>

                <div className="info">
                  <div className="place">
                    <span className="tag">부산광역시</span>
                    <span className="title">송도해상케이블카</span>
                  </div>

                  <span className="verify-count accent-text">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    N,NNN건
                  </span>
                </div>
              </Link>
            </li>
            <li className="item">
              <Link to="#">
                <span className="rank">4</span>

                <div className="image">
                  <img src="https://picsum.photos/id/836/600/400" alt="" />
                </div>

                <div className="info">
                  <div className="place">
                    <span className="tag">부산광역시</span>
                    <span className="title">송도해상케이블카</span>
                  </div>

                  <span className="verify-count accent-text">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    N,NNN건
                  </span>
                </div>
              </Link>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}

export default Ranking;
