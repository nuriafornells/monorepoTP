import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;