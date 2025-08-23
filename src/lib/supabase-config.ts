import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuración de rate limiting
const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 60,
  retryAfterSeconds: 60,
  maxRetries: 3,
  backoffMultiplier: 2,
};

// Configuración de Supabase
const SUPABASE_CONFIG = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'puzzleconnect-web',
    },
  },
};

// Cliente de Supabase con configuración optimizada
export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  SUPABASE_CONFIG
);

// Interceptor para manejar rate limiting
const createRateLimitInterceptor = () => {
  let requestCount = 0;
  let lastResetTime = Date.now();
  const requestQueue: Array<() => Promise<any>> = [];
  let isProcessingQueue = false;

  const resetCounter = () => {
    requestCount = 0;
    lastResetTime = Date.now();
  };

  const processQueue = async () => {
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (requestQueue.length > 0) {
      const request = requestQueue.shift();
      if (request) {
        try {
          await request();
          // Esperar entre solicitudes para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error processing queued request:', error);
        }
      }
    }
    
    isProcessingQueue = false;
  };

  const queueRequest = (request: () => Promise<any>): Promise<any> => {
    return new Promise((resolve, reject) => {
      requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      processQueue();
    });
  };

  return {
    checkRateLimit: () => {
      const now = Date.now();
      if (now - lastResetTime >= 60000) { // 1 minuto
        resetCounter();
      }
      
      if (requestCount >= RATE_LIMIT_CONFIG.maxRequestsPerMinute) {
        return {
          allowed: false,
          retryAfter: Math.ceil((60000 - (now - lastResetTime)) / 1000),
        };
      }
      
      requestCount++;
      return { allowed: true };
    },
    
    executeWithRateLimit: async <T>(request: () => Promise<T>): Promise<T> => {
      const rateLimitCheck = this.checkRateLimit();
      
      if (!rateLimitCheck.allowed) {
        throw new Error(`Rate limit exceeded. Retry after ${rateLimitCheck.retryAfter} seconds.`);
      }
      
      return queueRequest(request);
    },
  };
};

export const rateLimitInterceptor = createRateLimitInterceptor();

// Función helper para ejecutar queries con rate limiting
export const executeWithRateLimit = async <T>(
  queryFn: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  try {
    return await rateLimitInterceptor.executeWithRateLimit(queryFn);
  } catch (error: any) {
    if (error.message?.includes('Rate limit exceeded') && retryCount < RATE_LIMIT_CONFIG.maxRetries) {
      const retryAfter = parseInt(error.message.match(/(\d+)/)?.[1] || '60');
      console.log(`Rate limit hit, retrying in ${retryAfter} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return executeWithRateLimit(queryFn, retryCount + 1);
    }
    
    throw error;
  }
};

// Configuración de reintentos exponenciales
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = RATE_LIMIT_CONFIG.maxRetries,
  baseDelay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (maxRetries <= 0) throw error;
    
    const delay = baseDelay * Math.pow(RATE_LIMIT_CONFIG.backoffMultiplier, RATE_LIMIT_CONFIG.maxRetries - maxRetries);
    console.log(`Retrying in ${delay}ms... (${maxRetries} retries left)`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, maxRetries - 1, baseDelay);
  }
};

// Función para verificar el estado de la conexión
export const checkConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from('developers').select('count').limit(1);
    
    if (error) {
      return { connected: false, error: error.message };
    }
    
    return { connected: true };
  } catch (error: any) {
    return { connected: false, error: error.message };
  }
};

// Función para obtener estadísticas de uso
export const getUsageStats = () => {
  return {
    maxRequestsPerMinute: RATE_LIMIT_CONFIG.maxRequestsPerMinute,
    currentRequestCount: 0, // Esto se actualizaría dinámicamente
    retryAfterSeconds: RATE_LIMIT_CONFIG.retryAfterSeconds,
  };
};

export default supabase;
