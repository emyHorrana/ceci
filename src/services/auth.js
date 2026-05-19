import apiClient from './api';

export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('ceci-token', response.token);
  return response.user;
}

export async function register(userData) {
  const response = await apiClient.post('/auth/register', userData);
  localStorage.setItem('ceci-token', response.token);
  return response.user;
}

export function logout() {
  localStorage.removeItem('ceci-token');
}

export async function getCurrentUser() {
  return await apiClient.get('/auth/me');
}
