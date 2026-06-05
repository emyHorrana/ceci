// storageService.js
// Serviço utilitário para manipulação do localStorage no CECI.
// Centraliza todas as operações de leitura e escrita local, incluindo:
//   - Dados do usuário logado
//   - Token JWT de autenticação
//   - Cache com TTL (tempo de vida configurável)
//   - Preferências de acessibilidade e interface

export const storageService = {

  // --- USUÁRIO ---

  // Salva os dados do usuário logado no localStorage
  saveUser: (user) => localStorage.setItem('ceci-user', JSON.stringify(user)),

  // Retorna os dados do usuário logado, ou null se não encontrado
  getUser: () => {
    const user = localStorage.getItem('ceci-user');
    return user ? JSON.parse(user) : null;
  },

  // Remove os dados do usuário do localStorage (usado no logout)
  clearUser: () => localStorage.removeItem('ceci-user'),


  // --- TOKEN JWT ---

  // Salva o token de autenticação no localStorage
  saveToken: (token) => localStorage.setItem('ceci-token', token),

  // Retorna o token de autenticação salvo
  getToken: () => localStorage.getItem('ceci-token'),

  // Remove o token do localStorage (usado no logout)
  clearToken: () => localStorage.removeItem('ceci-token'),


  // --- CACHE COM TTL ---

  // Salva dados em cache com tempo de expiração
  // ttl: tempo de vida em milissegundos (padrão: 1 hora)
  saveCache: (key, data, ttl = 3600000) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`ceci-cache-${key}`, JSON.stringify(cacheData));
  },

  // Retorna dados do cache se ainda válidos; remove e retorna null se expirado
  getCache: (key) => {
    const cached = localStorage.getItem(`ceci-cache-${key}`);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    if (Date.now() - timestamp > ttl) {
      localStorage.removeItem(`ceci-cache-${key}`);
      return null;
    }
    return data;
  },

  // Remove um item específico do cache
  clearCache: (key) => localStorage.removeItem(`ceci-cache-${key}`),


  // --- PREFERÊNCIAS ---

  // Salva as preferências do aluno (acessibilidade, tema, etc.)
  savePreferences: (preferences) =>
    localStorage.setItem('ceci-preferences', JSON.stringify(preferences)),

  // Retorna as preferências salvas, ou objeto vazio se não encontradas
  getPreferences: () => {
    const prefs = localStorage.getItem('ceci-preferences');
    return prefs ? JSON.parse(prefs) : {};
  },
};