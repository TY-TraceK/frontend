import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  BookmarkSimpleIcon,
  CaretRightIcon,
  MapPinIcon,
  MapPinSimpleAreaIcon,
} from '@phosphor-icons/react';

import RankingService from '@/api/services/rankingService.js';

import './Home.css';
import { useProfile } from '@/hooks/userContext.jsx';

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [topRankings, setTopRankings] = useState([]);
  const [contentCuration, setContentCuration] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const { user, setProfileData } = useProfile();

  useEffect(() => {
    if (isLoggedIn && user == null) {
      setProfileData();
    }
  }, []);
  // 여행지 TOP 3 조회
  useEffect(() => {
    const fetchTopRankings = async () => {
      try {
        const data = await RankingService.getLocationRanking({
          topN: 3,
        });

        setTopRankings((data.rankings ?? []).slice(0, 3));
      } catch (error) {
        console.error('TOP3 랭킹 조회 실패:', error);
      }
    };

    fetchTopRankings();
  }, []);

  useEffect(() => {
    const fetchContentCuration = async () => {
      try {
        const data = await RankingService.getContentCuration();
        setContentCuration(data);
      } catch (error) {
        console.error('콘텐츠 큐레이션 조회 실패:', error);
        setContentCuration(null);
      }
    };

    fetchContentCuration();
  }, []);

  return (
    <main className="home">
      <div className="container">
        {user == null ? (
          <section className="login-prompt">
            <p>
              {/* MEMO: 로그인 클릭 시, 로그인 페이지로 이동 */}
              <span className="accent-text" onClick={() => navigate('/login')}>
                로그인
              </span>
              하고
            </p>
            <p>좋아하는 콘텐츠를 저장해보세요!</p>
          </section>
        ) : (
          <section className="personalized-content">
            <div className="title">
              <p>
                <span className="accent-text">{user?.nickName}</span> 님,
              </p>
              <p>오늘은 어떤 화면 속으로 여행 가볼까요?</p>
            </div>
            <div className="banner">
              <Link>
                {/* MEMO: 팬인 아티스트/미디어 콘텐츠 중 여행지가 추가된 내역이 있다면,
                아티스트/미디어 콘텐츠 홈으로 이동 */}
                팬인 콘텐츠에 새로운 여행지가 추가됐어요.
                <span className="icon">
                  <CaretRightIcon />
                </span>
              </Link>
            </div>
          </section>
        )}
        <section className="new-contents">
          <h2>새로운 콘텐츠를 통해 여행지를 찾아보세요!</h2>

          <ul className="tabs">
            {/* MEMO: 탭 클릭하여 콘텐츠 변경 시, tab에 selected 클래스 추가 */}
            <li className="tab selected">드라마</li>
            <li className="tab">영화</li>
            <li className="tab">예능</li>
            <li className="tab">뮤직비디오</li>
          </ul>

          <ul className="list">
            <li className="poster">
              {/* MEMO: 클릭 시 각 미디어 홈으로 이동 */}
              <Link>
                <img src="https://picsum.photos/id/912/400/600" alt="" />
              </Link>
            </li>

            <li className="poster">
              <Link>
                <img src="https://picsum.photos/id/508/400/600" alt="" />
              </Link>
            </li>

            <li className="poster">
              <Link>
                <img src="https://picsum.photos/id/1015/400/600" alt="" />
              </Link>
            </li>
          </ul>
        </section>
        <section className="hero">
          <div className="header">
            <h2>오늘은 어디로 여행을 떠나볼까요?</h2>

            <button className="location-selector">
              {/* MEMO: 클릭 시, 현재 다른 지역 준비중 alert - taost component 만든 후 변경 */}
              <span className="icon">
                <MapPinIcon />
              </span>
              <span>부산광역시</span>
            </button>
          </div>

          <div className="indicator">
            {/* MEMO: 03 위치에 슬라이드 값이 들어와야 하며, 최대 5개 희망 */}
            <span className="accent-text">
              {String(activeIndex + 1).padStart(2, '0')}{' '}
            </span>
            / 03
          </div>

          <div className="slider">
            <Swiper
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    {/* MEMO: 클릭시 북마크 아이콘이 fill 상태로 변경 toast로 저장되었다는 건 추후 적용 예정 */}
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    {/* MEMO: 클릭 시 각 여행지 상세 페이지로 이동 */}
                    <div className="image">
                      <img src="https://picsum.photos/id/52/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list">
                        {/* 해당 장소 인증 많은 미디어 콘텐츠 최대 4개 */}
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    <div className="image">
                      <img src="https://picsum.photos/id/53/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list">
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    <div className="image">
                      <img src="https://picsum.photos/id/54/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list icon">
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
        <section className="archive-banner">
          <Link to={'/archive'}>
            {/* MEMO: 클릭 시 아카이브 페이지로 이동 */}
            <p>오늘 하루 어디 다녀왔는지, 한 눈에 확인하는 방법!</p>
            <p className="emphasis">방문 인증으로 만들어지는 나만의 타임라인</p>

            <span className="accent-text">
              자세히 알아보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </span>
          </Link>
        </section>
        {/* 여행지 실시간 TOP 3 */}
        <section className="location-ranking">
          <ul className="ranking-list">
            {topRankings.map((ranking) => (
              <li key={ranking.locationId} className="ranking-card relative">
                <Link to={`/place?id=${ranking.locationId}`}>
                  <div className="image">
                    {ranking.imageUrl && (
                      <img src={ranking.imageUrl} alt={ranking.locationName} />
                    )}
                  </div>

                  <span className="number">{ranking.rank}</span>

                  <div className="info">
                    <p className="location-name emphasis">
                      {ranking.locationName}
                    </p>

                    <p className="count">
                      <span className="icon">
                        <MapPinSimpleAreaIcon />
                      </span>

                      <span>
                        {new Intl.NumberFormat('ko-KR').format(
                          ranking.totalVerificationCount ?? 0
                        )}
                        건
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Link to="/ranking" className="ranking-link accent-text">
            여행지 실시간 순위 더보기
            <CaretRightIcon />
          </Link>
        </section>
        {contentCuration && (
          <section className="content-curator">
            <Link
              className="link"
              to={`/content/detail?id=${contentCuration.contentId}`}
            >
              <p>🎬 이 콘텐츠 따라 떠나볼까요?</p>

              <h3>&lt;{contentCuration.contentTitle}&gt; 속 여행</h3>

              <p className="route">
                {(contentCuration.locationNames ?? []).map((locationName) => (
                  <span key={locationName}>{locationName}</span>
                ))}
              </p>

              <span className="more accent-text">
                여행지 더보기
                <span className="icon">
                  <CaretRightIcon />
                </span>
              </span>
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

export default Home;
