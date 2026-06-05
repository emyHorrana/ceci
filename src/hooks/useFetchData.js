// useFetchData.js
// Hook genérico para gerenciar o ciclo de vida de chamadas assíncronas.
// Encapsula os estados de loading, data e error para qualquer função de busca.
//
// Uso:
//   const { data, loading, error, fetch } = useFetchData(minhaFuncaoAsync);
//   await fetch(arg1, arg2); // chama minhaFuncaoAsync(arg1, arg2)
//
// deps: dependências do useCallback (igual ao segundo argumento do useEffect)

import { useState, useCallback } from 'react';

export function useFetchData(fetchFunction, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Executa a função de busca, gerenciando loading e tratamento de erro
  const fetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao buscar dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, fetch };
}
