import axios from 'axios';

// Create Axios client. Since Vite proxy routes '/api' to 'http://localhost:5000/api' in development,
// we can use a relative path, falling back to localhost:5000 in case of direct access.
const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
