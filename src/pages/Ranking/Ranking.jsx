import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
  MapPinSimpleAreaIcon,
} from '@phosphor-icons/react';

import RankingService from '@/api/services/rankingService.js';

import {
  LOCATION_CATEGORY,
  LOCATION_CATEGORY_OPTIONS,
  RANKING_LIMIT,
  RANKING_TYPE,
  RANKING_TYPE_OPTIONS,
} from '@/constants/rankingConstants.js';

import rank1 from '@/assets/ranking/rank-1.svg';
import rank2 from '@/assets/ranking/rank-2.svg';
import rank3 from '@/assets/ranking/rank-3.svg';

import Select from '../../components/Select';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import './Ranking.css';

const RANK_IMAGES = {
  1: rank1,
  2: rank2,
  3: rank3,
};

function Ranking() {
  const navigate = useNavigate();

  const [rankingType, setRankingType] = useState(RANKING_TYPE.LOCATION.value);

  const [selectedCategory, setSelectedCategory] = useState(
    LOCATION_CATEGORY.ALL.value
  );

  const [selectedCity, setSelectedCity] = useState(null);

  const [regionRankings, setRegionRankings] = useState([]);
  const [locationRankings, setLocationRankings] = useState([]);

  const [categoryExpanded, setCategoryExpanded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 지역 랭킹 조회
  useEffect(() => {
    const fetchRegionRankings = async () => {
      try {
        const data = await RankingService.getRegionRanking({
          topN: RANKING_LIMIT,
        });

        const rankings = data.rankings ?? [];

        setRegionRankings(rankings);

        if (rankings.length > 0) {
          setSelectedCity((prev) => prev ?? rankings[0].region);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchRegionRankings();
  }, []);

  // 여행지 랭킹 조회
  useEffect(() => {
    if (rankingType !== RANKING_TYPE.LOCATION.value) {
      return;
    }

    const fetchLocationRankings = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await RankingService.getLocationRanking({
          city: selectedCity,
          category: selectedCategory,
          topN: RANKING_LIMIT,
        });

        setLocationRankings(data.rankings ?? []);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationRankings();
  }, [rankingType, selectedCity, selectedCategory]);

  const rankings = useMemo(() => {
    if (rankingType === RANKING_TYPE.REGION.value) {
      return regionRankings;
    }

    return locationRankings;
  }, [rankingType, regionRankings, locationRankings]);

  const topRankings = rankings.slice(0, 3);
  const defaultRankings = rankings.slice(3);

  const handleRegionRankingClick = (region) => {
    setSelectedCity(region);
    setRankingType(RANKING_TYPE.LOCATION.value);
  };

  return (
    <main className="ranking">
      <div className="container">
        <section className="ranking-filter">
          {/* 지역 / 여행지 */}
          <div className="tabs region-tabs">
            {RANKING_TYPE_OPTIONS.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`tab ${rankingType === type.value ? 'selected' : ''}`}
                onClick={() => setRankingType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {rankingType === RANKING_TYPE.LOCATION.value && (
            <>
              {/* 지역 */}
              {regionRankings.length > 0 && (
                <div className="region-filter">
                  <Select
                    value={selectedCity ?? ''}
                    options={regionRankings.map((region) => region.region)}
                    onChange={setSelectedCity}
                  />
                </div>
              )}

              {/* 카테고리 */}
              <div
                className={`category-tabs ${
                  categoryExpanded ? 'expanded' : ''
                }`}
              >
                <div className="category-list tabs">
                  {LOCATION_CATEGORY_OPTIONS.map((category) => (
                    <button
                      type="button"
                      key={category.value}
                      className={`tab ${
                        selectedCategory === category.value ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="toggle icon"
                  aria-label={
                    categoryExpanded ? '카테고리 접기' : '카테고리 펼치기'
                  }
                  onClick={() => setCategoryExpanded((prev) => !prev)}
                >
                  {categoryExpanded ? <CaretUpIcon /> : <CaretDownIcon />}
                </button>
              </div>
            </>
          )}
        </section>

        <section className="ranking-section">
          {loading && (
            <div className="ranking-state">순위를 불러오는 중입니다.</div>
          )}

          {!loading && error && (
            <div className="ranking-state error">{error}</div>
          )}

          {!loading && !error && rankings.length === 0 && (
            <div className="ranking-state">랭킹 데이터가 없습니다.</div>
          )}

          {!loading && !error && rankings.length > 0 && (
            <>
              {/* Top 3 */}
              <ol className="list top3-list">
                {topRankings.map((ranking) => (
                  <RankingItem
                    key={getRankingKey(rankingType, ranking)}
                    ranking={ranking}
                    rankingType={rankingType}
                    top
                    onRegionClick={handleRegionRankingClick}
                  />
                ))}
              </ol>

              {/* 4~10 */}
              {defaultRankings.length > 0 && (
                <ol className="list default-list">
                  {defaultRankings.map((ranking) => (
                    <RankingItem
                      key={getRankingKey(rankingType, ranking)}
                      ranking={ranking}
                      rankingType={rankingType}
                      onRegionClick={handleRegionRankingClick}
                    />
                  ))}
                </ol>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function RankingItem({ ranking, rankingType, top = false, onRegionClick }) {
  const isRegion = rankingType === RANKING_TYPE.REGION.value;

  const rank = ranking.rank;

  const title = isRegion ? ranking.region : ranking.locationName;

  const tag = isRegion ? null : ranking.cityName;

  const count = ranking.totalVerificationCount;

  const handleClick = (event) => {
    if (!isRegion) {
      return;
    }

    event.preventDefault();
    onRegionClick?.(ranking.region);
  };

  return (
    <li className={`item ${top && rank <= 3 ? `rank-${rank}` : ''}`}>
      <Link
        to={isRegion ? '#' : `/place?id=${ranking.locationId}`}
        onClick={handleClick}
      >
        {/* 순위 */}
        <span className="rank">
          {top && RANK_IMAGES[rank] ? (
            <img src={RANK_IMAGES[rank]} alt={`${rank}위`} />
          ) : (
            formatRank(rank)
          )}
        </span>

        {/*
          API에 이미지가 아직 없어도 이 영역은 반드시 유지.
          기존 CSS가 이 구조를 기준으로 잡혀 있음.
        */}
        {!isRegion && (
          <div className="image">
            {ranking.imageUrl ? (
              <img src={ranking.imageUrl} alt={title} />
            ) : (
              <ImagePlaceholder type="card" />
            )}
          </div>
        )}

        {/* 정보 */}
        <div className="info">
          <div className="place">
            {tag && <span className="tag">{tag}</span>}

            <span className="title ellipsis-1">{title}</span>
          </div>

          <span className="verify-count accent-text">
            <span className="icon">
              <MapPinSimpleAreaIcon />
            </span>
            {formatCount(count)}건
          </span>
        </div>
      </Link>
    </li>
  );
}

const getRankingKey = (rankingType, ranking) => {
  if (rankingType === RANKING_TYPE.REGION.value) {
    return ranking.region;
  }

  return ranking.locationId;
};

const formatRank = (rank) => {
  if (rank == null) {
    return '-';
  }

  return String(rank).padStart(2, '0');
};

const formatCount = (count) => {
  return new Intl.NumberFormat('ko-KR').format(count ?? 0);
};

export default Ranking;
