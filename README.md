# 🧩 ConnectPieces - Plataforma de Conexión Developer-Empresa

**ConnectPieces** es una aplicación web moderna y responsive diseñada para conectar desarrolladores con empresas de manera eficiente y profesional. La plataforma facilita la búsqueda de talento tecnológico y oportunidades de colaboración.

## 🚀 **Tecnologías Utilizadas**

### **Frontend & Desarrollo**

- **Lovable** - Plataforma de desarrollo visual para la interfaz de usuario
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de construcción rápida para desarrollo web
- **Tailwind CSS** - Framework CSS utility-first para diseño responsive
- **Shadcn/ui** - Componentes de UI modernos y accesibles
- **Lucide React** - Iconografía consistente y moderna

### **Backend & Base de Datos**

- **Supabase** - Plataforma backend-as-a-service con PostgreSQL
- **PostgreSQL** - Base de datos relacional robusta
- **Row Level Security (RLS)** - Seguridad a nivel de fila implementada
- **Edge Functions** - Funciones serverless para lógica de backend
- **Storage** - Almacenamiento de archivos (CVs, avatares, logos)

### **Autenticación & Seguridad**

- **Supabase Auth** - Sistema de autenticación completo
- **JWT Tokens** - Autenticación basada en tokens
- **Políticas RLS** - Control de acceso granular a datos
- **Verificación de email** - Flujo de confirmación de correo

### **Despliegue & Herramientas**

- **Vercel** - Plataforma de despliegue y hosting
- **Cursor** - IDE potenciado por IA para desarrollo
- **Git** - Control de versiones
- **ESLint** - Linting de código JavaScript/TypeScript

## 🏗️ **Arquitectura del Sistema**

### **Estructura de Base de Datos**

```sql
-- Tablas principales
developers     -- Perfiles de desarrolladores
companies      -- Perfiles de empresas
projects       -- Proyectos publicados
connections    -- Conexiones entre usuarios
applications   -- Aplicaciones a proyectos
```

### **Componentes Principales**

- **Sistema de Autenticación** - Login/Registro con confirmación de email
- **Gestión de Perfiles** - Perfiles editables para developers y empresas
- **Sistema de Búsqueda** - Filtros avanzados por skills, sector, ubicación
- **Sistema de Conexiones** - Botón "Conectar" que abre Gmail web
- **Gestión de Archivos** - Upload de CVs (PDF) y avatares
- **Interfaz Responsive** - Adaptable a desktop, tablet y mobile

## ✨ **Características Principales**

### **Para Developers**

- ✅ Perfil completo con skills, experiencia, ubicación
- ✅ Upload de CV en formato PDF
- ✅ Enlaces a GitHub, LinkedIn, sitio web
- ✅ Búsqueda de empresas y proyectos
- ✅ Sistema de conexiones directas

### **Para Empresas**

- ✅ Perfil empresarial con sector y descripción
- ✅ Publicación de proyectos y oportunidades
- ✅ Búsqueda de talento por skills específicos
- ✅ Sistema de conexiones con developers
- ✅ Gestión de aplicaciones recibidas

### **Funcionalidades Generales**

- 🌙 **Modo Oscuro/Claro** - Toggle de tema
- 📱 **Diseño Responsive** - Optimizado para todos los dispositivos
- 🔍 **Búsqueda Inteligente** - Filtros y búsqueda en tiempo real
- 🔐 **Seguridad Avanzada** - RLS y autenticación robusta
- 📧 **Integración Email** - Apertura directa de Gmail web

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### **1. Clonar el Repositorio**

```bash
git clone <repository-url>
cd connect-pieces
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Variables de Entorno**

Crear archivo `.env.local`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### **4. Configurar Supabase**

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Login y link del proyecto
npx supabase login
npx supabase link --project-ref tu_project_ref
```

### **5. Ejecutar en Desarrollo**

```bash
npm run dev
```

## 📱 **Uso de la Aplicación**

### **Flujo de Usuario**

1. **Registro/Login** - Crear cuenta o iniciar sesión
2. **Selección de Tipo** - Developer o Empresa
3. **Completar Perfil** - Información personal/profesional
4. **Explorar** - Buscar conexiones o proyectos
5. **Conectar** - Usar botón "Conectar" para contactar

### **Navegación Principal**

- **Inicio** - Dashboard principal
- **Developers** - Lista de desarrolladores
- **Empresas** - Lista de empresas
- **Proyectos** - Oportunidades disponibles
- **Perfil** - Gestión de cuenta personal

## 🔧 **Configuración de Supabase**

### **Tablas y Políticas RLS**

```sql
-- Ejemplo de política RLS para developers
CREATE POLICY "Users can view own profile" ON developers
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON developers
FOR UPDATE USING (auth.uid() = id);
```

### **Storage Buckets**

```sql
-- Bucket para CVs
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-storage', 'cv-storage', true);

-- Bucket para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatar-storage', 'avatar-storage', true);
```

## 🎨 **Personalización y Estilos**

### **Tema y Colores**

- **Primary**: Azul personalizable
- **Secondary**: Púrpura complementario
- **Gradientes**: Transiciones suaves entre colores
- **Modo Oscuro**: Tema automático con toggle manual

### **Componentes UI**

- **Cards** - Diseño de perfil y información
- **Buttons** - Botones con estados y variantes
- **Forms** - Formularios con validación
- **Modals** - Ventanas emergentes para acciones
- **Navigation** - Menú responsive y accesible

## 📊 **Rendimiento y Optimización**

### **Técnicas Implementadas**

- **Lazy Loading** - Carga diferida de componentes
- **Memoización** - Uso de useMemo y useCallback
- **Debouncing** - Optimización de búsquedas
- **Rate Limiting** - Control de requests a APIs
- **Caching** - Almacenamiento local de datos

### **Responsive Design**

- **Mobile First** - Diseño optimizado para móviles
- **Breakpoints** - Adaptación a diferentes tamaños
- **Touch Friendly** - Interacciones táctiles optimizadas
- **Performance** - Carga rápida en todos los dispositivos

## 🚀 **Despliegue en Vercel**

### **Configuración de Despliegue**

1. **Conectar Repositorio** - GitHub/GitLab con Vercel
2. **Variables de Entorno** - Configurar en dashboard de Vercel
3. **Build Settings** - Comando: `npm run build`
4. **Output Directory** - `dist`
5. **Deploy Automático** - Con cada push a main

### **Optimizaciones de Producción**

- **Code Splitting** - División automática de bundles
- **Tree Shaking** - Eliminación de código no utilizado
- **Minificación** - Compresión de CSS y JavaScript
- **CDN** - Distribución global de contenido

## 🤝 **Contribución y Desarrollo**

### **Estructura del Proyecto**

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas principales
├── hooks/         # Hooks personalizados
├── contexts/      # Contextos de React
├── lib/           # Utilidades y configuraciones
└── types/         # Definiciones de TypeScript
```

### **Convenciones de Código**

- **TypeScript** - Tipado estricto en todo el código
- **ESLint** - Reglas de linting configuradas
- **Prettier** - Formateo automático de código
- **Componentes Funcionales** - Uso de hooks modernos

## 📝 **Changelog**

### **v1.0.0 - Lanzamiento Inicial**

- ✅ Sistema de autenticación completo
- ✅ Perfiles de usuario editables
- ✅ Sistema de conexiones
- ✅ Interfaz responsive
- ✅ Integración con Supabase
- ✅ Modo oscuro/claro
- ✅ Upload de archivos
- ✅ Búsqueda y filtros

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 **Agradecimientos**

- **Lovable** por la plataforma de desarrollo visual
- **Supabase** por el backend robusto y escalable
- **Vercel** por el hosting y despliegue
- **Cursor** por el IDE potenciado por IA
- **Comunidad Open Source** por las librerías utilizadas

---

**Desarrollado con ❤️ usando tecnologías modernas para conectar talento tecnológico con oportunidades profesionales.**
