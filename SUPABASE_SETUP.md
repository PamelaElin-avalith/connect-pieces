# Configuración de Supabase

Este proyecto ya tiene configurada la integración con Supabase. Sigue estos pasos para completar la configuración:

## 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

## 2. Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia la **Project URL** y la **anon public key**

## 3. Configurar las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=tu_url_del_proyecto_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_publica
```

## 4. Estructura de archivos creada

- `src/lib/supabase.ts` - Cliente de Supabase
- `src/hooks/use-supabase.ts` - Hook para autenticación
- `src/contexts/AuthContext.tsx` - Contexto de autenticación
- `src/components/auth/ProtectedRoute.tsx` - Componente para proteger rutas
- `src/lib/supabase-examples.ts` - Ejemplos de uso

## 5. Uso básico

### En componentes:

```tsx
import { useAuth } from "../hooks/use-supabase";

function MyComponent() {
  const { user, signIn, signOut } = useAuth();

  if (user) {
    return (
      <div>
        <p>Hola, {user.email}</p>
        <button onClick={signOut}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn("email", "password")}>Iniciar sesión</button>
  );
}
```

### Para operaciones de base de datos:

```tsx
import { createUser, getUsers } from "../lib/supabase-examples";

// Crear usuario
const newUser = await createUser({
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
});

// Obtener usuarios
const users = await getUsers();
```

## 6. Características incluidas

- ✅ Autenticación completa (registro, login, logout)
- ✅ Manejo de sesiones
- ✅ Protección de rutas
- ✅ Operaciones CRUD básicas
- ✅ Subida de archivos
- ✅ Suscripciones en tiempo real
- ✅ Manejo de errores
- ✅ Tipos TypeScript

## 7. Próximos pasos

1. Configura las tablas en tu base de datos de Supabase
2. Ajusta los tipos TypeScript en `src/lib/supabase.ts`
3. Personaliza las funciones según tus necesidades
4. Implementa las políticas de seguridad (RLS) en Supabase

## 8. Recursos útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de autenticación](https://supabase.com/docs/guides/auth)
- [Guía de base de datos](https://supabase.com/docs/guides/database)
- [Guía de storage](https://supabase.com/docs/guides/storage)
