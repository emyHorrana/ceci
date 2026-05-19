import { createContext, useState, useCallback } from 'react';
import * as lessonService from '../services/lessonService';

export const LessonContext = createContext();

export function LessonProvider({ children }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const updateProgress = useCallback(async (lessonId, progressData) => {
    try {
      return await lessonService.updateLessonProgress(lessonId, progressData);
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
      throw err;
    }
  }, []);

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
    submitExercise
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
}
