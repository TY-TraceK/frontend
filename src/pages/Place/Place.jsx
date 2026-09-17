import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  BookmarkSimpleIcon,
  CaretRightIcon,
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
} from "@phosphor-icons/react";
import LocationService from "@/api/services/locationService.js";
import TokenStorage from "@/api/tokenStorage.js";
import { LOCATION_CATEGORY_OPTIONS } from "@/constants/rankingConstants.js";
import "./Place.css";

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

// TODO: DB에 장소 데이터가 채워지면 이 mock과 아래 catch의 fallback 처리를 제거해주세요.
const MOCK_PLACE_DATA = {
  locationInfo: {
    locationId: 1,
    name: "송도해수욕장",
    category: "ATTRACTION",
    address: {
      city: "부산광역시",
      district: "서구",
      address: "부산광역시 서구 송도해변로 100",
    },
    geoLocation: { latitude: 35.0764, longitude: 129.0143 },
    mainImageUrl: "https://picsum.photos/id/913/800/900",
    tel: "051-240-4000",
    businessHours: "06:00 - 23:00, 연중무휴",
    overview: "개장 100주년이 넘은 우리나라 1호 해수욕장",
    archiveCount: 1062,
    likeCount: 2173,
    totalVerificationCount: 1984,
    isLiked: false,
    isArchived: false,
  },
  images: [],
  contents: [
    { contentId: 1, contentTitle: "런닝맨", contentType: "예능", contentPictureUrl: "https://picsum.photos/id/153/400/600", relatedVerificationsCount: 0 },
    { contentId: 2, contentTitle: "스테이씨, 떴다!", contentType: "예능", contentPictureUrl: "https://picsum.photos/id/154/400/600", relatedVerificationsCount: 0 },
    { contentId: 3, contentTitle: "깡철이", contentType: "예능", contentPictureUrl: "https://picsum.photos/id/230/400/600", relatedVerificationsCount: 0 },
    { contentId: 4, contentTitle: "스테이씨크릿 in 부산", contentType: "예능", contentPictureUrl: "https://picsum.photos/id/238/400/600", relatedVerificationsCount: 0 },
  ],
  artists: [
    { artistId: 1, artistName: "런닝맨", artistPictureUrl: "https://picsum.photos/id/153/400/600", isGroup: true, relatedVerificationsCount: 0 },
    { artistId: 2, artistName: "스테이씨, 떴다!", artistPictureUrl: "https://picsum.photos/id/154/400/600", isGroup: true, relatedVerificationsCount: 0 },
    { artistId: 3, artistName: "깡철이", artistPictureUrl: "https://picsum.photos/id/230/400/600", isGroup: false, relatedVerificationsCount: 0 },
    { artistId: 4, artistName: "스테이씨크릿 in 부산", artistPictureUrl: "https://picsum.photos/id/238/400/600", isGroup: true, relatedVerificationsCount: 0 },
  ],
};

const formatCount = (count) => new Intl.NumberFormat("ko-KR").format(count ?? 0);

const getCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

function Place() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("id");

  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(!!locationId);
  const [error, setError] = useState(
    locationId ? null : "장소 정보를 찾을 수 없습니다.",
  );

  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [archiveSubmitting, setArchiveSubmitting] = useState(false);

  const mediaListRef = useRef(null);
  const artistListRef = useRef(null);

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

        console.log("[Place] 장소 상세 응답:", data);
        setPlaceData(data);
      } catch (e) {
        console.error(e);
        console.warn(
          "[Place] 장소 상세 조회에 실패해 임시 더미 데이터를 표시합니다. (DB 데이터 확인 필요)",
        );
        setPlaceData(MOCK_PLACE_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [locationId]);

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
      navigate("/login");
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
      navigate("/login");
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

  const scrollList = (ref) => {
    ref.current?.scrollBy({ left: 240, behavior: "smooth" });
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
        <div className="place-state error">{error ?? "장소 정보를 불러오지 못했습니다."}</div>
      </main>
    );
  }

  const { locationInfo, contents = [], artists = [] } = placeData;
  const CategoryIcon = CATEGORY_ICON[locationInfo.category] ?? SynagogueIcon;

  return (
    <main className="place">
      <section className="hero image">
        <img src={locationInfo.mainImageUrl} alt={locationInfo.name} />
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
            <HeartIcon weight={locationInfo.isLiked ? "fill" : "regular"} />
          </button>
          <button
            type="button"
            className="floating bookmark icon"
            onClick={handleArchiveClick}
            disabled={archiveSubmitting}
            aria-pressed={locationInfo.isArchived}
          >
            <BookmarkSimpleIcon weight={locationInfo.isArchived ? "fill" : "regular"} />
          </button>
          <div className="place-meta">
            <p className="category">
              <span className="icon">
                <CategoryIcon />
              </span>
              <span className="plate-type">{getCategoryLabel(locationInfo.category)}</span>
            </p>
            <p className="verify-count accent-text">
              방문 인증 {formatCount(locationInfo.totalVerificationCount)}건
            </p>
          </div>

          <h2>{locationInfo.name}</h2>
          <p className="description">{locationInfo.overview}</p>
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
              <Link to="/map" className="additional accent-text">
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
        <section className={`related-media ${contents.length === 0 ? "hidden" : ""}`}>
          <h3>이 장소와 관련된 미디어</h3>
          <div className="slider">
            <ul className="list" ref={mediaListRef}>
              {contents.map((content) => (
                <li className="item" key={content.contentId}>
                  <Link to={`/content/detail?id=${content.contentId}`}>
                    <div className="image">
                      {content.contentPictureUrl && (
                        <img src={content.contentPictureUrl} alt={content.contentTitle} />
                      )}
                    </div>
                    <p className="ellipsis-2 media-title">{content.contentTitle}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {/* MEMO: item이 5개 이상일 때 노출 */}
            {contents.length > 4 && (
              <button
                type="button"
                className="next-button icon"
                aria-label="다음 미디어 보기"
                onClick={() => scrollList(mediaListRef)}
              >
                <CaretRightIcon />
              </button>
            )}
          </div>
        </section>
        <section className={`related-artist ${artists.length === 0 ? "hidden" : ""}`}>
          <h3>이 장소와 관련된 아티스트</h3>
          <div className="slider">
            <ul className="list" ref={artistListRef}>
              {artists.map((artist) => (
                <li className="item" key={artist.artistId}>
                  <Link>
                    <div className="image">
                      {artist.artistPictureUrl && (
                        <img src={artist.artistPictureUrl} alt={artist.artistName} />
                      )}
                    </div>
                    <p className="ellipsis-2 artist-title">{artist.artistName}</p>
                  </Link>
                </li>
              ))}
            </ul>
            {artists.length > 4 && (
              <button
                type="button"
                className="next-button icon"
                aria-label="다음 아티스트 보기"
                onClick={() => scrollList(artistListRef)}
              >
                <CaretRightIcon />
              </button>
            )}
          </div>
        </section>
        <section className="travel-cta">
          {/* MEMO: 지도로 이동하되 현재 위치 인근의 여행지 전체 로드 가능할까요? */}
          <Link to="/map">
            <span>여기로도 가볼까요?</span>
            <span className="accent-text">인근 여행지 보기</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Place;
