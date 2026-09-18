import { useEffect, useRef, useState } from 'react';
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
import LocationService from '@/api/services/locationService.js';
import ContentService from '@/api/services/contentService.js';
import { CONTENT_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

import './Home.css';
import { useProfile } from '@/hooks/userContext.jsx';

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [topSavedLocations, setTopSavedLocations] = useState([]);
  const [topRankings, setTopRankings] = useState([]);
  const [selectedContentCategory, setSelectedContentCategory] = useState('DRAMA');
  const [categoryContents, setCategoryContents] = useState([]);
  const [contentCuration, setContentCuration] = useState(null);
  const categoryTabsRef = useRef(null);
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false);
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] =
    useState(false);

  const updateCategoryScrollButtons = () => {
    const tabs = categoryTabsRef.current;
    if (!tabs) return;

    setCanScrollCategoriesLeft(tabs.scrollLeft > 0);
    setCanScrollCategoriesRight(
      tabs.scrollLeft + tabs.clientWidth < tabs.scrollWidth - 1
    );
  };

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const { user, setProfileData } = useProfile();

  useEffect(() => {
    if (isLoggedIn && user == null) {
      setProfileData();
    }
  }, []);
  useEffect(() => {
    const fetchCategoryContents = async () => {
      try {
        const data = await ContentService.getContentsByCategory({
          category: selectedContentCategory,
          page: 0,
          size: 3,
          sort: 'id,DESC',
        });

        setCategoryContents(data.content ?? []);
      } catch (error) {
        console.error('카테고리별 콘텐츠 조회 실패:', error);
        setCategoryContents([]);
      }
    };

    fetchCategoryContents();
  }, [selectedContentCategory]);

  useEffect(() => {
    const tabs = categoryTabsRef.current;
    if (!tabs) return undefined;

    updateCategoryScrollButtons();
    tabs.addEventListener('scroll', updateCategoryScrollButtons);
    window.addEventListener('resize', updateCategoryScrollButtons);

    return () => {
      tabs.removeEventListener('scroll', updateCategoryScrollButtons);
      window.removeEventListener('resize', updateCategoryScrollButtons);
    };
  }, []);

  useEffect(() => {
    const fetchTopSavedLocations = async () => {
      try {
        const data = await LocationService.getTopSavedLocations(5);
        setTopSavedLocations(data ?? []);
        setActiveIndex(0);
      } catch (error) {
        console.error('인기 관광지 TOP5 조회 실패:', error);
        setTopSavedLocations([]);
      }
    };

    fetchTopSavedLocations();
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

          <div className="tabs-wrapper">
            {canScrollCategoriesLeft && (
              <button
                type="button"
                className="tabs-scroll tabs-prev"
                aria-label="이전 카테고리 보기"
                onClick={() =>
                  categoryTabsRef.current?.scrollBy({
                    left: -160,
                    behavior: 'smooth',
                  })
                }
              >
                <CaretRightIcon />
              </button>
            )}

            <ul className="tabs" ref={categoryTabsRef}>
              {CONTENT_CATEGORY_OPTIONS.map((category) => (
                <li key={category.value}>
                  <button
                    type="button"
                    className={`tab ${
                      selectedContentCategory === category.value
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => setSelectedContentCategory(category.value)}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>

            {canScrollCategoriesRight && (
              <button
                type="button"
                className="tabs-scroll tabs-next"
                aria-label="다음 카테고리 보기"
                onClick={() =>
                  categoryTabsRef.current?.scrollBy({
                    left: 160,
                    behavior: 'smooth',
                  })
                }
              >
                <CaretRightIcon />
              </button>
            )}
          </div>

          <ul className="list">
            {categoryContents.map((content) => (
              <li key={content.id} className="poster">
                <Link to={`/content/detail?id=${content.id}`}>
                  <img src={content.pictureUrl} alt={content.title} />
                </Link>
              </li>
            ))}
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
              {String(
                topSavedLocations.length > 0 ? activeIndex + 1 : 0
              ).padStart(2, '0')}{' '}
            </span>
            / {String(topSavedLocations.length).padStart(2, '0')}
          </div>

          <div className="slider">
            <Swiper
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {topSavedLocations.map((location) => (
                <SwiperSlide key={location.id}>
                  <div className="card relative">
                    <button className="bookmark icon" type="button">
                      <BookmarkSimpleIcon />
                    </button>

                    <Link className="link" to={`/place?id=${location.id}`}>
                      <div className="image">
                        {location.mainImageUrl && (
                          <img
                            src={location.mainImageUrl}
                            alt={location.name}
                          />
                        )}
                      </div>

                      <div className="info">
                        <div className="info-header">
                          <p className="location-name">{location.name}</p>

                          <div className="count">
                            <BookmarkSimpleIcon />
                            <span>
                              {new Intl.NumberFormat('ko-KR').format(
                                (location.likeCount ?? 0) +
                                  (location.archiveCount ?? 0)
                              )}
                              건
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
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
