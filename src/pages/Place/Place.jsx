import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  BookmarkSimpleIcon,
  ClockIcon,
  CoffeeIcon,
  ConfettiIcon,
  FilmSlateIcon,
  ForkKnifeIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingCartIcon,
  SynagogueIcon,
} from '@phosphor-icons/react';
import LocationService from '@/api/services/locationService.js';
import TokenStorage from '@/api/tokenStorage.js';
import RecentLocationStorage from '@/api/recentLocationStorage.js';
import { LOCATION_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

import ScrollButton from '../../components/common/ScrollButton';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import './Place.css';

const RELATED_LIST_SIZE = 10;

const CATEGORY_ICON = {
  ATTRACTION: SynagogueIcon,
  CULTURE: BankIcon,
  FESTIVAL: ConfettiIcon,
  FILMING_LOCATION: FilmSlateIcon,
  RESTAURANT: ForkKnifeIcon,
  CAFE: CoffeeIcon,
  ACCOMMODATION: BedIcon,
  SHOPPING: ShoppingCartIcon,
  ETC: AsteriskIcon,
};

const formatCount = (count) =>
  new Intl.NumberFormat('ko-KR').format(count ?? 0);

const buildMapLink = (geoLocation) => {
  const lat = geoLocation?.latitude;
  const lng = geoLocation?.longitude;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return '/map';
  }

  return `/map?lat=${lat}&lng=${lng}`;
};

const getCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)
    ?.label ?? category;

const getFirstSentence = (text) => {
  if (!text) return '';

  const [firstSentence] = text.trim().split(/(?<=[.!?])\s/);
  return firstSentence;
};

function Place() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('id');

  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(!!locationId);
  const [error, setError] = useState(
    locationId ? null : '장소 정보를 찾을 수 없습니다.'
  );

  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [archiveSubmitting, setArchiveSubmitting] = useState(false);

  const mediaListRef = useRef(null);
  const artistListRef = useRef(null);
  const [canScrollMediaLeft, setCanScrollMediaLeft] = useState(false);
  const [canScrollMediaRight, setCanScrollMediaRight] = useState(false);
  const [canScrollArtistLeft, setCanScrollArtistLeft] = useState(false);
  const [canScrollArtistRight, setCanScrollArtistRight] = useState(false);

  useEffect(() => {
    if (!locationId) {
      return;
    }

    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await LocationService.getLocationDetail({
          locationId,
          size: RELATED_LIST_SIZE,
        });

        console.log('[Place] 장소 상세 응답:', data);
        setPlaceData(data);

        if (TokenStorage.getAccessToken() && data?.locationInfo) {
          RecentLocationStorage.add(data.locationInfo);
        }
      } catch (e) {
        console.error(e);
        window.alert('현재 장소 정보를 확인할 수 없습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [locationId, navigate]);

  useEffect(() => {
    if (!placeData) return;

    updateScrollButtons(
      mediaListRef,
      setCanScrollMediaLeft,
      setCanScrollMediaRight
    );

    updateScrollButtons(
      artistListRef,
      setCanScrollArtistLeft,
      setCanScrollArtistRight
    );
  }, [placeData]);

  const handleCopyPhone = async (tel) => {
    if (!tel) return;

    try {
      await navigator.clipboard.writeText(tel);
    } catch (e) {
      console.error(e);
    }
  };

  const patchLocationInfo = (patch) => {
    setPlaceData((prev) => ({
      ...prev,
      locationInfo: { ...prev.locationInfo, ...patch },
    }));
  };

  const handleLikeClick = async () => {
    if (!TokenStorage.getAccessToken()) {
      navigate('/login');
      return;
    }

    if (likeSubmitting) return;

    const { isLiked, likeCount } = placeData.locationInfo;
    const nextLiked = !isLiked;

    patchLocationInfo({
      isLiked: nextLiked,
      likeCount: (likeCount ?? 0) + (nextLiked ? 1 : -1),
    });

    try {
      setLikeSubmitting(true);

      if (nextLiked) {
        await LocationService.likeLocation(locationId);
      } else {
        await LocationService.unlikeLocation(locationId);
      }
    } catch (e) {
      console.error(e);
      patchLocationInfo({ isLiked, likeCount });
    } finally {
      setLikeSubmitting(false);
    }
  };

  const handleArchiveClick = async () => {
    if (!TokenStorage.getAccessToken()) {
      navigate('/login');
      return;
    }

    if (archiveSubmitting) return;

    const { isArchived, archiveCount } = placeData.locationInfo;
    const nextArchived = !isArchived;

    patchLocationInfo({
      isArchived: nextArchived,
      archiveCount: (archiveCount ?? 0) + (nextArchived ? 1 : -1),
    });

    try {
      setArchiveSubmitting(true);

      if (nextArchived) {
        await LocationService.archiveLocation(locationId);
      } else {
        await LocationService.unarchiveLocation(locationId);
      }
    } catch (e) {
      console.error(e);
      patchLocationInfo({ isArchived, archiveCount });
    } finally {
      setArchiveSubmitting(false);
    }
  };

  const updateScrollButtons = (ref, setLeft, setRight) => {
    const list = ref.current;
    if (!list) return;

    setLeft(list.scrollLeft > 0);
    setRight(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  };

  if (loading) {
    return (
      <main className="place">
        <div className="place-state">불러오는 중입니다.</div>
      </main>
    );
  }

  if (error || !placeData) {
    return (
      <main className="place">
        <div className="place-state error">
          {error ?? '장소 정보를 불러오지 못했습니다.'}
        </div>
      </main>
    );
  }

  const { locationInfo, contents = [], artists = [] } = placeData;
  const CategoryIcon = CATEGORY_ICON[locationInfo.category] ?? SynagogueIcon;

  return (
    <main className="place">
      <section className="hero image">
        {locationInfo.mainImageUrl ? (
          <img src={locationInfo.mainImageUrl} alt={locationInfo.name} />
        ) : (
          <ImagePlaceholder type="place" />
        )}
      </section>
      <div className="container">
        <section className="place-summary relative">
          {/* MEMO: 플로팅 메뉴 두 개는 비회원 클릭시 회원만 이용 가능함 안내 후, 로그인 페이지로 이동 */}
          <button
            type="button"
            className="floating heart icon"
            onClick={handleLikeClick}
            disabled={likeSubmitting}
            aria-pressed={locationInfo.isLiked}
          >
            <HeartIcon weight={locationInfo.isLiked ? 'fill' : 'regular'} />
          </button>
          <button
            type="button"
            className="floating bookmark icon"
            onClick={handleArchiveClick}
            disabled={archiveSubmitting}
            aria-pressed={locationInfo.isArchived}
          >
            <BookmarkSimpleIcon
              weight={locationInfo.isArchived ? 'fill' : 'regular'}
            />
          </button>
          <div className="place-meta">
            <p className="category">
              <span className="icon">
                <CategoryIcon />
              </span>
              <span className="plate-type">
                {getCategoryLabel(locationInfo.category)}
              </span>
            </p>
            <p className="verify-count accent-text">
              방문 인증 {formatCount(locationInfo.totalVerificationCount)}건
            </p>
          </div>

          <h2>{locationInfo.name}</h2>
          <p className="description">
            {getFirstSentence(locationInfo.overview)}
          </p>
          <div className="place-stats">
            <div className="like-count">
              <span className="icon heart">
                <HeartIcon weight="fill" />
              </span>
              {formatCount(locationInfo.likeCount)}명이 좋아해요.
            </div>
            <div className="bookmark-count">
              <span className="icon bookmark">
                <BookmarkSimpleIcon weight="fill" />
              </span>
              {formatCount(locationInfo.archiveCount)}명이 저장했어요.
            </div>
          </div>
        </section>
        <section className="place-info">
          {locationInfo.businessHours && (
            <div className="business-hours-info">
              <span className="icon">
                <ClockIcon weight="fill" />
              </span>
              <p className="info">
                <span className="start-time">{locationInfo.businessHours}</span>
              </p>
            </div>
          )}
          <div className="address-info">
            <span className="icon">
              <MapPinIcon weight="fill" />
            </span>
            <p className="info">
              <span className="address">{locationInfo.address?.address}</span>
              <Link
                to={buildMapLink(locationInfo.geoLocation)}
                className="additional accent-text"
              >
                지도
              </Link>
            </p>
          </div>
          {locationInfo.tel && (
            <div className="phone-info">
              <span className="icon">
                <PhoneIcon weight="fill" />
              </span>
              <p className="info">
                <span className="phone">{locationInfo.tel}</span>
                <button
                  type="button"
                  className="additional accent-text"
                  onClick={() => handleCopyPhone(locationInfo.tel)}
                >
                  복사
                </button>
              </p>
            </div>
          )}
        </section>
        <section
          className={`related-media ${contents.length === 0 ? 'hidden' : ''}`}
        >
          <h3>이 장소와 관련된 미디어</h3>
          <div className="slider">
            <ul
              className="list"
              ref={mediaListRef}
              onScroll={() =>
                updateScrollButtons(
                  mediaListRef,
                  setCanScrollMediaLeft,
                  setCanScrollMediaRight
                )
              }
            >
              {contents.map((content) => (
                <li className="item" key={content.contentId}>
                  <Link to={`/content/detail?id=${content.contentId}`}>
                    <div className="image">
                      {content.contentPictureUrl ? (
                        <img
                          src={content.contentPictureUrl}
                          alt={content.contentTitle}
                        />
                      ) : (
                        <ImagePlaceholder type="contents" />
                      )}
                    </div>
                    <p className="ellipsis-2 media-title">
                      {content.contentTitle}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {/* MEMO: item이 5개 이상일 때 노출 */}
            {canScrollMediaLeft && (
              <ScrollButton
                direction="prev"
                ariaLabel="이전 미디어 보기"
                onClick={() =>
                  mediaListRef.current?.scrollBy({
                    left: -240,
                    behavior: 'smooth',
                  })
                }
              />
            )}

            {canScrollMediaRight && (
              <ScrollButton
                direction="next"
                ariaLabel="다음 미디어 보기"
                onClick={() =>
                  mediaListRef.current?.scrollBy({
                    left: 240,
                    behavior: 'smooth',
                  })
                }
              />
            )}
          </div>
        </section>
        <section
          className={`related-artist ${artists.length === 0 ? 'hidden' : ''}`}
        >
          <h3>이 장소와 관련된 아티스트</h3>
          <div className="slider">
            <ul
              className="list"
              ref={artistListRef}
              onScroll={() =>
                updateScrollButtons(
                  artistListRef,
                  setCanScrollArtistLeft,
                  setCanScrollArtistRight
                )
              }
            >
              {artists.map((artist) => (
                <li className="item" key={artist.artistId}>
                  <Link
                    to={`/content/detail?type=artist&id=${artist.artistId}`}
                  >
                    <div className="image">
                      {artist.artistPictureUrl ? (
                        <img
                          src={artist.artistPictureUrl}
                          alt={artist.artistName}
                        />
                      ) : (
                        <ImagePlaceholder type="artist" />
                      )}
                    </div>
                    <p className="ellipsis-2 artist-title">
                      {artist.artistName}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            {canScrollArtistLeft && (
              <ScrollButton
                direction="prev"
                ariaLabel="이전 아티스트 보기"
                onClick={() =>
                  artistListRef.current?.scrollBy({
                    left: -240,
                    behavior: 'smooth',
                  })
                }
              />
            )}

            {canScrollArtistRight && (
              <ScrollButton
                direction="next"
                ariaLabel="다음 아티스트 보기"
                onClick={() =>
                  artistListRef.current?.scrollBy({
                    left: 240,
                    behavior: 'smooth',
                  })
                }
              />
            )}
          </div>
        </section>
        <section className="travel-cta">
          <Link to={buildMapLink(locationInfo.geoLocation)}>
            <span>여기로도 가볼까요?</span>
            <span className="accent-text">인근 여행지 보기</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Place;
