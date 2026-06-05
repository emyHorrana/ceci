// useAccessibility.js
// Hook de acessibilidade do CECI.
// Gerencia preferências visuais do aluno: zoom, alto contraste e fontes grandes.
// Todas as preferências são persistidas no localStorage via useLocalStorage.
//
// Retorna: { zoomLevel, highContrast, setHighContrast, largeFonts, setLargeFonts,
//            increaseZoom, decreaseZoom, resetZoom }

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useAccessibility() {
  // Zoom: valor em percentual (80% a 200%), padrão 100%
  const [zoomLevel, setZoomLevel] = useLocalStorage('ceci-zoom', 100);

  // Alto contraste: melhora legibilidade para alunos com baixa visão
  const [highContrast, setHighContrast] = useLocalStorage('ceci-high-contrast', false);

  // Fontes grandes: aumenta o tamanho base dos textos da interface
  const [largeFonts, setLargeFonts] = useLocalStorage('ceci-large-fonts', false);

  // Aumenta o zoom em 10%, respeitando o limite máximo de 200%
  const increaseZoom = useCallback(() => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  }, [zoomLevel, setZoomLevel]);

  // Diminui o zoom em 10%, respeitando o limite mínimo de 80%
  const decreaseZoom = useCallback(() => {
    if (zoomLevel > 80) {
      setZoomLevel(zoomLevel - 10);
    }
  }, [zoomLevel, setZoomLevel]);

  // Restaura o zoom para o valor padrão (100%)
  const resetZoom = useCallback(() => {
    setZoomLevel(100);
  }, [setZoomLevel]);

  return {
    zoomLevel,
    highContrast,
    setHighContrast,
    largeFonts,
    setLargeFonts,
    increaseZoom,
    decreaseZoom,
    resetZoom,
  };
}