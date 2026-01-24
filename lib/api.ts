import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://national-games-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const gamesApi = {
  getAll: () => api.get('/games'),
  getById: (id: string) => api.get(`/games/${id}`),
  create: (data: FormData) => api.post('/games', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: FormData) => api.put(`/games/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/games/${id}`),
};

export const galleryApi = {
  getAll: () => api.get('/gallery'),
  create: (data: FormData) => api.post('/gallery', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

export const statisticsApi = {
  get: () => api.get('/statistics'),
};

export const adminApi = {
  login: (username: string, password: string) => 
    api.post('/admin/login', { username, password }),
  register: (username: string, password: string) => 
    api.post('/admin/register', { username, password }),
  verify: () => api.get('/admin/verify'),
};

export default api;
