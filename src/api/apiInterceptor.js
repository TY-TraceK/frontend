import apiClient from '@/api/apiClient';
import { TokenStorage } from '@/api/tokenStorage';
import { authService } from '@/api/services';

let refreshPromise = null;

apiClient.interceptors.response.use(
  async (response) => {
    if (response.status !== 401) {
      return response;
    }

    const originalRequest = response.config;

    // refresh 요청 자체가 401이면
    // 다시 refresh 시도하지 않음
    if (originalRequest.skipAuthRefresh) {
      return response;
    }

    // 이미 한 번 재시도한 요청이면 종료
    if (originalRequest._retry) {
      authService.logout();

      return response;
    }

    originalRequest._retry = true;

    // 여러 요청이 동시에 401이어도 refresh는 한 번만 실행
    if (!refreshPromise) {
      refreshPromise = authService.refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const isRefreshed = await refreshPromise;

    if (!isRefreshed) {
      console.log('토큰 재발급 실패');

      authService.logout();

      return response;
    }

    const newAccessToken = TokenStorage.getAccessToken();

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    // 원래 요청 재시도
    return apiClient(originalRequest);
  },

  (error) => {
    console.error('API Error:', error);

    return Promise.reject(error);
  }
);
