import axios from 'axios';
import { emitToast } from '../components/ui/toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('pg_refresh_token');

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      refreshPromise ||= api.post('/auth/refresh', { refreshToken }).finally(() => {
        refreshPromise = null;
      });

      try {
        const { data } = await refreshPromise;
        localStorage.setItem('pg_token', data.data.token);
        localStorage.setItem('pg_refresh_token', data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('pg_token');
        localStorage.removeItem('pg_refresh_token');
        localStorage.removeItem('pg_user');
        emitToast({ title: 'Session expired', description: 'Please sign in again.', variant: 'destructive' });
        window.location.assign('/login');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.message) {
      emitToast({ title: 'Request failed', description: error.response.data.message, variant: 'destructive' });
    }

    return Promise.reject(error);
  }
);

export default api;
