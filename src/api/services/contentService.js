import apiClient from '@/api/apiClient.js';

const ContentService = {
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
};

export default ContentService;
