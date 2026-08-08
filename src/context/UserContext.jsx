// UserContext.jsx
// Contexto global de autenticação e dados do usuário.
// Disponibiliza: user, loading, error, login, logout, register.
//
// Uso: envolva os componentes que precisam de dados do usuário com <UserProvider>.
// Para consumir: const { user, login } = useContext(UserContext)
// ou use o hook useUser() de hooks/useUser.js.

import { createContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/auth';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 'initializing' cobre só a checagem inicial de sessão ao carregar o app
  const [initializing, setInitializing] = useState(true);

  // Ao montar o app: tenta restaurar a sessão que o Supabase já
  // persiste sozinho (localStorage) e passa a escutar mudanças
  // (login/logout em outra aba, refresh de token expirado, etc), pra
  // 'user' nunca ficar desatualizado em relação à sessão real.
  useEffect(() => {
    let ativo = true;

    authService.getCurrentUser()
      .then((userData) => {
        if (ativo) setUser(userData);
      })
      .catch(() => {
        if (ativo) setUser(null);
      })
      .finally(() => {
        if (ativo) setInitializing(false);
      });

    const unsubscribe = authService.onAuthStateChange((userData) => {
      if (ativo) {
        setUser(userData);
        setInitializing(false);
      }
    });

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, []);

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
    initializing,
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