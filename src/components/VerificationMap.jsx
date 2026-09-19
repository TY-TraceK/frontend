import { useEffect, useRef, useState } from 'react';

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
  initialZoom = 3,
  onOutOfRange,
}) {
  const mapRef = useRef(null);
  const warnedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (latitude == null || longitude == null || !mapRef.current) return;
    let cancelled = false;

    loadKakaoMapsSdk()
      .then((kakao) => {
        if (cancelled || !mapRef.current) return;

        const position = new kakao.maps.LatLng(latitude, longitude);
        const map = new kakao.maps.Map(mapRef.current, {
          center: position,
          level: initialZoom,
        });

        new kakao.maps.Marker({ map, position });

        new kakao.maps.Circle({
          map,
          center: position,
          radius: VERIFICATION_RADIUS_METER,
          strokeWeight: 2,
          strokeOpacity: 0.8,
          fillOpacity: 0.08,
        });

        locations.forEach((location) => {
          if (location.latitude == null || location.longitude == null) return;
          new kakao.maps.Marker({
            map,
            position: new kakao.maps.LatLng(
              Number(location.latitude),
              Number(location.longitude)
            ),
            title: location.name,
          });
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
          if (distance <= VERIFICATION_RADIUS_METER) warnedRef.current = false;
        };

        kakao.maps.event.addListener(map, 'dragend', checkCenter);
        kakao.maps.event.addListener(map, 'zoom_changed', checkCenter);
      })
      .catch(() => !cancelled && setError('지도를 불러오지 못했습니다.'));

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, locations, initialZoom, onOutOfRange]);

  return <div className="verification-map" ref={mapRef}>{error}</div>;
}

export default VerificationMap;
