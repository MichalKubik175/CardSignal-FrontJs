import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const token = localStorage.getItem('authToken');

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

);

export const checkCardLink = async (uuid) => {
  const navigate = useNavigate();
      try {
        const res = await api.get(`/api/card-links/${uuid}`);
        console.log(res.value);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 404 || err.response?.status === 500) {
          navigate('/login'); // 🔁 redirect if not found or unauthorized
        } else {
          console.error(err);
        }
      }
      };

    export const getCardLinks = async () => {
      try {
        const response = await api.get(`/api/card-links`);
        return response.data;
      } catch (error) {
        console.error('Error fetching card links:', error);
        throw error;
      }
    };
