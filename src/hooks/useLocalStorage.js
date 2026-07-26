// useLocalStorage.js
// Hook utilitário para sincronizar estado React com o localStorage.
// Funciona como useState, mas persiste o valor entre recarregamentos de página.
//
// Uso: const [valor, setValor] = useLocalStorage('minha-chave', valorInicial)

import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // Inicializa o estado lendo do localStorage, ou usa o valor padrão
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage[${key}]:`, error);
      return initialValue;
    }
  });

  // Atualiza o estado e sincroniza com o localStorage
  const setValue = (value) => {
    try {
      // Aceita tanto um valor direto quanto uma função atualizadora (como o setState padrão)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar localStorage[${key}]:`, error);
    }
  };

  return [storedValue, setValue];
}