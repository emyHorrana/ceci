// api.js
// Cliente HTTP centralizado da aplicação CECI.
// Utiliza axios com interceptors para:
//   - Injetar o token JWT em todas as requisições autenticadas
//   - Tratar erros globais (ex: token expirado → redireciona para login)
//
// Todos os services da aplicação importam este cliente em vez de usar axios diretamente.

import axios from 'axios';

// URL base da API: usa variável de ambiente ou localhost em desenvolvimento
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição: injeta o token JWT no header Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ceci-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: trata erros globais
// 401 = token expirado ou inválido → limpa sessão e redireciona para login
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ceci-token');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;