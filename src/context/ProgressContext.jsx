// ProgressContext.jsx
// Contexto global de progresso do aluno.
// Gerencia: progresso geral, módulos disponíveis, atualização de progresso por lição
// e avaliação/desbloqueio automático de conquistas do usuário.

import { createContext, useState, useCallback, useRef } from 'react';
import * as progressService from '../services/progressService';
import { sincronizarProgressoEConquistas } from '../services/achievementService';

export const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(null);
  const [modules, setModules]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationQueueRef = useRef([]);

  const showNextNotification = useCallback(() => {
    if (notificationQueueRef.current.length > 0) {
      const next = notificationQueueRef.current.shift();
      setNotification(next);
    } else {
      setNotification(null);
    }
  }, []);

  const dismissAchievementNotification = useCallback(() => {
    showNextNotification();
  }, [showNextNotification]);

  const queueAchievementNotification = useCallback((achievement) => {
    if (!achievement) return;
    notificationQueueRef.current.push(achievement);
    setNotification((curr) => {
      if (!curr) {
        return notificationQueueRef.current.shift();
      }
      return curr;
    });
  }, []);

  // Verifica e sincroniza conquistas do usuário
  const checkAchievements = useCallback(async (userId, user = null, dadosAtuais = {}) => {
    if (!userId) return [];
    try {
      const { recemDesbloqueadas, todasConquistas } = await sincronizarProgressoEConquistas(
        userId,
        user,
        dadosAtuais
      );

      // Se houve novas conquistas, atualiza o estado local e enfileira notificação
      if (recemDesbloqueadas.length > 0) {
        recemDesbloqueadas.forEach((conq) => {
          queueAchievementNotification(conq);
        });

        setProgress((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            achievements: todasConquistas,
          };
        });
      }

      return recemDesbloqueadas;
    } catch (err) {
      console.warn('Erro ao verificar conquistas:', err);
      return [];
    }
  }, [queueAchievementNotification]);

  const fetchProgress = useCallback(async (userId, user = null) => {
    try {
      const data = await progressService.getUserProgress(userId);
      setProgress(data);

      // Verifica silenciosamente se alguma conquista já foi alcançada
      if (userId) {
        const recemDesbloqueadas = await checkAchievements(userId, user, {
          achievements: data?.achievements,
          streak: data?.streak,
        });

        if (recemDesbloqueadas.length > 0) {
          const updatedData = await progressService.getUserProgress(userId);
          setProgress(updatedData);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar progresso:', err);
    }
  }, [checkAchievements]);

  // Busca módulos E progresso geral ao mesmo tempo 
  // o Dashboard só chama fetchModules, então fazemos os dois aqui.
  const fetchModules = useCallback(async (userId, user = null) => {
    setLoading(true);
    try {
      const [modulosData, progressoData] = await Promise.all([
        progressService.getUserModules(userId),
        progressService.getUserProgress(userId),
      ]);
      setModules(modulosData);
      setProgress(progressoData);

      // Avalia conquistas logo após carregar módulos e progresso
      if (userId) {
        const recemDesbloqueadas = await checkAchievements(userId, user, {
          achievements: progressoData?.achievements,
          streak: progressoData?.streak,
        });

        if (recemDesbloqueadas.length > 0) {
          const updatedProg = await progressService.getUserProgress(userId);
          setProgress(updatedProg);
        }
      }
    } catch (err) {
      console.error('Erro ao buscar módulos:', err);
    } finally {
      setLoading(false);
    }
  }, [checkAchievements]);

  const updateProgress = useCallback(async (licaoId, userId, progressData, user = null) => {
    try {
      const updated = await progressService.updateProgress(licaoId, userId, progressData);
      await fetchModules(userId, user);

      // Avaliação imediata de novas conquistas após conclusão da lição
      if (userId) {
        await checkAchievements(userId, user);
      }

      return updated;
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  }, [fetchModules, checkAchievements]);

  const value = {
    progress,
    modules,
    loading,
    achievementNotification: notification,
    dismissAchievementNotification,
    fetchProgress,
    fetchModules,
    updateProgress,
    checkAchievements,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}