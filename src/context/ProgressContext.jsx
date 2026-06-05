import { createContext, useState, useCallback } from 'react';
import * as progressService from '../services/progressService';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async (userId) => {
    setLoading(true);
    try {
      const data = await progressService.getUserProgress(userId);
      setProgress(data);
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async (userId) => {
    setLoading(true);
    try {
      const data = await progressService.getUserModules(userId);
      setModules(data);
    } catch (err) {
      console.error('Erro ao buscar módulos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca módulos e progresso de uma vez
  const fetchDashboard = useCallback(async (userId) => {
    setLoading(true);
    try {
      const [modulesData, progressData] = await Promise.all([
        progressService.getUserModules(userId),
        progressService.getUserProgress(userId),
      ]);
      setModules(modulesData);
      setProgress(progressData);
    } catch (err) {
      console.error('Erro ao buscar dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (usuarioId, licaoId, prog, completed = false) => {
    try {
      const updated = await progressService.updateProgress(usuarioId, licaoId, prog, completed);
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  }, []);

  const value = {
    progress,
    modules,
    loading,
    fetchProgress,
    fetchModules,
    fetchDashboard,
    updateProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}