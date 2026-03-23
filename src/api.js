import axios from 'axios';
//9bt7tsng-8000.inc1.devtunnels.ms/
const BASE_URL = process.env.REACT_APP_API_URL || 'https://9bt7tsng-8000.inc1.devtunnels.ms/';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Auto-attach Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 — clear tokens and redirect to Welcome
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
