// useLesson.js
// Hook de acesso ao LessonContext.
// Atalho para usar dados e ações de lição sem importar o contexto diretamente.
//
// Retorna: { lesson, loading, error, fetchLesson, updateProgress, submitExercise }
// Lança erro se usado fora do LessonProvider.

import { useContext } from 'react';
import { LessonContext } from '../context/LessonContext';

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson deve ser usado dentro de LessonProvider');
  }
  return context;
}