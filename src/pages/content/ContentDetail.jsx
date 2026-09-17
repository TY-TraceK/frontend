import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CaretRightIcon,
  SignpostIcon,
  StarIcon,
} from "@phosphor-icons/react";
import ContentService from "@/api/services/contentService.js";
import TokenStorage from "@/api/tokenStorage.js";
import { LOCATION_CATEGORY_OPTIONS } from "@/constants/rankingConstants.js";
import PlaceCard from "../../components/PlaceCard";
import Select from "../../components/Select";
import "./ContentDetail.css";

const RELATED_LIST_SIZE = 20;
const CITY_OPTIONS = ["부산광역시"];

// TODO: DB에 콘텐츠 데이터가 채워지면 이 mock과 아래 catch의 fallback 처리를 제거해주세요.
const MOCK_CONTENT_DATA = {
  contentInfo: {
    id: 1,
    title: "런닝맨",
    category: "예능",
    pictureUrl: "https://picsum.photos/id/1011/800/900",
    totalVerificationCount: 4173,
    fixedArtists: [
      { artistId: 1, artistName: "유재석", artistPictureUrl: "https://picsum.photos/id/64/200/200" },
      { artistId: 2, artistName: "지석진", artistPictureUrl: "https://picsum.photos/id/65/200/200" },
      { artistId: 3, artistName: "김종국", artistPictureUrl: "https://picsum.photos/id/66/200/200" },
      { artistId: 4, artistName: "하하", artistPictureUrl: "https://picsum.photos/id/67/200/200" },
    ],
  },
  locations: [
    {
      locationId: 1,
      locationName: "페스트 가든",
      locationCategory: "CAFE",
      locationPictureUrl: "https://picsum.photos/id/292/400/400",
      locationAddress: { city: "부산광역시", district: "해운대구", address: "" },
      relatedVisitCount: 1042,
      episodeInfo: [{ episodeId: 1, episodeInfo: "411회", episodeVisitDate: "", note: "" }],
    },
    {
      locationId: 2,
      locationName: "파라다이스 시티",
      locationCategory: "SHOPPING",
      locationPictureUrl: "https://picsum.photos/id/293/400/400",
      locationAddress: { city: "부산광역시", district: "중구", address: "" },
      relatedVisitCount: 754,
      episodeInfo: [{ episodeId: 2, episodeInfo: "", episodeVisitDate: "", note: "" }],
    },
    {
      locationId: 3,
      locationName: "송도해수욕장",
      locationCategory: "ATTRACTION",
      locationPictureUrl: "https://picsum.photos/id/913/400/400",
      locationAddress: { city: "부산광역시", district: "서구", address: "" },
      relatedVisitCount: 742,
      episodeInfo: [{ episodeId: 3, episodeInfo: "126회", episodeVisitDate: "", note: "" }],
    },
    {
      locationId: 4,
      locationName: "자갈치시장",
      locationCategory: "SHOPPING",
      locationPictureUrl: "https://picsum.photos/id/294/400/400",
      locationAddress: { city: "부산광역시", district: "중구", address: "" },
      relatedVisitCount: 614,
      episodeInfo: [{ episodeId: 4, episodeInfo: "", episodeVisitDate: "", note: "" }],
    },
    {
      locationId: 5,
      locationName: "오이도 선사유적공원",
      locationCategory: "ATTRACTION",
      locationPictureUrl: "https://picsum.photos/id/295/400/400",
      locationAddress: { city: "부산광역시", district: "강서구", address: "" },
      relatedVisitCount: 41,
      episodeInfo: [{ episodeId: 5, episodeInfo: "", episodeVisitDate: "", note: "" }],
    },
    {
      locationId: 6,
      locationName: "메이드랜드",
      locationCategory: "ETC",
      locationPictureUrl: "https://picsum.photos/id/296/400/400",
      locationAddress: { city: "부산광역시", district: "기장군", address: "" },
      relatedVisitCount: 531,
      episodeInfo: [{ episodeId: 6, episodeInfo: "", episodeVisitDate: "", note: "" }],
    },
  ],
};

const formatCount = (count) => new Intl.NumberFormat("ko-KR").format(count ?? 0);

const getLocationCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

const getLocationDescription = (location) =>
  location.episodeInfo?.find((episode) => episode.episodeInfo)?.episodeInfo ??
  location.locationAddress?.district ??
  "";

function ContentDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("id");

  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(!!contentId);
  const [error, setError] = useState(
    contentId ? null : "콘텐츠 정보를 찾을 수 없습니다.",
  );

  // MEMO: MVP 기간에는 지역이 부산광역시로 고정됩니다. (추후 시/도 -> 구 선택 UI로 확장 예정)
  const [selectedCity, setSelectedCity] = useState(CITY_OPTIONS[0]);

  const affiliationListRef = useRef(null);

  useEffect(() => {
    if (!contentId) {
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await ContentService.getContentDetail({
          contentId,
          city: selectedCity,
          size: RELATED_LIST_SIZE,
        });

        console.log("[ContentDetail] 콘텐츠 상세 응답:", data);
        setContentData(data);
      } catch (e) {
        console.error(e);
        console.warn(
          "[ContentDetail] 콘텐츠 상세 조회에 실패해 임시 더미 데이터를 표시합니다. (DB 데이터 확인 필요)",
        );
        setContentData(MOCK_CONTENT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, selectedCity]);

  const handleFanClick = () => {
    // TODO: 콘텐츠 팬 등록/취소 API 연동 (백엔드 엔드포인트 확정 필요)
    if (!TokenStorage.getAccessToken()) {
      navigate("/login");
    }
  };

  const scrollAffiliationList = () => {
    affiliationListRef.current?.scrollBy({ left: 240, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="content-detail media">
        <div className="content-state">불러오는 중입니다.</div>
      </main>
    );
  }

  if (error || !contentData) {
    return (
      <main className="content-detail media">
        <div className="content-state error">
          {error ?? "콘텐츠 정보를 불러오지 못했습니다."}
        </div>
      </main>
    );
  }

  const { contentInfo, locations = [] } = contentData;
  const fixedArtists = contentInfo.fixedArtists ?? [];

  return (
    <main className="content-detail media">
      <section className="hero image">
        <img src={contentInfo.pictureUrl} alt={contentInfo.title} />
      </section>
      <div className="container">
        <section className="content-summary relative">
          <button type="button" className="floating" onClick={handleFanClick}>
            <span className="icon star">
              <StarIcon />
            </span>
          </button>
          <p className="verify-total-count accent-text">
            {contentInfo.title} 팬들의 방문 인증 총{" "}
            {formatCount(contentInfo.totalVerificationCount)}건
          </p>
          <h2>{contentInfo.title}</h2>
          <div className="content-stats">
            <div className="location-count">
              <span className="icon">
                <SignpostIcon weight="fill" />
              </span>
              <span>관련 여행지 {formatCount(locations.length)}곳</span>
            </div>
          </div>
        </section>

        {fixedArtists.length > 0 && (
          <section className="affiliation-list relative">
            <div className="list-wrapper">
              <ul className="list" ref={affiliationListRef}>
                {fixedArtists.map((artist) => (
                  <li className="item" key={artist.artistId}>
                    <a>
                      <div className="image">
                        {artist.artistPictureUrl && (
                          <img src={artist.artistPictureUrl} alt={artist.artistName} />
                        )}
                      </div>
                      <span className="name ellipsis-2">{artist.artistName}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {fixedArtists.length > 6 && (
                <button
                  type="button"
                  className="next-button"
                  aria-label="다음 출연진 보기"
                  onClick={scrollAffiliationList}
                >
                  <CaretRightIcon />
                </button>
              )}
            </div>
          </section>
        )}

        <section className="related-contents">
          <div className="filter">
            <Select value={selectedCity} options={CITY_OPTIONS} onChange={setSelectedCity} />
          </div>
          <div className="contents-count">{formatCount(locations.length)} 건</div>
          <ul className="card-list">
            {locations.map((location) => (
              <PlaceCard
                key={location.locationId}
                tag={getLocationCategoryLabel(location.locationCategory)}
                title={location.locationName}
                verifyCount={location.relatedVisitCount}
                description={getLocationDescription(location)}
                imageUrl={location.locationPictureUrl}
                onClick={() => navigate(`/place?id=${location.locationId}`)}
              />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

export default ContentDetail;
