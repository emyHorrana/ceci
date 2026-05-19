import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContext';

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  }
  return context;
}