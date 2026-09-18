// UserContext.jsx
// Contexto global de autenticação e dados do usuário.
// Disponibiliza: user, loading, error, login, logout, register.
//
// Uso: envolva os componentes que precisam de dados do usuário com <UserProvider>.
// Para consumir: const { user, login } = useContext(UserContext)
// ou use o hook useUser() de hooks/useUser.js.

import { createContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/auth';
import { getUsuario } from '../services/usuarioService';

export const UserContext = createContext();

// Garante que o nome e o tipo de conta (aluno/admin) do usuário estejam
// normalizados e acessíveis em `user.nome` / `user.tipo`. `tipo` sempre
// vem da tabela `usuarios` (nunca do metadata de auth, que o próprio
// usuário poderia editar) - ver services/usuarioService.js e
// utils/roles.js pro uso desse campo no resto do app.
async function enrichUserData(userData, fallbackNome = '') {
  if (!userData) return null;
  let nome = fallbackNome
      || userData.user_metadata?.nome
      || userData.user_metadata?.name
      || userData.user_metadata?.full_name
      || userData.nome;

  let tipo = userData.tipo;

  if ((!nome || !tipo) && userData.id) {
    try {
      const perfil = await getUsuario(userData.id);
      if (perfil?.nome && !nome) {
        nome = perfil.nome;
      }
      if (perfil?.tipo) {
        tipo = perfil.tipo;
      }
    } catch (err) {
      console.warn('Erro ao carregar perfil:', err);
    }
  }

  const finalNome = nome || (userData.email ? userData.email.split('@')[0] : '');

  return {
    ...userData,
    nome: finalNome,
    tipo: tipo || 'aluno',
  };
}

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
        .then(async (userData) => {
          if (ativo) {
            const enriched = await enrichUserData(userData);
            if (ativo) setUser(enriched);
          }
        })
        .catch(() => {
          if (ativo) setUser(null);
        })
        .finally(() => {
          if (ativo) setInitializing(false);
        });

    const unsubscribe = authService.onAuthStateChange(async (userData) => {
      if (ativo) {
        const enriched = await enrichUserData(userData);
        if (ativo) {
          setUser(enriched);
          setInitializing(false);
        }
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
      const enriched = await enrichUserData(userData);
      setUser(enriched);
      return enriched;
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
      const enriched = await enrichUserData(newUser, userData?.nome);
      setUser(enriched);
      return enriched;
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