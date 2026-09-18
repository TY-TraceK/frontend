import axios from 'axios';
import { TokenStorage } from './tokenStorage';

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const apiClient = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = TokenStorage.getAccessToken();

    if (accessToken && !config.skipAuthRefresh) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

let refreshPromise = null;

const logout = () => {
  TokenStorage.clear();

  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
};

const refreshTokens = async () => {
  const refreshToken = TokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh Token이 없습니다.');
  }

  const response = await axios.post(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    {
      timeout: 8000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    }
  );

  const data = response.data?.data;

  if (!response.data?.isSuccess || !data?.accessToken || !data?.refreshToken) {
    throw new Error('토큰 재발급 응답이 올바르지 않습니다.');
  }

  TokenStorage.saveTokens(data.accessToken, data.refreshToken);

  return data.accessToken;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?._retry) {
      logout();
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 403 ||
      originalRequest?.skipAuthRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return await apiClient(originalRequest);
    } catch (refreshError) {
      logout();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
