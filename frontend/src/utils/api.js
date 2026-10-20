import axios from 'axios';

// Uses the deployed backend when REACT_APP_API_URL is set, otherwise your local backend
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server rejects our token (expired / invalid), clear the session and go to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = (err.config?.url || '').includes('/auth/');
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export default api;
