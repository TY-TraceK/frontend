import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './Map.css';
import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  BookmarkSimpleIcon,
  ClockIcon,
  CoffeeIcon,
  ConfettiIcon,
  CrosshairIcon,
  ForkKnifeIcon,
  FilmSlateIcon,
  MapPinIcon,
  ShoppingBagOpenIcon,
  SynagogueIcon,
} from '@phosphor-icons/react';
import LocationService from '@/api/services/locationService.js';
import TokenStorage from '@/api/tokenStorage.js';
import MapMarker from '@/components/MapMarker.jsx';
import { LOCATION_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

// MEMO: 로그인용 Kakao SDK(Kakao.init)와는 별개로, 지도는 Kakao Maps JS SDK를 따로 로드해야 합니다.
const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
// 부산광역시청 인근 (MVP 기간 지역 고정 기준과 동일)
const DEFAULT_CENTER = { lat: 35.1795543, lng: 129.0756416 };
const DEFAULT_ZOOM_LEVEL = 6;
const SEARCH_RESULT_ZOOM_LEVEL = 4;

const CATEGORY_CHIPS = [
  { category: 'ATTRACTION', className: 'attraction', label: '관광지/명소', Icon: SynagogueIcon },
  { category: 'CULTURE', className: 'culture', label: '문화시설', Icon: BankIcon },
  { category: 'FESTIVAL', className: 'event', label: '축제/행사', Icon: ConfettiIcon },
  { category: 'FILMING_LOCATION', className: 'filming', label: '촬영지', Icon: FilmSlateIcon },
  { category: 'RESTAURANT', className: 'restaurant', label: '음식점', Icon: ForkKnifeIcon },
  { category: 'CAFE', className: 'cafe', label: '카페', Icon: CoffeeIcon },
  { category: 'ACCOMMODATION', className: 'accommodation', label: '숙박', Icon: BedIcon },
  { category: 'SHOPPING', className: 'shopping', label: '쇼핑', Icon: ShoppingBagOpenIcon },
  { category: 'ETC', className: 'other', label: '기타', Icon: AsteriskIcon },
];

const formatCount = (count) => new Intl.NumberFormat('ko-KR').format(count ?? 0);

const getCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;

function loadKakaoMapsSdk() {
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }

  if (!window.__kakaoMapsSdkPromise) {
    window.__kakaoMapsSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      };
      script.onerror = () => {
        window.__kakaoMapsSdkPromise = null;
        reject(new Error('Kakao Maps SDK 로드 실패'));
      };
      document.head.appendChild(script);
    });
  }

  return window.__kakaoMapsSdkPromise;
}

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  // Place 상세 등에서 특정 위치(lat/lng)를 지정해 들어오면 그 지점을 중심으로 지도를 띄웁니다.
  const focusLat = parseFloat(searchParams.get('lat'));
  const focusLng = parseFloat(searchParams.get('lng'));
  const hasFocusPoint = Number.isFinite(focusLat) && Number.isFinite(focusLng);
  const initialCenterRef = useRef(
    hasFocusPoint ? { lat: focusLat, lng: focusLng } : DEFAULT_CENTER
  );
  const initialZoomRef = useRef(hasFocusPoint ? SEARCH_RESULT_ZOOM_LEVEL : DEFAULT_ZOOM_LEVEL);

  const mapAreaRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const overlaysRef = useRef([]);
  const currentLocationOverlayRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // 특정 장소 인근으로 들어온 경우, 카테고리 필터 없이 전체 여행지를 보여줍니다.
  const [selectedCategory, setSelectedCategory] = useState(
    hasFocusPoint ? null : 'ATTRACTION'
  );
  const selectedCategoryRef = useRef(selectedCategory);

  const [archivedOnly, setArchivedOnly] = useState(false);
  const archivedOnlyRef = useRef(archivedOnly);

  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedLocationDetail, setSelectedLocationDetail] = useState(null);
  const selectedLocationCoordsRef = useRef(null);

  const placeSheetRef = useRef(null);
  const [placeSheetHeight, setPlaceSheetHeight] = useState(0);

  const chipsRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    archivedOnlyRef.current = archivedOnly;
  }, [archivedOnly]);

  const fetchLocationsInCurrentBounds = useCallback(async () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const bounds = map.getBounds();
    const southwest = bounds.getSouthWest();
    const northeast = bounds.getNorthEast();

    // 선택된 장소가 새 화면 범위 밖으로 나가면 바텀시트를 닫습니다.
    const kakao = window.kakao;
    const selectedCoords = selectedLocationCoordsRef.current;
    if (kakao?.maps && selectedCoords) {
      const stillVisible = bounds.contain(
        new kakao.maps.LatLng(selectedCoords.lat, selectedCoords.lng)
      );
      if (!stillVisible) {
        selectedLocationCoordsRef.current = null;
        setSelectedLocationId(null);
        setSelectedLocationDetail(null);
      }
    }

    try {
      const data = await LocationService.getLocationsInBounds({
        southwestLatitude: southwest.getLat(),
        southwestLongitude: southwest.getLng(),
        northeastLatitude: northeast.getLat(),
        northeastLongitude: northeast.getLng(),
        category: selectedCategoryRef.current,
        archivedOnly: archivedOnlyRef.current,
      });
      setLocations(data?.locations ?? []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (cancelled || !mapAreaRef.current) return;

        const map = new kakao.maps.Map(mapAreaRef.current, {
          center: new kakao.maps.LatLng(
            initialCenterRef.current.lat,
            initialCenterRef.current.lng
          ),
          level: initialZoomRef.current,
        });
        mapInstanceRef.current = map;

        kakao.maps.event.addListener(map, 'idle', fetchLocationsInCurrentBounds);
        fetchLocationsInCurrentBounds();
        setMapReady(true);
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          setMapError('지도를 불러오지 못했습니다.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchLocationsInCurrentBounds]);

  // 카테고리/북마크 필터가 바뀌면 현재 보이는 영역 기준으로 다시 조회합니다.
  useEffect(() => {
    fetchLocationsInCurrentBounds();
  }, [selectedCategory, archivedOnly, fetchLocationsInCurrentBounds]);

  const handleToggleArchivedOnly = () => {
    if (!TokenStorage.getAccessToken()) {
      window.alert('로그인 후 이용할 수 있어요.');
      return;
    }

    setArchivedOnly((prev) => !prev);
  };

  const handleSelectLocation = (locationId, coords) => {
    if (coords) {
      selectedLocationCoordsRef.current = coords;
    }
    setSelectedLocationId(locationId);
  };

  useEffect(() => {
    if (selectedLocationId == null) return;

    let cancelled = false;

    LocationService.getLocationDetail({ locationId: selectedLocationId })
      .then((data) => {
        if (!cancelled) {
          setSelectedLocationDetail(data.locationInfo);
        }
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          window.alert(e.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocationId]);

  // 바텀시트 높이만큼 위치 버튼을 띄워, 시트가 버튼을 가리지 않게 합니다.
  useLayoutEffect(() => {
    if (selectedLocationId == null || !placeSheetRef.current) {
      setPlaceSheetHeight(0);
      return;
    }

    const sheetEl = placeSheetRef.current;
    setPlaceSheetHeight(sheetEl.offsetHeight);

    const observer = new ResizeObserver(([entry]) => {
      setPlaceSheetHeight(entry.contentRect.height);
    });
    observer.observe(sheetEl);

    return () => {
      observer.disconnect();
    };
  }, [selectedLocationId, selectedLocationDetail]);

  // 마커: locations가 바뀔 때마다 CustomOverlay를 새로 그립니다.
  useEffect(() => {
    const kakao = window.kakao;
    const map = mapInstanceRef.current;
    if (!kakao?.maps || !map) return;

    overlaysRef.current.forEach(({ overlay, root }) => {
      overlay.setMap(null);
      root.unmount();
    });
    overlaysRef.current = [];

    locations.forEach((location) => {
      const container = document.createElement('div');
      container.addEventListener('click', () =>
        handleSelectLocation(location.id, {
          lat: location.latitude,
          lng: location.longitude,
        })
      );

      const root = createRoot(container);
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(location.latitude, location.longitude),
        content: container,
        yAnchor: 1,
        clickable: true,
      });
      overlay.setMap(map);

      overlaysRef.current.push({ overlay, root, location });
    });

    return () => {
      overlaysRef.current.forEach(({ overlay, root }) => {
        overlay.setMap(null);
        root.unmount();
      });
      overlaysRef.current = [];
    };
  }, [locations]);

  // 선택 상태가 바뀌면 마커를 새로 그리지 않고 active 클래스와 z-index, variant만 갱신합니다.
  // 마커 밀도 조절: 방문 인증 수 데이터가 아직 없어, 11개 이상일 때는 임시로 id 기준 상위 10개만
  // default(이름+마커)로 표시하고 나머지는 compact(점) 마커로 표시합니다.
  useEffect(() => {
    const defaultIds =
      locations.length <= 10
        ? new Set(locations.map((location) => location.id))
        : new Set(
            [...locations]
              .sort((a, b) => a.id - b.id)
              .slice(0, 10)
              .map((location) => location.id)
          );

    overlaysRef.current.forEach(({ root, overlay, location }) => {
      const isActive = location.id === selectedLocationId;

      if (typeof overlay.setZIndex === 'function') {
        overlay.setZIndex(isActive ? 10 : 1);
      }

      root.render(
        <MapMarker
          variant={defaultIds.has(location.id) ? 'default' : 'compact'}
          category={location.category}
          name={location.name}
          count={0}
          isActive={isActive}
        />
      );
    });
  }, [locations, selectedLocationId]);

  // 지도 검색(관광지 전용): 결과 위치로 지도를 이동하고 바텀시트를 갱신합니다.
  useEffect(() => {
    if (!keyword || !mapReady) return;

    let cancelled = false;

    LocationService.searchRegion({ keyword })
      .then((data) => {
        if (cancelled) return;

        const first = data?.locations?.[0];
        if (first) {
          const kakao = window.kakao;
          const map = mapInstanceRef.current;
          if (kakao?.maps && map) {
            map.setCenter(new kakao.maps.LatLng(first.latitude, first.longitude));
            map.setLevel(SEARCH_RESULT_ZOOM_LEVEL);
          }
          handleSelectLocation(first.id, { lat: first.latitude, lng: first.longitude });
        } else {
          window.alert('검색 결과가 없습니다.');
        }

        // 처리된 검색어는 URL에서 지워, 이후 액션에서 계속 재검색되지 않게 합니다.
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete('keyword');
            return next;
          },
          { replace: true }
        );
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) {
          window.alert(e.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [keyword, mapReady, setSearchParams]);

  // 현재 위치로 이동: 지도를 그 위치로 옮기고 파란 점 마커를 그립니다.
  useEffect(() => {
    const kakao = window.kakao;
    const map = mapInstanceRef.current;
    if (!currentLocation || !kakao?.maps || !map) return;

    const position = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
    map.setCenter(position);

    if (currentLocationOverlayRef.current) {
      currentLocationOverlayRef.current.setMap(null);
    }

    const dot = document.createElement('div');
    dot.className = 'current-location-dot';

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: dot,
      zIndex: 10,
    });
    overlay.setMap(map);
    currentLocationOverlayRef.current = overlay;
  }, [currentLocation]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      window.alert('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        window.alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
      }
    );
  };

  const handleChipPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = chipsRef.current.scrollLeft;
  };

  const handleChipPointerMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    chipsRef.current.scrollLeft = scrollLeft.current - deltaX;
  };

  const handleChipPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <main className="map">
      <div className="map-area" ref={mapAreaRef}>
        {mapError && <div className="map-error">{mapError}</div>}
      </div>
      <div className="frame">
        <div className="container">
          <div
            ref={chipsRef}
            className="chips"
            onPointerDown={handleChipPointerDown}
            onPointerMove={handleChipPointerMove}
            onPointerUp={handleChipPointerUp}
            onPointerLeave={handleChipPointerUp}
          >
            {CATEGORY_CHIPS.map(({ category, className, label, Icon }) => (
              <button
                key={category}
                type="button"
                className={`chip ${className} ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="icon">
                  <Icon />
                  <span className="category">{label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`floating bookmark icon ${archivedOnly ? 'active' : ''}`}
          aria-pressed={archivedOnly}
          onClick={handleToggleArchivedOnly}
        >
          <BookmarkSimpleIcon weight={archivedOnly ? 'fill' : 'regular'} />
        </button>

        <button
          type="button"
          className="floating locate icon"
          aria-label="현재 위치로 이동"
          onClick={handleLocateMe}
          style={
            selectedLocationId != null
              ? { bottom: `${70 + placeSheetHeight + 8}px` }
              : undefined
          }
        >
          <CrosshairIcon />
        </button>

        {selectedLocationId != null && (
          <section className="place-sheet" ref={placeSheetRef}>
            <div className="place-list">
              <button className="sheet-handle" aria-label="바텀시트 조절">
                <span></span>
              </button>

              {selectedLocationDetail && (
                <Link to={`/place?id=${selectedLocationId}`} className="item">
                  <div className="image">
                    <img src={selectedLocationDetail.mainImageUrl} alt="" />
                  </div>

                  <div className="place-info">
                    <div className="meta">
                      <span className="category">
                        {getCategoryLabel(selectedLocationDetail.category)}
                      </span>
                      <span className="verify-count accent-text">
                        방문 인증 {formatCount(selectedLocationDetail.totalVerificationCount)}건
                      </span>
                    </div>

                    <h2>{selectedLocationDetail.name}</h2>

                    {selectedLocationDetail.businessHours && (
                      <div className="business-hours-info">
                        <span className="icon">
                          <ClockIcon weight="fill" />
                        </span>
                        <p className="info">
                          <span className="start-time">
                            {selectedLocationDetail.businessHours}
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="address-info">
                      <span className="icon">
                        <MapPinIcon weight="fill" />
                      </span>
                      <p className="info">
                        <span className="address">
                          {selectedLocationDetail.address?.address}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Map;
