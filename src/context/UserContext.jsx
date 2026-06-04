import { createContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as authService from '../services/auth';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restaura sessão ao carregar o app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata?.nome || session.user.email,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          nome: session.user.user_metadata?.nome || session.user.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const supabaseUser = await authService.login(email, password);
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        nome: supabaseUser.user_metadata?.nome || supabaseUser.email,
      };
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const guestLogin = useCallback(() => {
    setUser({
      id: null,
      email: 'visitante@ceci.app',
      nome: 'Visitante',
      guest: true,
    });
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await authService.logout();
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const supabaseUser = await authService.register(userData);
      const newUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        nome: userData.nome,
      };
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { user, loading, error, login, guestLogin, logout, register };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}