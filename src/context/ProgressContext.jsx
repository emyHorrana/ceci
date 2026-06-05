// ProgressContext.jsx
// Contexto global de progresso do aluno.
// Gerencia: progresso geral, módulos disponíveis e atualização de progresso por lição.

import { createContext, useState, useCallback } from 'react';
import * as progressService from '../services/progressService';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const [modules, setModules]   = useState([]);
  const [loading, setLoading]   = useState(false);

  const fetchProgress = useCallback(async (userId) => {
    try {
      const data = await progressService.getUserProgress(userId);
      setProgress(data);
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
    }
  }, []);

  // Busca módulos E progresso geral ao mesmo tempo —
  // o Dashboard só chama fetchModules, então fazemos os dois aqui.
  const fetchModules = useCallback(async (userId) => {
    setLoading(true);
    try {
      const [modulosData, progressoData] = await Promise.all([
        progressService.getUserModules(userId),
        progressService.getUserProgress(userId),
      ]);
      setModules(modulosData);
      setProgress(progressoData);
    } catch (err) {
      console.error('Erro ao buscar módulos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (licaoId, userId, progressData) => {
    try {
      const updated = await progressService.updateProgress(licaoId, userId, progressData);
      await fetchModules(userId);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  }, [fetchModules]);

  const value = {
    progress,
    modules,
    loading,
    fetchProgress,
    fetchModules,
    updateProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}