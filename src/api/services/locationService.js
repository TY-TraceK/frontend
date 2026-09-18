import apiClient from '@/api/apiClient.js';

const LocationService = {
  async getTopSavedLocations(limit = 5) {
    const response = await apiClient.get('/locations/top-saved', {
      params: { limit },
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async getLocationDetail({ locationId, lastCount, lastId, size } = {}) {
    const params = {
      ...(lastCount != null && { lastCount }),
      ...(lastId != null && { lastId }),
      ...(size != null && { size }),
    };

    const response = await apiClient.get(`/locations/${locationId}`, {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async likeLocation(locationId) {
    const response = await apiClient.put(`/locations/${locationId}/likes`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async unlikeLocation(locationId) {
    const response = await apiClient.delete(`/locations/${locationId}/likes`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async archiveLocation(locationId) {
    const response = await apiClient.put(`/locations/${locationId}/archives`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async unarchiveLocation(locationId) {
    const response = await apiClient.delete(`/locations/${locationId}/archives`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default LocationService;
