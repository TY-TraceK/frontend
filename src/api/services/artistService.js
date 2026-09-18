import apiClient from '@/api/apiClient.js';

const ArtistService = {
  async getArtistLocations({ artistId, city, lastCount, lastId, size } = {}) {
    const params = {
      ...(city && { city }),
      ...(lastCount != null && { lastCount }),
      ...(lastId != null && { lastId }),
      ...(size != null && { size }),
    };

    const response = await apiClient.get(`/artists/${artistId}/locations`, {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async getArtistContents({ artistId, lastCount, lastId, size } = {}) {
    const params = {
      ...(lastCount != null && { lastCount }),
      ...(lastId != null && { lastId }),
      ...(size != null && { size }),
    };

    const response = await apiClient.get(`/artists/${artistId}/contents`, {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async followArtist(artistId) {
    const response = await apiClient.post(`/artists/${artistId}/fans`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async unfollowArtist(artistId) {
    const response = await apiClient.delete(`/artists/${artistId}/fans`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default ArtistService;
