import apiClient from '@/api/apiClient.js';

const VerifyService = {
  async getVerificationLocationCandidates({ latitude, longitude }) {
    const response = await apiClient.get(
      '/visit-verifications/location-candidates',
      {
        params: { latitude, longitude },
      }
    );

    return response.data?.data ?? { isInBusan: false, locations: [] };
  },
  async getLocationsInBounds({
    southwestLatitude,
    southwestLongitude,
    northeastLatitude,
    northeastLongitude,
    category,
    archivedOnly,
  } = {}) {
    const params = {
      ...(southwestLatitude != null && { southwestLatitude }),
      ...(southwestLongitude != null && { southwestLongitude }),
      ...(northeastLatitude != null && { northeastLatitude }),
      ...(northeastLongitude != null && { northeastLongitude }),
      ...(category && { category }),
      ...(archivedOnly != null && { archivedOnly }),
    };

    const response = await apiClient.get('/locations/bounds', { params });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
  async getLocationsWithinBounds({
    southwestLatitude,
    southwestLongitude,
    northeastLatitude,
    northeastLongitude,
    category,
  }) {
    const params = {
      southwestLatitude,
      southwestLongitude,
      northeastLatitude,
      northeastLongitude,
      archivedOnly: false,
    };

    if (category) {
      params.category = category;
    }

    const response = await apiClient.get('/locations/bounds', {
      params,
    });

    return response.data?.data?.locations ?? [];
  },

  /**
   * 관광지 연관 콘텐츠 + 아티스트 조회
   *
   * GET /api/locations/{locationId}/related-info
   */
  async getLocationRelatedInfo(locationId) {
    const response = await apiClient.get(
      `/locations/${locationId}/related-info`
    );

    return response.data?.data;
  },

  /**
   * 방문 인증
   *
   * POST /api/visit-verifications
   */
  async createVisitVerification({
    locationId,
    contentId,
    artistIds,
    latitude,
    longitude,
  }) {
    const payload = {
      locationId,
      latitude,
      longitude,
    };

    if (contentId != null) {
      payload.contentId = contentId;
    }

    if (artistIds != null) {
      payload.artistIds = artistIds;
    }

    const response = await apiClient.post('/visit-verifications', payload);

    return response.data;
  },

  async searchArtists({ keyword, lastArtistId = null, size = 20 }) {
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
  },
  async getMyVisitVerificationHistories({
    artistId = null,
    contentId = null,
    locationId = null,
    city = null,
    status = null,
    year = null,
    month = null,
    startDate = null,
    endDate = null,
    cursorDate = null,
    size = 2,
  } = {}) {
    const params = {
      size,
    };

    if (artistId !== null) {
      params.artistId = artistId;
    }

    if (contentId !== null) {
      params.contentId = contentId;
    }

    if (locationId !== null) {
      params.locationId = locationId;
    }

    if (city) {
      params.city = city;
    }

    if (status) {
      params.status = status;
    }

    if (year !== null) {
      params.year = year;
    }

    if (month !== null) {
      params.month = month;
    }

    if (startDate) {
      params.startDate = startDate;
    }

    if (endDate) {
      params.endDate = endDate;
    }

    if (cursorDate) {
      params.cursorDate = cursorDate;
    }

    const response = await apiClient.get('/users/me/visit-verifications', {
      params,
    });

    return (
      response.data?.data ?? {
        histories: [],
        hasNext: false,
        nextCursorDate: null,
      }
    );
  },
  async deleteVisitVerification(visitVerificationId) {
    await apiClient.delete(`/visit-verifications/${visitVerificationId}`);
  },
};

export default VerifyService;
