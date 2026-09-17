import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeVerticalIcon,
  HeartIcon,
  PencilSimpleLineIcon,
} from '@phosphor-icons/react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { notification } from 'antd';
import 'swiper/css';
import 'swiper/css/navigation';
import './Archive.css';
import VerifyService from '@/api/services/verifyService';
import LocationService from '@/api/services/locationService';

const PAGE_SIZE = 10;

const DEFAULT_IMAGE_URL = 'https://picsum.photos/id/833/600/400';

const FILTER_TYPE = {
  ALL: 'ALL',
  MONTH: 'MONTH',
  PERIOD: 'PERIOD',
};

const DEFAULT_ARCHIVE_ITEM = {
  visitVerificationId: null,

  locationId: null,
  locationName: null,
  locationAddress: null,
  locationImageUrl: null,
  city: null,

  contentId: null,
  contentTitle: null,

  artistIds: [],
  artists: [],

  visitVerifiedTimeAt: null,
  visitVerifiedDate: null,
  visitVerificationStatus: 'VALID',

  liked: false,
  archived: false,
};

function Archive() {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [filterType, setFilterType] = useState(FILTER_TYPE.MONTH);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [histories, setHistories] = useState([]);

  const [hasNext, setHasNext] = useState(false);
  const [nextCursorDate, setNextCursorDate] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [slideStates, setSlideStates] = useState({});

  const [openedDeleteMenuId, setOpenedDeleteMenuId] = useState(null);
  const [deletingVerificationId, setDeletingVerificationId] = useState(null);

  const [updatingLikeLocationId, setUpdatingLikeLocationId] = useState(null);
  const [updatingArchiveLocationId, setUpdatingArchiveLocationId] =
    useState(null);

  const loadMoreRef = useRef(null);

  const normalizeItem = (item) => ({
    ...DEFAULT_ARCHIVE_ITEM,
    ...(item ?? {}),

    artistIds: Array.isArray(item?.artistIds) ? item.artistIds : [],
    artists: Array.isArray(item?.artists) ? item.artists : [],

    liked: item?.liked === true,
    archived: item?.archived === true,
  });

  const normalizeHistories = (groups) => {
    if (!Array.isArray(groups)) {
      return [];
    }

    return groups
      .filter((group) => group?.date != null)
      .map((group) => ({
        date: group.date,
        items: Array.isArray(group.items) ? group.items.map(normalizeItem) : [],
      }));
  };

  const getItemKey = (item) => {
    if (item?.visitVerificationId != null) {
      return `verification-${item.visitVerificationId}`;
    }

    return [
      item?.locationId ?? 'location',
      item?.contentId ?? 'content',
      Array.isArray(item?.artistIds) ? item.artistIds.join('-') : 'artists',
      item?.visitVerifiedTimeAt ?? 'time',
    ].join('_');
  };

  const mergeHistories = (previousGroups, newGroups) => {
    const historyMap = new Map();

    previousGroups.forEach((group) => {
      historyMap.set(
        group.date,
        Array.isArray(group.items) ? [...group.items] : []
      );
    });

    newGroups.forEach((group) => {
      const newItems = Array.isArray(group.items) ? group.items : [];

      if (!historyMap.has(group.date)) {
        historyMap.set(group.date, newItems);
        return;
      }

      const previousItems = historyMap.get(group.date) ?? [];

      const existingKeys = new Set(previousItems.map(getItemKey));

      const filteredItems = newItems.filter(
        (item) => !existingKeys.has(getItemKey(item))
      );

      historyMap.set(group.date, [...previousItems, ...filteredItems]);
    });

    return Array.from(historyMap.entries())
      .map(([date, items]) => ({
        date,
        items,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const buildFilterParams = useCallback(() => {
    if (filterType === FILTER_TYPE.MONTH) {
      return {
        year: selectedYear,
        month: selectedMonth,
      };
    }

    if (filterType === FILTER_TYPE.PERIOD) {
      return {
        startDate: startDate || null,
        endDate: endDate || null,
      };
    }

    return {};
  }, [filterType, selectedYear, selectedMonth, startDate, endDate]);

  const fetchHistories = useCallback(
    async ({ cursorDate = null, append = false } = {}) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const filterParams = buildFilterParams();

        const data = await VerifyService.getMyVisitVerificationHistories({
          ...filterParams,
          cursorDate,
          size: PAGE_SIZE,
        });

        const newHistories = normalizeHistories(data?.histories);

        if (append) {
          setHistories((previous) => mergeHistories(previous, newHistories));
        } else {
          setHistories(newHistories);
        }

        setHasNext(data?.hasNext === true);
        setNextCursorDate(data?.nextCursorDate ?? null);
      } catch (error) {
        console.error('방문 인증 내역 조회 실패:', error);

        if (!append) {
          setHistories([]);
        }

        setHasNext(false);
        setNextCursorDate(null);

        notification.error({
          message: '방문 인증 내역을 불러오지 못했습니다.',
          description:
            error?.response?.data?.message ?? '잠시 후 다시 시도해주세요.',
          placement: 'topRight',
          duration: 4.5,
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [buildFilterParams]
  );

  useEffect(() => {
    setHistories([]);
    setHasNext(false);
    setNextCursorDate(null);
    setSlideStates({});
    setOpenedDeleteMenuId(null);

    fetchHistories();
  }, [fetchHistories]);

  const handleLoadMore = useCallback(() => {
    if (!hasNext || !nextCursorDate || isLoading || isLoadingMore) {
      return;
    }

    fetchHistories({
      cursorDate: nextCursorDate,
      append: true,
    });
  }, [hasNext, nextCursorDate, isLoading, isLoadingMore, fetchHistories]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [handleLoadMore]);

  const handleFilterType = (type) => {
    setFilterType(type);
  };

  const updateLocationState = (locationId, field, value) => {
    setHistories((previous) =>
      previous.map((group) => ({
        ...group,
        items: Array.isArray(group.items)
          ? group.items.map((item) =>
              item?.locationId === locationId
                ? {
                    ...item,
                    [field]: value,
                  }
                : item
            )
          : [],
      }))
    );
  };

  const handleToggleLike = async (item) => {
    const locationId = item?.locationId;

    if (locationId == null || updatingLikeLocationId != null) {
      return;
    }

    const previousLiked = item?.liked === true;
    const nextLiked = !previousLiked;

    try {
      setUpdatingLikeLocationId(locationId);

      updateLocationState(locationId, 'liked', nextLiked);

      if (nextLiked) {
        await LocationService.likeLocation(locationId);
      } else {
        await LocationService.unlikeLocation(locationId);
      }
    } catch (error) {
      updateLocationState(locationId, 'liked', previousLiked);

      console.error('장소 좋아요 변경 실패:', error);

      notification.error({
        message: '좋아요 변경에 실패했습니다.',
        description:
          error?.response?.data?.message ??
          error?.message ??
          '잠시 후 다시 시도해주세요.',
        placement: 'topRight',
        duration: 4.5,
      });
    } finally {
      setUpdatingLikeLocationId(null);
    }
  };

  const handleToggleArchive = async (item) => {
    const locationId = item?.locationId;

    if (locationId == null || updatingArchiveLocationId != null) {
      return;
    }

    const previousArchived = item?.archived === true;
    const nextArchived = !previousArchived;

    try {
      setUpdatingArchiveLocationId(locationId);

      updateLocationState(locationId, 'archived', nextArchived);

      if (nextArchived) {
        await LocationService.archiveLocation(locationId);
      } else {
        await LocationService.unarchiveLocation(locationId);
      }
    } catch (error) {
      updateLocationState(locationId, 'archived', previousArchived);

      console.error('장소 북마크 변경 실패:', error);

      notification.error({
        message: '북마크 변경에 실패했습니다.',
        description:
          error?.response?.data?.message ??
          error?.message ??
          '잠시 후 다시 시도해주세요.',
        placement: 'topRight',
        duration: 4.5,
      });
    } finally {
      setUpdatingArchiveLocationId(null);
    }
  };

  const handleToggleDeleteMenu = (item) => {
    const itemKey = getItemKey(item);

    setOpenedDeleteMenuId((previous) =>
      previous === itemKey ? null : itemKey
    );
  };

  const handleDeleteVisitVerification = async (item) => {
    const visitVerificationId = item?.visitVerificationId;

    if (visitVerificationId == null) {
      notification.warning({
        message: '삭제할 수 없습니다.',
        description: '방문 인증 ID 정보가 없습니다.',
        placement: 'topRight',
        duration: 4.5,
      });

      return;
    }

    if (deletingVerificationId != null) {
      return;
    }

    try {
      setDeletingVerificationId(visitVerificationId);

      await VerifyService.deleteVisitVerification(visitVerificationId);

      setHistories((previous) =>
        previous
          .map((group) => ({
            ...group,
            items: Array.isArray(group.items)
              ? group.items.filter(
                  (historyItem) =>
                    historyItem?.visitVerificationId !== visitVerificationId
                )
              : [],
          }))
          .filter((group) => group.items.length > 0)
      );

      setOpenedDeleteMenuId(null);

      notification.success({
        message: '방문 인증이 삭제되었습니다.',
        placement: 'topRight',
        duration: 3,
      });
    } catch (error) {
      console.error('방문 인증 삭제 실패:', error);

      notification.error({
        message: '방문 인증 삭제에 실패했습니다.',
        description:
          error?.response?.data?.message ?? '잠시 후 다시 시도해주세요.',
        placement: 'topRight',
        duration: 4.5,
      });
    } finally {
      setDeletingVerificationId(null);
    }
  };

  const handleSwiperInit = (date, swiper) => {
    const total = swiper?.slides?.length ?? 0;

    setSlideStates((previous) => ({
      ...previous,
      [date]: {
        current: total > 0 ? 1 : 0,
        total,
      },
    }));
  };

  const handleSlideChange = (date, swiper) => {
    const total = swiper?.slides?.length ?? 0;

    setSlideStates((previous) => ({
      ...previous,
      [date]: {
        current: total > 0 ? swiper.activeIndex + 1 : 0,
        total,
      },
    }));
  };

  const formatDate = (date) => {
    if (!date) {
      return '';
    }

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    return `${Number(parts[1])}/${Number(parts[2])}`;
  };

  const formatTime = (dateTime) => {
    if (!dateTime) {
      return '--:--';
    }

    const timePart = dateTime.split('T')[1];

    if (!timePart) {
      return '--:--';
    }

    return timePart.slice(0, 5);
  };

  const getLocationText = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return '지역 정보 없음';
    }

    const cities = [
      ...new Set(items.map((item) => item?.city).filter(Boolean)),
    ];

    if (cities.length === 0) {
      return '지역 정보 없음';
    }

    if (cities.length === 1) {
      return cities[0];
    }

    return `${cities[0]} 외 ${cities.length - 1}곳`;
  };

  const getLocationName = (item) => item?.locationName ?? '장소명';

  const getLocationAddress = (item) => {
    if (typeof item?.locationAddress === 'string') {
      return item.locationAddress || '주소 정보가 없습니다.';
    }

    if (item?.locationAddress?.address) {
      return item.locationAddress.address;
    }

    return '주소 정보가 없습니다.';
  };

  const getLocationImage = (item) =>
    item?.locationImageUrl ??
    item?.locationPictureUrl ??
    item?.mainImageUrl ??
    DEFAULT_IMAGE_URL;

  const getContentTitle = (item) => item?.contentTitle ?? 'media name';

  const getArtists = (item) => {
    if (Array.isArray(item?.artists) && item.artists.length > 0) {
      return item.artists.map((artist) => ({
        artistId: artist?.artistId ?? artist?.id ?? null,

        artistName: artist?.artistName ?? artist?.name ?? 'artist name',
      }));
    }

    if (Array.isArray(item?.artistIds) && item.artistIds.length > 0) {
      return item.artistIds.map((artistId) => ({
        artistId,
        artistName: 'artist name',
      }));
    }

    return [];
  };

  return (
    <main className="archive">
      <div className="container">
        <section className="tabs archive">
          <button type="button" className="tab selected">
            아카이브
          </button>

          <button type="button" className="tab">
            북마크
          </button>

          <button type="button" className="tab">
            좋아요
          </button>
        </section>

        <section className="archive-filter">
          <div className="archive-filter-types">
            <button
              type="button"
              className={filterType === FILTER_TYPE.ALL ? 'selected' : ''}
              onClick={() => handleFilterType(FILTER_TYPE.ALL)}
            >
              전체
            </button>

            <button
              type="button"
              className={filterType === FILTER_TYPE.MONTH ? 'selected' : ''}
              onClick={() => handleFilterType(FILTER_TYPE.MONTH)}
            >
              월별
            </button>

            <button
              type="button"
              className={filterType === FILTER_TYPE.PERIOD ? 'selected' : ''}
              onClick={() => handleFilterType(FILTER_TYPE.PERIOD)}
            >
              기간 선택
            </button>
          </div>

          {filterType === FILTER_TYPE.MONTH && (
            <div className="archive-month-filter">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from(
                  {
                    length: 5,
                  },
                  (_, index) => currentYear - index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Array.from(
                  {
                    length: 12,
                  },
                  (_, index) => index + 1
                ).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === FILTER_TYPE.PERIOD && (
            <div className="archive-period-filter">
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <span>~</span>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </section>

        {isLoading && histories.length === 0 && (
          <section className="archive-list">
            <p>방문 인증 내역을 불러오는 중입니다.</p>
          </section>
        )}

        {!isLoading && histories.length === 0 && (
          <section className="archive-list">
            <p>방문 인증 내역이 없습니다.</p>
          </section>
        )}

        {histories.map((historyGroup) => {
          const date = historyGroup?.date;

          const items = Array.isArray(historyGroup?.items)
            ? historyGroup.items
            : [];

          if (!date) {
            return null;
          }

          const currentSlide =
            slideStates[date]?.current ?? (items.length > 0 ? 1 : 0);

          const totalSlides = items.length;

          const navigationKey = date.replaceAll('-', '');

          const prevClass = `archive-prev-${navigationKey}`;

          const nextClass = `archive-next-${navigationKey}`;

          return (
            <section className="archive-list" key={date}>
              <div className="archive-header">
                <div className="date-location">
                  <span className="date">{formatDate(date)}</span>

                  <span className="location">{getLocationText(items)}</span>
                </div>

                <span className="count">
                  <span className="current accent-text">
                    {String(currentSlide).padStart(2, '0')}
                  </span>

                  <span className="divider">/</span>

                  <span className="total">
                    {String(totalSlides).padStart(2, '0')}
                  </span>
                </span>
              </div>

              <div className="swiper-container">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                  }}
                  onInit={(swiper) => handleSwiperInit(date, swiper)}
                  onSlideChange={(swiper) => handleSlideChange(date, swiper)}
                >
                  {items.map((item, index) => {
                    const artists = getArtists(item);

                    const itemKey = getItemKey(item);

                    const isDeleteMenuOpen = openedDeleteMenuId === itemKey;

                    const isDeleting =
                      deletingVerificationId === item?.visitVerificationId;

                    const isUpdatingLike =
                      updatingLikeLocationId === item?.locationId;

                    const isUpdatingArchive =
                      updatingArchiveLocationId === item?.locationId;

                    return (
                      <SwiperSlide key={itemKey || `${date}-${index}`}>
                        <article className="archive-item">
                          <div className="image">
                            <img
                              src={getLocationImage(item)}
                              alt={getLocationName(item)}
                            />
                          </div>

                          <div className="actions relative">
                            <div className="left">
                              <button
                                type="button"
                                className={`icon heart ${
                                  item?.liked ? 'selected' : ''
                                }`}
                                disabled={isUpdatingLike}
                                aria-pressed={item?.liked === true}
                                onClick={() => handleToggleLike(item)}
                              >
                                <HeartIcon
                                  weight={item?.liked ? 'fill' : 'regular'}
                                />
                              </button>

                              <button
                                type="button"
                                className={`icon bookmark ${
                                  item?.archived ? 'selected' : ''
                                }`}
                                disabled={isUpdatingArchive}
                                aria-pressed={item?.archived === true}
                                onClick={() => handleToggleArchive(item)}
                              >
                                <BookmarkSimpleIcon
                                  weight={item?.archived ? 'fill' : 'regular'}
                                />
                              </button>
                            </div>

                            <div className="right">
                              <button type="button" className="icon edit">
                                <PencilSimpleLineIcon />
                              </button>

                              <button
                                type="button"
                                className="icon more"
                                onClick={() => handleToggleDeleteMenu(item)}
                              >
                                <DotsThreeVerticalIcon />
                              </button>
                            </div>

                            {isDeleteMenuOpen && (
                              <div className="delete-menu">
                                <button
                                  type="button"
                                  className="delete"
                                  disabled={isDeleting}
                                  onClick={() =>
                                    handleDeleteVisitVerification(item)
                                  }
                                >
                                  {isDeleting ? '삭제 중...' : '단일 삭제'}
                                </button>

                                <button type="button" className="delete-all">
                                  전체 삭제
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="place-info">
                            <div className="title-row">
                              <span className="title">
                                {getLocationName(item)}
                              </span>

                              <span className="created-at">
                                {formatTime(item?.visitVerifiedTimeAt)}
                              </span>
                            </div>

                            <p className="description">
                              {getLocationAddress(item)}
                            </p>

                            <div className="tags">
                              {artists.map((artist, artistIndex) => (
                                <Link
                                  to={
                                    artist.artistId != null
                                      ? `/artists/${artist.artistId}`
                                      : '#'
                                  }
                                  className="tag"
                                  key={
                                    artist.artistId ??
                                    `${itemKey}-artist-${artistIndex}`
                                  }
                                >
                                  {artist.artistName}
                                </Link>
                              ))}

                              <Link
                                to={
                                  item?.contentId != null
                                    ? `/contents/${item.contentId}`
                                    : '#'
                                }
                                className="tag"
                              >
                                {getContentTitle(item)}
                              </Link>
                            </div>
                          </div>
                        </article>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>

                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`navigation icon prev ${prevClass}`}
                    >
                      <CaretLeftIcon />
                    </button>

                    <button
                      type="button"
                      className={`navigation icon next ${nextClass}`}
                    >
                      <CaretRightIcon />
                    </button>
                  </>
                )}
              </div>
            </section>
          );
        })}

        <div ref={loadMoreRef} className="archive-load-more">
          {isLoadingMore && <p>방문 인증 내역을 더 불러오는 중입니다.</p>}

          {!hasNext && histories.length > 0 && <p>마지막 방문 인증입니다.</p>}
        </div>
      </div>
    </main>
  );
}

export default Archive;
