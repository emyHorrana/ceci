// useProgress.js
// Hook de acesso ao ProgressContext.
// Atalho para usar dados e ações de progresso sem importar o contexto diretamente.
//
// Retorna: { progress, modules, loading, fetchProgress, fetchModules, updateProgress }
// Lança erro se usado fora do ProgressProvider.

import { useContext } from 'react';
import { ProgressContext } from '../context/ProgressContext';

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  }
  return context;
}