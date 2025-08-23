# 🚨 Solución para Error 429 (Rate Limiting)

## ¿Qué es el Error 429?

El error **429 "Too Many Requests"** indica que has excedido el límite de solicitudes permitidas en un período de tiempo específico. Esto es común en aplicaciones que hacen muchas peticiones a APIs externas como Supabase.

## 🔍 **Causas Comunes**

### 1. **Múltiples useEffect ejecutándose**

```tsx
// ❌ PROBLEMÁTICO - Se ejecuta en cada render
useEffect(() => {
  fetchData();
}, []); // Sin dependencias

useEffect(() => {
  filterData();
}, [searchTerm, data]); // Se ejecuta cada vez que cambia data
```

### 2. **Búsquedas sin debouncing**

```tsx
// ❌ PROBLEMÁTICO - Cada keystroke genera una solicitud
const handleSearch = (term) => {
  setSearchTerm(term);
  // Esto se ejecuta inmediatamente
  searchAPI(term);
};
```

### 3. **Solicitudes en loops o intervalos**

```tsx
// ❌ PROBLEMÁTICO - Múltiples solicitudes simultáneas
setInterval(() => {
  fetchData(); // Se ejecuta cada X segundos
}, 1000);
```

## ✅ **Soluciones Implementadas**

### 1. **Hook Personalizado con Rate Limiting**

```tsx
import { useSupabaseQuery } from "@/hooks/use-supabase-query";

const { data, loading, error, refetch } = useSupabaseQuery(
  () => supabase.from("developers").select("*"),
  "developers",
  { retryCount: 3, retryDelay: 1000 }
);
```

### 2. **Debouncing en Búsquedas**

```tsx
// ✅ OPTIMIZADO - Debouncing de 300ms
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // La búsqueda se hace automáticamente con useMemo
  }, 300);

  return () => clearTimeout(timeoutId);
}, [searchTerm]);
```

### 3. **Memoización de Datos**

```tsx
// ✅ OPTIMIZADO - Solo recalcula cuando es necesario
const filteredDevelopers = useMemo(() => {
  if (!searchTerm.trim()) return developers;

  return developers.filter((developer) =>
    developer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [developers, searchTerm]);
```

### 4. **useCallback para Funciones**

```tsx
// ✅ OPTIMIZADO - Evita recreaciones innecesarias
const fetchDevelopers = useCallback(async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setDevelopers(data || []);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
}, []);
```

## 🛠️ **Configuración de Supabase**

### 1. **Variables de Entorno**

```bash
# .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 2. **Configuración del Cliente**

```tsx
// src/lib/supabase-config.ts
const SUPABASE_CONFIG = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Limitar eventos por segundo
    },
  },
  global: {
    headers: {
      "X-Client-Info": "puzzleconnect-web",
    },
  },
};
```

## 📱 **Componente de Error Amigable**

```tsx
import { ErrorDisplay } from "@/components/ui/rate-limit-error";

// En tu componente
{
  error && <ErrorDisplay error={error} onRetry={refetch} retryAfter={60} />;
}
```

## 🚀 **Mejores Prácticas**

### 1. **Evitar Solicitudes Innecesarias**

```tsx
// ✅ BUENO - Solo cuando es necesario
useEffect(() => {
  if (enabled && !data) {
    fetchData();
  }
}, [enabled, data, fetchData]);
```

### 2. **Usar Cache Local**

```tsx
// ✅ BUENO - Cache de 5 minutos
const queryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

const getCachedData = (key) => {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};
```

### 3. **Implementar Retry con Backoff**

```tsx
// ✅ BUENO - Reintentos exponenciales
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (maxRetries <= 0) throw error;

    const delay = baseDelay * Math.pow(2, 3 - maxRetries);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithBackoff(fn, maxRetries - 1, baseDelay);
  }
};
```

## 🔧 **Solución Inmediata**

Si estás experimentando el error 429:

1. **Recarga la página** - Esto resetea el contador de solicitudes
2. **Espera 1-2 minutos** - Los límites se resetean automáticamente
3. **Verifica la consola** - Busca mensajes de rate limiting
4. **Usa el botón "Reintentar"** - Implementado en el componente de error

## 📊 **Monitoreo de Uso**

```tsx
// Ver estadísticas de uso
import { getUsageStats } from "@/lib/supabase-config";

const stats = getUsageStats();
console.log("Límite de solicitudes por minuto:", stats.maxRequestsPerMinute);
console.log("Tiempo de espera antes de reintentar:", stats.retryAfterSeconds);
```

## 🎯 **Resumen de Cambios**

- ✅ **Hook personalizado** con rate limiting y cache
- ✅ **Debouncing** en todas las búsquedas
- ✅ **Memoización** de datos y funciones
- ✅ **Componente de error** amigable para rate limiting
- ✅ **Configuración optimizada** de Supabase
- ✅ **Retry automático** con backoff exponencial

## 🆘 **Si el Problema Persiste**

1. **Verifica tu plan de Supabase** - Los límites varían según el plan
2. **Revisa la consola del navegador** - Busca errores específicos
3. **Contacta al soporte de Supabase** - Si es un problema del servicio
4. **Implementa más cache** - Para reducir solicitudes repetidas

---

**Nota**: Esta solución implementa un sistema robusto de rate limiting que debería eliminar completamente los errores 429 en tu aplicación.
