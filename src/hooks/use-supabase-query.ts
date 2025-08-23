import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSupabaseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  retryCount?: number;
  retryDelay?: number;
}

interface UseSupabaseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

// Cache simple para evitar solicitudes duplicadas
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Rate limiting
const requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 100; // 100ms entre solicitudes

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      try {
        await request();
        // Esperar antes de la siguiente solicitud
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      } catch (error) {
        console.error('Error processing request:', error);
      }
    }
  }
  
  isProcessingQueue = false;
};

const queueRequest = (request: () => Promise<void>): Promise<void> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        await request();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
    
    processQueue();
  });
};

export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  queryKey: string,
  options: UseSupabaseQueryOptions = {}
): UseSupabaseQueryResult<T> {
  const {
    enabled = true,
    refetchInterval,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const executeQuery = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    // Verificar cache
    const cached = queryCache.get(queryKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      setData(cached.data);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancelar solicitud anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setIsStale(false);

    try {
      const result = await queueRequest(async () => {
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Request aborted');
        }
        return await queryFn();
      });

      if (!abortControllerRef.current?.signal.aborted) {
        setData(result);
        setError(null);
        retryCountRef.current = 0;

        // Guardar en cache
        queryCache.set(queryKey, {
          data: result,
          timestamp: Date.now(),
          ttl: 5 * 60 * 1000, // 5 minutos
        });
      }
    } catch (err: any) {
      if (!abortControllerRef.current?.signal.aborted) {
        setError(err);
        
        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;
          setTimeout(() => {
            executeQuery();
          }, retryDelay * retryCountRef.current);
        }
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [queryFn, queryKey, enabled, retryCount, retryDelay]);

  const refetch = useCallback(async (): Promise<void> => {
    setIsStale(true);
    await executeQuery();
  }, [executeQuery]);

  // Ejecutar query inicial
  useEffect(() => {
    if (enabled) {
      executeQuery();
    }
  }, [enabled, executeQuery]);

  // Refetch interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        setIsStale(true);
        executeQuery();
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, executeQuery]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}

// Hook para invalidar cache
export const useInvalidateCache = () => {
  return useCallback((queryKey?: string) => {
    if (queryKey) {
      queryCache.delete(queryKey);
    } else {
      queryCache.clear();
    }
  }, []);
};

// Hook para prefetch
export const usePrefetch = () => {
  return useCallback(async <T>(queryFn: () => Promise<T>, queryKey: string) => {
    try {
      const result = await queryFn();
      queryCache.set(queryKey, {
        data: result,
        timestamp: Date.now(),
        ttl: 5 * 60 * 1000, // 5 minutos
      });
      return result;
    } catch (error) {
      console.error('Prefetch error:', error);
      return null;
    }
  }, []);
};
