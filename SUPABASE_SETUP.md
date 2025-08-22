# Configuración Completa de Supabase

Este proyecto tiene implementada una integración completa con Supabase incluyendo tablas, APIs y funcionalidades para conectar developers con empresas.

## 🚀 **Características Implementadas**

- ✅ **Cliente de Supabase** configurado
- ✅ **Sistema de autenticación** completo
- ✅ **5 tablas principales** con relaciones
- ✅ **APIs REST completas** para todas las entidades
- ✅ **Sistema de conexiones** entre developers y empresas
- ✅ **Gestión de proyectos** y aplicaciones
- ✅ **Búsquedas avanzadas** por skills y filtros
- ✅ **Seguridad RLS** implementada
- ✅ **Tipos TypeScript** completos

## 📊 **Estructura de la Base de Datos**

### **Tablas Principales:**

1. **`developers`** - Perfiles de desarrolladores
2. **`companies`** - Perfiles de empresas
3. **`connections`** - Conexiones entre developers y empresas
4. **`projects`** - Proyectos publicados por empresas
5. **`applications`** - Aplicaciones de developers a proyectos

### **Relaciones:**

- Developers ↔ Companies (a través de connections)
- Companies → Projects (una empresa puede tener múltiples proyectos)
- Developers → Applications → Projects (aplicaciones a proyectos)

## 🗄️ **Esquema de Base de Datos**

### **Tabla: developers**

```sql
CREATE TABLE developers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  skills text[] DEFAULT '{}',
  github text,
  linkedin text,
  cv_url text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Tabla: companies**

```sql
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### **Tabla: projects**

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES companies(id),
  skills_required text[] DEFAULT '{}',
  budget_range text,
  project_type text CHECK (project_type IN ('full-time', 'part-time', 'freelance', 'contract')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## 🔧 **Configuración Inicial**

### **1. Crear proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que se complete la configuración

### **2. Obtener credenciales**

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia la **Project URL** y la **anon public key**

### **3. Configurar variables de entorno**

Actualiza `src/lib/supabaseClient.ts` con tus credenciales:

```typescript
const supabaseUrl = "https://TU-PROYECTO.supabase.co";
const supabaseAnonKey = "TU_ANON_KEY";
```

### **4. Ejecutar el esquema SQL**

1. Ve a **SQL Editor** en Supabase
2. Copia y ejecuta el contenido de `database/schema.sql`

## 📁 **Estructura de Archivos**

```
src/
├── lib/
│   ├── supabaseClient.ts          # Cliente principal de Supabase
│   ├── api/
│   │   ├── index.ts               # Exportaciones de todas las APIs
│   │   ├── developers.ts          # API para developers
│   │   ├── companies.ts           # API para companies
│   │   ├── projects.ts            # API para projects
│   │   ├── connections.ts         # API para connections
│   │   └── applications.ts        # API para applications
│   └── supabase.ts                # Cliente original (mantener para compatibilidad)
├── hooks/
│   └── use-supabase.ts            # Hook de autenticación
├── contexts/
│   └── AuthContext.tsx            # Contexto de autenticación
└── components/
    └── auth/
        └── ProtectedRoute.tsx     # Componente para proteger rutas
```

## 🎯 **Uso de las APIs**

### **Developers**

```typescript
import {
  getDevelopers,
  createDeveloper,
  searchDevelopersBySkills,
} from "../lib/api";

// Obtener todos los developers
const developers = await getDevelopers();

// Crear nuevo developer
const newDeveloper = await createDeveloper({
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
  skills: ["React", "TypeScript", "Node.js"],
});

// Buscar por skills
const reactDevs = await searchDevelopersBySkills(["React", "TypeScript"]);
```

### **Companies**

```typescript
import { getCompanies, createCompany, getCompaniesBySector } from "../lib/api";

// Obtener companies por sector
const techCompanies = await getCompaniesBySector("Technology");

// Crear nueva company
const newCompany = await createCompany({
  name: "TechCorp",
  email: "contact@techcorp.com",
  sector: "Technology",
  description: "Empresa de desarrollo de software",
});
```

### **Projects**

```typescript
import { getProjects, createProject, searchProjectsBySkills } from "../lib/api";

// Obtener proyectos con información de empresa
const projects = await getProjects();

// Crear nuevo proyecto
const newProject = await createProject({
  title: "App de E-commerce",
  description: "Desarrollo de aplicación móvil",
  company_id: "company-uuid",
  skills_required: ["React Native", "Node.js"],
  budget_range: "$5000-$10000",
  project_type: "freelance",
});
```

### **Connections**

```typescript
import {
  createConnection,
  getUserConnections,
  updateConnectionStatus,
} from "../lib/api";

// Crear conexión
const connection = await createConnection({
  developer_id: "dev-uuid",
  company_id: "company-uuid",
  message: "Me interesa trabajar con ustedes",
});

// Aceptar conexión
await updateConnectionStatus(connection.id, "accepted");
```

### **Applications**

```typescript
import {
  createApplication,
  getProjectApplications,
  updateApplicationStatus,
} from "../lib/api";

// Aplicar a proyecto
const application = await createApplication({
  project_id: "project-uuid",
  developer_id: "dev-uuid",
  cover_letter: "Soy perfecto para este proyecto...",
  proposed_rate: 5000,
});

// Revisar aplicación
await updateApplicationStatus(application.id, "reviewed");
```

## 🔍 **Funcionalidades de Búsqueda**

### **Búsqueda por Skills**

- `searchDevelopersBySkills(['React', 'TypeScript'])`
- `searchProjectsBySkills(['Node.js', 'PostgreSQL'])`

### **Búsqueda por Texto**

- `searchDevelopers('Juan')`
- `searchCompanies('Tech')`
- `searchProjects('e-commerce')`

### **Filtros Avanzados**

- Por sector de empresa
- Por tipo de proyecto
- Por estado de conexión/aplicación
- Paginación incluida

## 🛡️ **Seguridad (RLS)**

- **Row Level Security** habilitado en todas las tablas
- **Políticas personalizadas** para cada operación
- **Autenticación requerida** para operaciones sensibles
- **Acceso controlado** según el rol del usuario

## 📱 **Integración con Frontend**

### **React Hooks**

```typescript
import { useAuth } from "../hooks/use-supabase";

function MyComponent() {
  const { user, signIn, signOut } = useAuth();

  if (user) {
    return <div>Hola, {user.email}</div>;
  }

  return <button onClick={() => signIn("email", "password")}>Login</button>;
}
```

### **Protección de Rutas**

```typescript
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>;
```

## 🚀 **Próximos Pasos**

1. **Configurar credenciales** en `supabaseClient.ts`
2. **Ejecutar el esquema SQL** en Supabase
3. **Probar las APIs** con datos de ejemplo
4. **Implementar componentes** del frontend
5. **Configurar políticas RLS** según necesidades
6. **Agregar validaciones** adicionales

## 📚 **Recursos Adicionales**

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guía de APIs](https://supabase.com/docs/reference/javascript/select)
- [Tipos TypeScript](https://supabase.com/docs/guides/api/typescript-support)

## 🆘 **Solución de Problemas**

### **Error de variables de entorno**

- Verificar que las credenciales estén correctas en `supabaseClient.ts`
- Asegurar que el proyecto de Supabase esté activo

### **Error de permisos RLS**

- Verificar que las políticas estén configuradas correctamente
- Comprobar que el usuario esté autenticado

### **Error de conexión**

- Verificar la URL del proyecto
- Comprobar que la clave anónima sea correcta
