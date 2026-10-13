// api.js
// Cliente HTTP centralizado da aplicação CECI.
// Utiliza axios com interceptors para:
//   - Injetar o session.access_token do Supabase Auth em todas as requisições autenticadas
//   - Tratar erros globais (ex: token expirado → encerra sessão e redireciona)
//
// Todos os services da aplicação importam este cliente em vez de usar axios diretamente.

import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

// URL base da API: usa variável de ambiente ou localhost em desenvolvimento.
// Ignora se VITE_API_URL apontar erroneamente para a URL do Supabase (.supabase.co),
// pois as rotas da API do CECI são servidas pelo Express (local ou /api na Vercel).
const rawApiUrl = import.meta.env.VITE_API_URL;
const isSupabaseUrl = typeof rawApiUrl === 'string' && rawApiUrl.includes('supabase.co');
const API_BASE_URL = (rawApiUrl && !isSupabaseUrl)
  ? rawApiUrl
  : (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição: injeta o access_token da sessão do Supabase no header Authorization
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Erro ao obter token da sessão do Supabase:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: trata erros globais
// 401 = token expirado ou inválido → limpa sessão no Supabase e redireciona para login
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await supabase.auth.signOut();
      } catch (_) {
        // ignora erro ao deslogar
      }

      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;