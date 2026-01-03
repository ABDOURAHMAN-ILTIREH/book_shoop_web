import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, loading: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hook for paginated data
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{ data: T[]; pagination: any }>
) {
  const [state, setState] = useState({
    data: [] as T[],
    pagination: null as any,
    loading: false,
    error: null as string | null,
  });

  const execute = useCallback(
    async (page: number = 1, limit: number = 20, ...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(page, limit, ...args);
        setState(prev => ({
          ...prev,
          data: result.data,
          pagination: result.pagination,
          loading: false,
        }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: [],
      pagination: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}