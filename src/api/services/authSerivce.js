import apiClient from '@/api/apiClient.js';
import { TokenStorage } from '@/api/tokenStorage.js';

const AuthService = {
  async loginWithKakao(code) {
    const response = await apiClient.post(
      `/auth/KAKAO?code=${encodeURIComponent(code)}`
    );

    const result = response.data;

    if (!result.isSuccess) {
      throw new Error(result.message);
    }

    const data = result.data;

    TokenStorage.saveTokens(data.accessToken, data.refreshToken);

    return data;
  },

  async refreshToken() {
    try {
      const refreshToken = TokenStorage.getRefreshToken();

      if (!refreshToken) {
        TokenStorage.clear();
        return false;
      }

      const response = await apiClient.post(
        '/auth/refresh',
        {
          refreshToken,
        },
        {
          // refresh 요청 자체는 401 재발급 interceptor 제외
          skipAuthRefresh: true,
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        TokenStorage.clear();
        return false;
      }

      const data = response.data.data;

      const newAccessToken = data?.accessToken;

      const newRefreshToken = data?.refreshToken;

      if (!newAccessToken || !newRefreshToken) {
        TokenStorage.clear();
        return false;
      }

      TokenStorage.saveTokens(newAccessToken, newRefreshToken);

      console.log('토큰 재발급 성공');

      return true;
    } catch (error) {
      console.error('토큰 재발급 중 예외 발생:', error);

      TokenStorage.clear();

      return false;
    }
  },

  logout() {
    TokenStorage.clear();
  },

  isLoggedIn() {
    return !!TokenStorage.getAccessToken();
  },
};

export default AuthService;
