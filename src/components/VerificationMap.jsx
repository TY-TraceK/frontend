import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import MapMarker from './MapMarker';

const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
const VERIFICATION_RADIUS_METER = 100;

const loadKakaoMapsSdk = () => {
  if (window.kakao?.maps) return Promise.resolve(window.kakao);

  if (!window.__kakaoMapsSdkPromise) {
    window.__kakaoMapsSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
      script.onerror = () => reject(new Error('Kakao Maps SDK 로드 실패'));
      document.head.appendChild(script);
    });
  }

  return window.__kakaoMapsSdkPromise;
};

function VerificationMap({
  latitude,
  longitude,
  locations = [],
  selectedLocation,
  initialZoom = 3,
  fitLocations = false,
  onSelectLocation,
  onOutOfRange,
}) {
  const mapRef = useRef(null);
  const warnedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (latitude == null || longitude == null || !mapRef.current) return;

    let cancelled = false;
    const overlays = [];

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (cancelled || !mapRef.current) return;

        const position = new kakao.maps.LatLng(latitude, longitude);
        const map = new kakao.maps.Map(mapRef.current, {
          center: position,
          level: initialZoom,
        });

        new kakao.maps.Circle({
          map,
          center: position,
          radius: VERIFICATION_RADIUS_METER,
          strokeWeight: 2,
          strokeOpacity: 0.8,
          fillOpacity: 0.08,
        });

        if (fitLocations && locations.length > 0) {
          const bounds = new kakao.maps.LatLngBounds();

          locations.forEach((location) => {
            if (location.latitude == null || location.longitude == null) return;

            bounds.extend(
              new kakao.maps.LatLng(
                Number(location.latitude),
                Number(location.longitude)
              )
            );
          });

          map.setBounds(bounds);
        }

        locations.forEach((location) => {
          if (location.latitude == null || location.longitude == null) return;

          const container = document.createElement('div');
          const root = createRoot(container);
          const locationKey = location.id ?? location.name;
          const selectedKey = selectedLocation?.id ?? selectedLocation?.name;

          root.render(
            <MapMarker
              category={location.category ?? 'ETC'}
              name={location.name}
              count={0}
              isActive={locationKey === selectedKey}
            />
          );

          if (onSelectLocation) {
            container.addEventListener('click', () => onSelectLocation(location));
          }

          const overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(
              Number(location.latitude),
              Number(location.longitude)
            ),
            content: container,
            yAnchor: 1,
            clickable: Boolean(onSelectLocation),
          });

          overlay.setMap(map);
          overlays.push({ overlay, root });
        });

        const checkCenter = () => {
          const center = map.getCenter();
          const distance = Math.hypot(
            (center.getLat() - latitude) * 111320,
            (center.getLng() - longitude) *
              111320 *
              Math.cos((latitude * Math.PI) / 180)
          );

          if (distance > VERIFICATION_RADIUS_METER && !warnedRef.current) {
            warnedRef.current = true;
            onOutOfRange?.();
          }

          if (distance <= VERIFICATION_RADIUS_METER) {
            warnedRef.current = false;
          }
        };

        kakao.maps.event.addListener(map, 'dragend', checkCenter);
        kakao.maps.event.addListener(map, 'zoom_changed', checkCenter);
      })
      .catch(() => !cancelled && setError('지도를 불러오지 못했습니다.'));

    return () => {
      cancelled = true;
      overlays.forEach(({ overlay, root }) => {
        overlay.setMap(null);
        root.unmount();
      });
    };
  }, [
    latitude,
    longitude,
    locations,
    selectedLocation,
    initialZoom,
    fitLocations,
    onSelectLocation,
    onOutOfRange,
  ]);

  return (
    <div className="verification-map" ref={mapRef}>
      {error}
    </div>
  );
}

export default VerificationMap;
