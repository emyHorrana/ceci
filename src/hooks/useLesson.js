import { useContext } from 'react';
import { LessonContext } from '../context/LessonContext';

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson deve ser usado dentro de LessonProvider');
  }
  return context;
}