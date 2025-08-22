# 🚀 Inicio Rápido con Supabase

Esta es una versión simplificada para empezar rápidamente con Supabase. Usa `bigint` como ID y políticas RLS más simples.

## 📋 **Pasos para Configurar**

### **1. Crear Proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### **2. Obtener Credenciales**

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia la **Project URL** y la **anon public key**

### **3. Configurar Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### **4. Ejecutar Esquema SQL**

1. Ve a **SQL Editor** en Supabase
2. Copia y ejecuta el contenido de `database/simple-schema.sql`

## 🗄️ **Esquema Simplificado**

### **Tabla: developers**

```sql
CREATE TABLE developers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  skills text[] DEFAULT '{}',
  github text,
  linkedin text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);
```

### **Tabla: companies**

```sql
CREATE TABLE companies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);
```

### **Tabla: projects**

```sql
CREATE TABLE projects (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  description text,
  company_id bigint REFERENCES companies(id) ON DELETE CASCADE,
  skills_required text[] DEFAULT '{}',
  budget_range text,
  project_type text CHECK (project_type IN ('full-time', 'part-time', 'freelance', 'contract')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);
```

## 🧪 **Probar la Conexión**

### **Importar y usar las funciones de prueba:**

```typescript
import {
  testConnection,
  insertTestDeveloper,
  searchDevelopersBySkills,
} from "../lib/test-connection";

// Probar conexión
const result = await testConnection();
console.log("Resultado:", result);

// Insertar developer de prueba
const insertResult = await insertTestDeveloper();
console.log("Insertado:", insertResult);

// Buscar por skills
const searchResult = await searchDevelopersBySkills(["React", "TypeScript"]);
console.log("Búsqueda:", searchResult);
```

### **En la consola del navegador:**

```javascript
// Abrir la consola del navegador y ejecutar:
import("./src/lib/test-connection.js").then(async (module) => {
  const result = await module.testConnection();
  console.log("Conexión:", result);
});
```

## 🔧 **Diferencias con el Esquema Completo**

| Característica       | Esquema Simple                               | Esquema Completo                      |
| -------------------- | -------------------------------------------- | ------------------------------------- |
| **IDs**              | `bigint` con `GENERATED ALWAYS AS IDENTITY`  | `uuid` con `uuid_generate_v4()`       |
| **Políticas RLS**    | Simples, basadas en `anon` y `authenticated` | Avanzadas, con validaciones complejas |
| **Tablas**           | 3 tablas principales                         | 5 tablas + triggers + funciones       |
| **Datos de ejemplo** | Incluidos en el esquema                      | No incluidos                          |
| **Triggers**         | No incluidos                                 | `updated_at` automático               |
| **Conexiones**       | No incluidas                                 | Sistema completo de networking        |

## 📱 **Uso Básico en Componentes**

### **Listar Developers:**

```typescript
import { supabase } from "../lib/supabaseClient";

function DevelopersList() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevelopers() {
      const { data, error } = await supabase
        .from("developers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setDevelopers(data || []);
      }
      setLoading(false);
    }

    fetchDevelopers();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {developers.map((dev) => (
        <div key={dev.id}>
          <h3>{dev.name}</h3>
          <p>{dev.email}</p>
          <p>Skills: {dev.skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Crear Developer:**

```typescript
async function createDeveloper() {
  const { data, error } = await supabase
    .from("developers")
    .insert([
      {
        name: "Nuevo Developer",
        email: "nuevo@ejemplo.com",
        skills: ["JavaScript", "React"],
        github: "https://github.com/nuevodev",
      },
    ])
    .select();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Developer creado:", data);
  }
}
```

## 🚨 **Solución de Problemas Comunes**

### **Error: "relation does not exist"**

- Verificar que hayas ejecutado el esquema SQL
- Comprobar que estés en el proyecto correcto de Supabase

### **Error: "permission denied"**

- Verificar que las políticas RLS estén configuradas
- Comprobar que el usuario esté autenticado si es necesario

### **Error: "invalid input syntax for type bigint"**

- Verificar que los IDs sean números, no strings
- Comprobar que las referencias entre tablas usen números

### **Error de conexión**

- Verificar que las credenciales estén correctas
- Comprobar que el proyecto esté activo

## 📚 **Próximos Pasos**

1. **Probar la conexión** con `testConnection()`
2. **Insertar datos de ejemplo** si no están incluidos
3. **Crear componentes básicos** para listar y crear registros
4. **Implementar autenticación** cuando esté listo
5. **Migrar al esquema completo** si necesitas más funcionalidades

## 🔗 **Archivos Importantes**

- `database/simple-schema.sql` - Esquema simplificado
- `src/lib/supabaseClient.ts` - Cliente de Supabase
- `src/lib/test-connection.ts` - Funciones de prueba
- `.env.local` - Variables de entorno (crear manualmente)

¡Con esto deberías poder empezar rápidamente con Supabase!
