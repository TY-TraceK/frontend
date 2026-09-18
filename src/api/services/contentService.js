import apiClient from '@/api/apiClient.js';

const ContentService = {
  async getContentsByCategory({
    category,
    page = 0,
    size = 10,
    sort = 'id,DESC',
  } = {}) {
    const response = await apiClient.get(`/contents/category/${category}`, {
      params: { page, size, sort },
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async getContentDetail({ contentId, city, lastCount, lastId, size } = {}) {
    const params = {
      ...(city && { city }),
      ...(lastCount != null && { lastCount }),
      ...(lastId != null && { lastId }),
      ...(size != null && { size }),
    };

    const response = await apiClient.get(`/contents/${contentId}`, {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async followContent(contentId) {
    const response = await apiClient.post(`/contents/${contentId}/fans`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async unfollowContent(contentId) {
    const response = await apiClient.delete(`/contents/${contentId}/fans`);

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default ContentService;
