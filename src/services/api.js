import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',   // o proxy do Vite redireciona para localhost:3001
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ceci-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou, fazer logout
      localStorage.removeItem('ceci-token');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;