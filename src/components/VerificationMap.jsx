import { useEffect, useRef, useState } from 'react';

const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

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

function VerificationMap({ latitude, longitude, initialZoom = 2 }) {
  const mapRef = useRef(null);
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
        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);
      })
      .catch(() => !cancelled && setError('지도를 불러오지 못했습니다.'));

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, initialZoom]);

  return <div className="verification-map" ref={mapRef}>{error}</div>;
}

export default VerificationMap;
