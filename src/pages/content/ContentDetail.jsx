import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CaretRightIcon,
  PlayCircleIcon,
  SignpostIcon,
  StarIcon,
} from '@phosphor-icons/react';
import ArtistService from '@/api/services/artistService.js';
import ContentService from '@/api/services/contentService.js';
import TokenStorage from '@/api/tokenStorage.js';
import {
  CONTENT_CATEGORY_OPTIONS,
  LOCATION_CATEGORY_OPTIONS,
} from '@/constants/rankingConstants.js';
import MediaCard from '../../components/card/MediaCard';
import PlaceCard from '../../components/card/PlaceCard';
import Select from '../../components/common/Select';
import './ContentDetail.css';

const RELATED_LIST_SIZE = 20;
const CITY_OPTIONS = ['부산광역시'];

const formatCount = (count) =>
  new Intl.NumberFormat('ko-KR').format(count ?? 0);

const getLocationCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)
    ?.label ?? category;

const getContentCategoryLabel = (category) =>
  CONTENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

const getLocationDescription = (location) => {
  const episode = location.episodeInfo?.find(
    (item) => item.contentTitle || item.episodeInfo
  );

  if (episode) {
    return [episode.contentTitle, episode.episodeInfo]
      .filter(Boolean)
      .join(' ');
  }

  return location.locationAddress?.district ?? '';
};

const getContentDescription = (content) =>
  `여행지 ${formatCount(content.relatedLocations?.length ?? 0)}곳`;

async function fetchArtistDetail({ artistId, city, size }) {
  const [locationsData, contentsData] = await Promise.all([
    ArtistService.getArtistLocations({ artistId, city, size }),
    ArtistService.getArtistContents({ artistId, size }),
  ]);

  return {
    artistInfo: locationsData.artistInfo,
    locations: locationsData.locations,
    contents: contentsData.contents,
  };
}

// MEMO: 아티스트 미디어 탭에서 게스트 출연(고정 출연진 아님) 콘텐츠를 클릭했을 때 보여주는
// 장소 x 미디어 x 아티스트 3단계 화면. 새 API 없이 /artists/{id}/contents를 다시 불러서
// contentId로 필터링합니다 (URL 쿼리 기반이라 새로고침/직접 접속에도 동작합니다).
async function fetchArtistContentDetail({ artistId, contentId }) {
  const data = await ArtistService.getArtistContents({
    artistId,
    size: RELATED_LIST_SIZE,
  });

  const matchedContent = data.contents?.find(
    (content) => String(content.contentId) === String(contentId)
  );

  return {
    artistName: data.artistInfo?.name,
    contentTitle: matchedContent?.contentTitle,
    contentPictureUrl: matchedContent?.contentPictureUrl,
    relatedLocations: matchedContent?.relatedLocations ?? [],
  };
}

function ContentDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const entityId = searchParams.get('id');
  const artistIdParam = searchParams.get('artistId');
  // MEMO: type이 없으면 콘텐츠(미디어) 상세로 취급합니다. 아티스트는 type=artist로 진입합니다.
  const type = searchParams.get('type') === 'artist' ? 'artist' : 'media';
  const isArtist = type === 'artist';
  const isArtistContentDrilldown = !isArtist && !!artistIdParam;

  const currentKey = isArtistContentDrilldown
    ? `artist-content:${artistIdParam}:${entityId}`
    : `${type}:${entityId}`;

  const [detailData, setDetailData] = useState(null);
  const [loadedKey, setLoadedKey] = useState(null);

  // MEMO: MVP 기간에는 지역이 부산광역시로 고정됩니다. (추후 시/도 -> 구 선택 UI로 확장 예정)
  const [selectedCity, setSelectedCity] = useState(CITY_OPTIONS[0]);

  // MEMO: 아티스트 상세만 여행지/미디어 탭을 사용합니다.
  const [activeTab, setActiveTab] = useState('location');

  const [fanSubmitting, setFanSubmitting] = useState(false);

  const affiliationListRef = useRef(null);

  useEffect(() => {
    if (!entityId) {
      return;
    }

    const fetchKey = currentKey;

    const fetchDetail = async () => {
      try {
        let data;

        if (isArtistContentDrilldown) {
          data = await fetchArtistContentDetail({
            artistId: artistIdParam,
            contentId: entityId,
          });
        } else if (isArtist) {
          data = await fetchArtistDetail({
            artistId: entityId,
            city: selectedCity,
            size: RELATED_LIST_SIZE,
          });
        } else {
          data = await ContentService.getContentDetail({
            contentId: entityId,
            city: selectedCity,
            size: RELATED_LIST_SIZE,
          });
        }

        console.log('[ContentDetail] 상세 응답:', data);
        setDetailData(data);
      } catch (e) {
        console.error(e);
        window.alert(
          isArtist
            ? '현재 아티스트 정보를 확인할 수 없습니다.'
            : '현재 콘텐츠 정보를 확인할 수 없습니다.'
        );
        navigate(-1);
      } finally {
        setLoadedKey(fetchKey);
      }
    };

    fetchDetail();
  }, [
    artistIdParam,
    currentKey,
    entityId,
    isArtist,
    isArtistContentDrilldown,
    navigate,
    selectedCity,
  ]);

  const patchInfo = (patch) => {
    setDetailData((prev) => {
      const infoKey = isArtist ? 'artistInfo' : 'contentInfo';
      return { ...prev, [infoKey]: { ...prev[infoKey], ...patch } };
    });
  };

  const handleFanClick = async () => {
    if (!TokenStorage.getAccessToken()) {
      navigate('/login');
      return;
    }

    if (fanSubmitting) return;

    const currentInfo = isArtist
      ? detailData.artistInfo
      : detailData.contentInfo;
    const { isFan: currentIsFan, fanCount: currentFanCount } = currentInfo;
    const nextFan = !currentIsFan;

    patchInfo({
      isFan: nextFan,
      fanCount: (currentFanCount ?? 0) + (nextFan ? 1 : -1),
    });

    try {
      setFanSubmitting(true);

      if (isArtist) {
        if (nextFan) {
          await ArtistService.followArtist(entityId);
        } else {
          await ArtistService.unfollowArtist(entityId);
        }
      } else if (nextFan) {
        await ContentService.followContent(entityId);
      } else {
        await ContentService.unfollowContent(entityId);
      }
    } catch (e) {
      console.error(e);
      patchInfo({ isFan: currentIsFan, fanCount: currentFanCount });
    } finally {
      setFanSubmitting(false);
    }
  };

  const scrollAffiliationList = () => {
    affiliationListRef.current?.scrollBy({ left: 240, behavior: 'smooth' });
  };

  if (!entityId) {
    return (
      <main className={`content-detail ${type}`}>
        <div className="content-state error">정보를 찾을 수 없습니다.</div>
      </main>
    );
  }

  if (loadedKey !== currentKey || !detailData) {
    return (
      <main className={`content-detail ${type}`}>
        <div className="content-state">불러오는 중입니다.</div>
      </main>
    );
  }

  if (isArtistContentDrilldown) {
    const { artistName, contentTitle, contentPictureUrl, relatedLocations } =
      detailData;

    return (
      <main className="content-detail media">
        <section className="hero image">
          <img src={contentPictureUrl} alt={contentTitle} />
        </section>
        <div className="container">
          <section className="content-summary relative">
            <h2>{contentTitle}</h2>
            <div className="content-stats">
              <div className="location-count">
                <span className="icon">
                  <SignpostIcon weight="fill" />
                </span>
                <span>
                  관련 여행지 {formatCount(relatedLocations.length)}곳
                </span>
              </div>
            </div>
          </section>

          <section className="related-contents">
            <div className="contents-count">
              {formatCount(relatedLocations.length)} 건
            </div>
            <ul className="card-list">
              {relatedLocations.map((location) => (
                <PlaceCard
                  key={location.locationId}
                  tag={artistName}
                  title={location.locationName}
                  verifyCount={location.relatedVisitCount}
                  description={getLocationDescription(location)}
                  onClick={() => navigate(`/place?id=${location.locationId}`)}
                />
              ))}
            </ul>
          </section>
        </div>
      </main>
    );
  }

  const info = isArtist ? detailData.artistInfo : detailData.contentInfo;
  const locations = detailData.locations ?? [];
  const contents = detailData.contents ?? [];
  const displayName = isArtist ? info.name : info.title;

  // MEMO: 미디어는 고정 출연진(fixedArtists), 아티스트는 소속 그룹/멤버(relatedArtists)를
  // 같은 affiliation-list 영역에서 보여줍니다 (퍼블리싱에서 공용으로 만들어둔 영역).
  const affiliationArtists = isArtist
    ? (info.relatedArtists ?? []).map((artist) => ({
        id: artist.id,
        name: artist.name,
        pictureUrl: artist.pictureUrl,
      }))
    : (info.fixedArtists ?? []).map((artist) => ({
        id: artist.artistId,
        name: artist.artistName,
        pictureUrl: artist.artistPictureUrl,
      }));

  return (
    <main className={`content-detail ${type}`}>
      <section className="hero image">
        <img src={info.pictureUrl} alt={displayName} />
      </section>
      <div className="container">
        <section className="content-summary relative">
          <button
            type="button"
            className="floating"
            onClick={handleFanClick}
            disabled={fanSubmitting}
            aria-pressed={info.isFan}
          >
            <span className="icon star">
              <StarIcon weight={info.isFan ? 'fill' : 'regular'} />
            </span>
            <span className="fan-count">{formatCount(info.fanCount)}명</span>
          </button>
          <p className="verify-total-count accent-text">
            {displayName} 팬들의 방문 인증 총{' '}
            {formatCount(info.totalVerificationCount)}건
          </p>
          <h2>{displayName}</h2>
          <div className="content-stats">
            <div className="location-count">
              <span className="icon">
                <SignpostIcon weight="fill" />
              </span>
              <span>관련 여행지 {formatCount(locations.length)}곳</span>
            </div>
            {isArtist && (
              <div className="media-count">
                <span className="icon">
                  <PlayCircleIcon weight="fill" />
                </span>
                <span>관련 미디어 {formatCount(contents.length)}개</span>
              </div>
            )}
          </div>
        </section>

        {affiliationArtists.length > 0 && (
          <section className="affiliation-list relative">
            <div className="list-wrapper">
              <ul className="list" ref={affiliationListRef}>
                {affiliationArtists.map((artist) => (
                  <li className="item" key={artist.id}>
                    <a
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(`/content/detail?type=artist&id=${artist.id}`);
                      }}
                    >
                      <div className="image">
                        {artist.pictureUrl && (
                          <img src={artist.pictureUrl} alt={artist.name} />
                        )}
                      </div>
                      <span className="name ellipsis-2">{artist.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {affiliationArtists.length > 6 && (
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
          {isArtist && (
            <div className="tabs">
              <button
                type="button"
                className={`tab location ${activeTab === 'location' ? 'selected' : ''}`}
                onClick={() => setActiveTab('location')}
              >
                여행지
              </button>
              <button
                type="button"
                className={`tab media ${activeTab === 'media' ? 'selected' : ''}`}
                onClick={() => setActiveTab('media')}
              >
                미디어
              </button>
            </div>
          )}

          {activeTab === 'location' ? (
            <>
              <div className="filter">
                <Select
                  value={selectedCity}
                  options={CITY_OPTIONS}
                  onChange={setSelectedCity}
                />
              </div>
              <div className="contents-count">
                {formatCount(locations.length)} 건
              </div>
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
            </>
          ) : (
            <>
              <div className="contents-count">
                {formatCount(contents.length)} 건
              </div>
              <ul className="card-list">
                {contents.map((content) => (
                  <MediaCard
                    key={content.contentId}
                    tag={getContentCategoryLabel(content.contentCategory)}
                    title={content.contentTitle}
                    imageUrl={content.contentPictureUrl}
                    showShortcut={content.isFixed}
                    showDescription={!content.isFixed}
                    description={getContentDescription(content)}
                    onClick={() => {
                      if (content.isFixed) {
                        navigate(`/content/detail?id=${content.contentId}`);
                        return;
                      }

                      // MEMO: 고정 출연진이 아닌 게스트 출연은 이 아티스트가 등장한
                      // 장소만 필터링해서 보여줍니다 (장소 x 미디어 x 아티스트).
                      navigate(
                        `/content/detail?id=${content.contentId}&artistId=${entityId}`
                      );
                    }}
                  />
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default ContentDetail;
