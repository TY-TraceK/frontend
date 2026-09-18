import apiClient from '@/api/apiClient.js';

const SearchService = {
  async search(keyword) {
    const response = await apiClient.get('/search', {
      params: { keyword },
    });

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    return result.data;
  },
};

export default SearchService;
