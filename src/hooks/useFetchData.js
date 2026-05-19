import { useState, useEffect, useCallback } from 'react';

export function useFetchData(fetchFunction, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  }, deps);

  return { data, loading, error, fetch };
}