// useTextSize.js
// Hook de acesso ao TextSizeContext.
// Atalho para usar/alterar o tamanho de texto sem importar o contexto diretamente.
//
// Retorna: { textSize, setTextSize, niveis, rotulos }

import { useContext } from 'react';
import { TextSizeContext } from '../context/TextSizeContext';

export function useTextSize() {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error('useTextSize deve ser usado dentro de TextSizeProvider');
  }
  return context;
}