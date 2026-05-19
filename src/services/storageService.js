export const storageService = {
  // Usuário
  saveUser: (user) => localStorage.setItem('ceci-user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('ceci-user');
    return user ? JSON.parse(user) : null;
  },
  clearUser: () => localStorage.removeItem('ceci-user'),

  // Token
  saveToken: (token) => localStorage.setItem('ceci-token', token),
  getToken: () => localStorage.getItem('ceci-token'),
  clearToken: () => localStorage.removeItem('ceci-token'),

  // Cache de dados
  saveCache: (key, data, ttl = 3600000) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`ceci-cache-${key}`, JSON.stringify(cacheData));
  },
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
  clearCache: (key) => localStorage.removeItem(`ceci-cache-${key}`),

  // Preferências
  savePreferences: (preferences) => 
    localStorage.setItem('ceci-preferences', JSON.stringify(preferences)),
  getPreferences: () => {
    const prefs = localStorage.getItem('ceci-preferences');
    return prefs ? JSON.parse(prefs) : {};
  }
};
