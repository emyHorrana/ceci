// Entrada.jsx
// Componente da rota raiz ("/"). Decide o que a pessoa vê primeiro:
// - Sessão ativa                    -> Dashboard
// - Onboarding já concluído antes   -> Login
// - Primeira visita (sem sessão e sem onboarding concluído) -> BoasVindas
//
// Antes, "/" era sempre o Login e o onboarding (BoasVindas.jsx) só era
// visto por quem digitasse a URL manualmente - ver comentário que existia
// em BoasVindas.jsx sobre isso ainda estar pendente.

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import BoasVindas from './BoasVindas';

export default function Entrada() {
  const { user, initializing } = useContext(UserContext);
  const [onboarding] = useLocalStorage('ceci_onboarding', {});

  // Evita um "flash" de BoasVindas ou Login antes da sessão salva ser
  // restaurada (mesmo cuidado que Dashboard.jsx toma com 'initializing').
  if (initializing) return null;

  if (user) return <Navigate to="/dashboard" replace />;
  if (onboarding?.concluido) return <Navigate to="/login" replace />;

  return <BoasVindas />;
}
