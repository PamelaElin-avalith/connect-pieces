# 🗄️ Supabase - Connect Pieces

Esta carpeta contiene toda la configuración y esquemas de base de datos para el proyecto Connect Pieces.

## 📁 **Estructura de Archivos**

```
supabase/
├── README.md           # Este archivo
├── schema.sql          # Esquema principal de la base de datos
└── config.toml         # Configuración de Supabase
```

## 🚀 **Configuración Inmediata**

### **1. Ejecutar el Esquema SQL**

1. Ve a tu proyecto de Supabase Dashboard
2. Navega a **SQL Editor**
3. Copia y ejecuta el contenido de `schema.sql`

### **2. Verificar la Configuración**

- Las 5 tablas principales se crearán automáticamente
- Los datos de ejemplo se insertarán
- Las políticas RLS se configurarán
- Los índices se crearán para optimizar el rendimiento

## 🗃️ **Tablas Creadas**

| Tabla              | Descripción                      | Registros de Ejemplo                  |
| ------------------ | -------------------------------- | ------------------------------------- |
| **`developers`**   | Perfiles de desarrolladores      | 5 developers con skills variados      |
| **`companies`**    | Perfiles de empresas             | 5 empresas de diferentes sectores     |
| **`projects`**     | Proyectos publicados             | 5 proyectos con diferentes tipos      |
| **`connections`**  | Conexiones entre devs y empresas | 5 conexiones con diferentes estados   |
| **`applications`** | Aplicaciones a proyectos         | 5 aplicaciones con diferentes estados |

## 🔐 **Seguridad (RLS)**

- **Row Level Security** habilitado en todas las tablas
- **Políticas simples** para usuarios anónimos y autenticados
- **Acceso controlado** según el rol del usuario
- **Validaciones** para operaciones de escritura

## 📊 **Datos de Ejemplo Incluidos**

### **Developers:**

- Juan Pérez (React, TypeScript, Node.js)
- María García (Python, Django, PostgreSQL)
- Carlos López (Vue.js, JavaScript, CSS)
- Ana Rodríguez (React Native, Firebase, JavaScript)
- Luis Martínez (Java, Spring Boot, MySQL)

### **Companies:**

- TechCorp (Technology)
- Digital Solutions (Technology)
- Innovation Labs (Research)
- StartupHub (Startup)
- Enterprise Solutions (Enterprise)

### **Projects:**

- App de E-commerce ($5K-$10K, freelance)
- Dashboard Analytics ($8K-$15K, contract)
- Sistema de Gestión ($12K-$20K, full-time)
- Plataforma de Cursos ($15K-$25K, freelance)
- API de Microservicios ($20K-$35K, full-time)

## 🛠️ **Características Técnicas**

- **IDs**: `bigint` con `GENERATED ALWAYS AS IDENTITY`
- **Timestamps**: `created_at` automático
- **Arrays**: Skills como arrays de texto para búsquedas eficientes
- **Foreign Keys**: Relaciones entre tablas con CASCADE
- **Constraints**: Validaciones de tipos de proyecto y estados
- **Índices**: GIN para arrays, B-tree para campos comunes

## 🔍 **Búsquedas Optimizadas**

### **Por Skills:**

```sql
-- Buscar developers con skills específicos
SELECT * FROM developers
WHERE skills && ARRAY['React', 'TypeScript'];

-- Buscar proyectos que requieren skills específicos
SELECT * FROM projects
WHERE skills_required && ARRAY['Node.js', 'PostgreSQL'];
```

### **Por Sector:**

```sql
-- Buscar empresas por sector
SELECT * FROM companies
WHERE sector = 'Technology';
```

### **Por Estado:**

```sql
-- Proyectos abiertos
SELECT * FROM projects
WHERE status = 'open';

-- Conexiones pendientes
SELECT * FROM connections
WHERE status = 'pending';
```

## 📱 **Uso en el Frontend**

### **Importar el Cliente:**

```typescript
import { supabase } from "../lib/supabaseClient";
```

### **Ejemplos de Consultas:**

```typescript
// Obtener todos los developers
const { data: developers } = await supabase.from("developers").select("*");

// Buscar por skills
const { data: reactDevs } = await supabase
  .from("developers")
  .select("*")
  .overlaps("skills", ["React", "TypeScript"]);

// Obtener proyectos con información de empresa
const { data: projects } = await supabase.from("projects").select(`
    *,
    company:companies(name, sector)
  `);
```

## 🚨 **Solución de Problemas**

### **Error: "relation does not exist"**

- Verificar que hayas ejecutado `schema.sql`
- Comprobar que estés en el proyecto correcto

### **Error: "permission denied"**

- Verificar que las políticas RLS estén configuradas
- Comprobar que el usuario esté autenticado si es necesario

### **Error: "invalid input syntax for type bigint"**

- Verificar que los IDs sean números, no strings
- Comprobar las referencias entre tablas

## 📚 **Próximos Pasos**

1. **Ejecutar el esquema** en Supabase
2. **Probar las consultas** básicas
3. **Implementar componentes** del frontend
4. **Configurar autenticación** cuando esté listo
5. **Personalizar políticas RLS** según necesidades

## 🔗 **Recursos Adicionales**

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Guía de Arrays en PostgreSQL](https://www.postgresql.org/docs/current/arrays.html)
- [Índices GIN](https://www.postgresql.org/docs/current/gin-intro.html)

---

**¡Con este esquema tendrás una base de datos completa y funcional para Connect Pieces!**
