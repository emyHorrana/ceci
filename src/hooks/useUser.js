// useUser.js
// Hook de acesso ao UserContext.
// Atalho para usar dados e ações do usuário sem importar o contexto diretamente.
//
// Retorna: { user, loading, error, login, logout, register }
// Lança erro se usado fora do UserProvider.

import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de UserProvider');
  }
  return context;
}