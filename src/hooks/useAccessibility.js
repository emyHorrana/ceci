import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useAccessibility() {
  const [zoomLevel, setZoomLevel] = useLocalStorage('ceci-zoom', 100);
  const [highContrast, setHighContrast] = useLocalStorage('ceci-high-contrast', false);
  const [largeFonts, setLargeFonts] = useLocalStorage('ceci-large-fonts', false);

  const increaseZoom = useCallback(() => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 10);
    }
  }, [zoomLevel, setZoomLevel]);

  const decreaseZoom = useCallback(() => {
    if (zoomLevel > 80) {
      setZoomLevel(zoomLevel - 10);
    }
  }, [zoomLevel, setZoomLevel]);

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
    resetZoom
  };
}
