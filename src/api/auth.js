import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiBaseUrl,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Remove tokens from storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await api.post(`/api/auth`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export default api;