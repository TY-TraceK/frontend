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

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
