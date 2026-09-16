import apiClient from '@/api/apiClient.js';

export const getLocationsWithinBounds = async ({
  southwestLatitude,
  southwestLongitude,
  northeastLatitude,
  northeastLongitude,
  category,
}) => {
  const params = {
    southwestLatitude,
    southwestLongitude,
    northeastLatitude,
    northeastLongitude,
  };

  if (category) {
    params.category = category;
  }

  const response = await apiClient.get('/locations/bounds', {
    params,
  });

  return response.data?.data?.locations ?? [];
};

/**
 * 관광지 연관 콘텐츠 + 아티스트 조회
 *
 * GET /api/locations/{locationId}/related-info
 */
export const getLocationRelatedInfo = async (locationId) => {
  const response = await apiClient.get(`/locations/${locationId}/related-info`);

  return response.data?.data;
};

/**
 * 방문 인증
 *
 * POST /api/visit-verifications
 */
export const createVisitVerification = async ({
  locationId,
  contentId,
  artistIds,
  latitude,
  longitude,
}) => {
  const response = await apiClient.post('/visit-verifications', {
    locationId,
    contentId,
    artistIds,
    latitude,
    longitude,
  });

  return response.data;
};

export const searchArtists = async ({
  keyword,
  lastArtistId = null,
  size = 20,
}) => {
  const params = {
    keyword,
    size,
  };

  if (lastArtistId !== null) {
    params.lastArtistId = lastArtistId;
  }

  const response = await apiClient.get('artists/search', {
    params,
  });

  return (
    response.data?.data ?? {
      artists: [],
      hasNext: false,
      lastId: null,
    }
  );
};
