import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080'; // Change to actual server IP for real device

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/api/v1/auth/refresh?refreshToken=${refreshToken}`);
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          await useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          await useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
