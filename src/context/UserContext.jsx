// UserContext.jsx
// Contexto global de autenticação e dados do usuário.
// Disponibiliza: user, loading, error, login, logout, register.
//
// Uso: envolva os componentes que precisam de dados do usuário com <UserProvider>.
// Para consumir: const { user, login } = useContext(UserContext)
// ou use o hook useUser() de hooks/useUser.js.

import { createContext, useState, useCallback } from 'react';
import * as authService from '../services/auth';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Autentica o usuário via Supabase e armazena os dados no estado
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpa o estado do usuário e encerra a sessão no Supabase
  const logout = useCallback(async () => {
    setUser(null);
    await authService.logout();
  }, []);

  // Cadastra um novo usuário e já o autentica na aplicação
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}