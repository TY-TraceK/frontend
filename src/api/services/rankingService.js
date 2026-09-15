import apiClient from '@/api/apiClient.js';

const RankingService = {
  async getRegionRanking({ topN } = {}) {
    const params = {
      ...(topN != null && { topN }),
    };

    const response = await apiClient.get('/rankings/region', {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },

  async getLocationRanking({ category, city, topN } = {}) {
    const params = {
      ...(category && { category }),
      ...(city && { city }),
      ...(topN != null && { topN }),
    };

    const response = await apiClient.get('/rankings', {
      params,
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default RankingService;
