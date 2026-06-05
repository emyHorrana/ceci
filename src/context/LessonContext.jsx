// LessonContext.jsx
// Contexto global da lição em curso.
// Gerencia: carregamento da lição, atualização de progresso e envio de respostas.
//
// Uso: envolva os componentes que precisam da lição com <LessonProvider>.
// Para consumir: const { lesson, fetchLesson } = useContext(LessonContext)
// ou use o hook useLesson() de hooks/useLesson.js.

import { createContext, useState, useCallback } from 'react';
import * as lessonService from '../services/lessonService';

export const LessonContext = createContext();

export function LessonProvider({ children }) {
  const [lesson, setLesson] = useState(null);   // Dados da lição: título, steps, tipo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Busca os dados completos de uma lição pelo ID
  const fetchLesson = useCallback(async (lessonId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await lessonService.getLesson(lessonId);
      setLesson(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza o progresso do aluno na lição (ex: step concluído, lição finalizada)
  const updateProgress = useCallback(async (lessonId, progressData) => {
    try {
      return await lessonService.updateLessonProgress(lessonId, progressData);
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  }, []);

  // Envia a resposta do aluno para um exercício e retorna o feedback
  const submitExercise = useCallback(async (lessonId, exerciseId, answer) => {
    try {
      return await lessonService.submitExerciseAnswer(lessonId, exerciseId, answer);
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
      throw err;
    }
  }, []);

  const value = {
    lesson,
    loading,
    error,
    fetchLesson,
    updateProgress,
    submitExercise,
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}
