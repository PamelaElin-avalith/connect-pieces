# 🧩 Connect Pieces - Plataforma de Conexión Developer-Empresa

## 🎯 **Descripción del Proyecto**

**Connect Pieces** es una aplicación web moderna y responsive que conecta desarrolladores con empresas. La plataforma facilita la búsqueda de talento tecnológico y oportunidades laborales, proporcionando una interfaz intuitiva y funcionalidades avanzadas de gestión de perfiles.

**🎨 La interfaz de usuario fue completamente desarrollada utilizando [Lovable](https://lovable.dev), una plataforma de desarrollo visual que permite crear aplicaciones web profesionales de manera intuitiva y eficiente.**

## 🎨 **Desarrollo con Lovable**

### **¿Qué es Lovable?**

[Lovable](https://lovable.dev) es una plataforma de desarrollo visual que permite crear aplicaciones web completas y profesionales sin necesidad de escribir código manualmente. La interfaz de **Connect Pieces** fue desarrollada íntegramente utilizando esta herramienta.

### **Ventajas del Desarrollo con Lovable:**

- **🖱️ Desarrollo Visual** - Interfaz drag & drop intuitiva
- **⚡ Rapidez** - Creación de componentes en minutos, no horas
- **🎯 Precisión** - Componentes perfectamente alineados y responsivos
- **🔧 Flexibilidad** - Personalización completa de estilos y funcionalidades
- **📱 Responsive** - Diseño automáticamente adaptativo
- **🎨 Diseño Profesional** - Resultados de calidad empresarial

### **Componentes Desarrollados en Lovable:**

- **Sistema de navegación** completo y responsive
- **Formularios de autenticación** con validaciones
- **Perfiles de usuario** con layouts adaptativos
- **Sistema de temas** claro/oscuro
- **Componentes UI** modernos y accesibles
- **Modales y overlays** responsivos
- **Grids y layouts** adaptativos para todas las pantallas

## ✨ **Características Principales**

### **🔐 Sistema de Autenticación**

- **Registro y Login** con confirmación de email
- **Dos tipos de usuario**: Developer y Empresa
- **Perfiles personalizados** con información detallada
- **Gestión segura** de sesiones con Supabase Auth

### **👤 Gestión de Perfiles**

- **Perfiles de Developer**: Skills, GitHub, LinkedIn, CV, sitio web
- **Perfiles de Empresa**: Sector, descripción, proyectos
- **Avatares personalizables** con drag & drop
- **Edición en tiempo real** de información

### **📁 Sistema de Archivos**

- **Upload de CVs** en formato PDF
- **Gestión de avatares** con preview
- **Storage seguro** en Supabase
- **Validaciones** de tipo y tamaño

### **🎨 Interfaz de Usuario**

- **Diseño responsive** para desktop, tablet y mobile
- **Tema oscuro/claro** con toggle automático
- **Componentes modernos** y accesibles
- **Navegación intuitiva** y fluida

## 🛠️ **Stack Tecnológico**

### **Frontend**

- **React 18** - Framework principal
- **TypeScript** - Tipado estático y robusto
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos utility-first
- **Shadcn/ui** - Componentes de UI modernos y accesibles

### **Backend & Base de Datos**

- **Supabase** - Backend as a Service (BaaS)
  - **PostgreSQL** - Base de datos relacional
  - **Supabase Auth** - Sistema de autenticación
  - **Supabase Storage** - Almacenamiento de archivos
  - **Row Level Security (RLS)** - Seguridad a nivel de fila
  - **Real-time subscriptions** - Actualizaciones en tiempo real

### **Herramientas de Desarrollo**

- **Lovable** - Plataforma de desarrollo visual para interfaces web
- **Cursor** - IDE inteligente con AI
- **ESLint** - Linting de código
- **Prettier** - Formateo automático
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de navegadores

### **Deployment & Hosting**

- **Vercel** - Plataforma de deployment
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**

- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Vercel (opcional)
- **💡 Opcional**: Cuenta en [Lovable](https://lovable.dev) para desarrollo visual

### **Alternativas de Desarrollo**

#### **Opción 1: Desarrollo Local (Recomendado para desarrolladores)**

Sigue los pasos de instalación estándar a continuación.

#### **Opción 2: Desarrollo Visual con Lovable**

1. **Visitar** [lovable.dev](https://lovable.dev)
2. **Crear cuenta** gratuita
3. **Importar proyecto** desde GitHub
4. **Desarrollar visualmente** la interfaz
5. **Exportar código** para deployment

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/tu-usuario/connect-pieces.git
cd connect-pieces
```

### **2. Instalar Dependencias**

```bash
npm install
# o
yarn install
```

### **3. Configurar Variables de Entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### **4. Configurar Supabase**

1. **Crear proyecto** en [supabase.com](https://supabase.com)
2. **Ejecutar scripts SQL** en el SQL Editor:

   ```sql
   -- Configurar base de datos
   -- Archivo: supabase/schema.sql

   -- Configurar storage para CVs
   -- Archivo: supabase/storage-setup.sql

   -- Configurar storage para avatares
   -- Archivo: supabase/avatar-storage-setup.sql
   ```

### **5. Ejecutar en Desarrollo**

```bash
npm run dev
# o
yarn dev
```

### **6. Build para Producción**

```bash
npm run build
# o
yarn build
```

## 🗄️ **Estructura de la Base de Datos**

### **Tablas Principales**

- **`developers`** - Perfiles de desarrolladores
- **`companies`** - Perfiles de empresas
- **`projects`** - Proyectos de empresas
- **`connections`** - Conexiones entre usuarios
- **`applications`** - Aplicaciones a proyectos

### **Características de Seguridad**

- **UUIDs** como claves primarias
- **RLS policies** para acceso controlado
- **Foreign keys** con integridad referencial
- **Índices optimizados** para búsquedas

## 📱 **Componentes Principales**

### **🔐 Autenticación**

- **`AuthModal`** - Modal de login/registro
- **`RegistrationFlowInfo`** - Flujo visual de registro
- **`ChangeEmailModal`** - Cambio de email

### **👤 Perfiles**

- **`Profile`** - Página principal de perfil
- **`AvatarUpload`** - Upload de avatares
- **`FileUpload`** - Upload de CVs

### **🎨 UI Components**

- **Sistema de componentes** basado en Shadcn/ui
- **Tema oscuro/claro** con ThemeProvider
- **Toast notifications** para feedback
- **Modales responsivos** y accesibles

## 🌐 **Deployment en Vercel**

### **Configuración Automática**

1. **Conectar repositorio** de GitHub a Vercel
2. **Configurar variables de entorno** en Vercel Dashboard
3. **Deploy automático** en cada push a main

### **Variables de Entorno en Vercel**

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### **Dominio Personalizado**

- **Configurar DNS** en tu proveedor
- **SSL automático** con Let's Encrypt
- **CDN global** para mejor rendimiento

## 🔧 **Configuración de Supabase**

### **1. Habilitar Funcionalidades**

- ✅ **Authentication** - Sistema de usuarios
- ✅ **Database** - Base de datos PostgreSQL
- ✅ **Storage** - Almacenamiento de archivos
- ✅ **Edge Functions** - Funciones serverless

### **2. Configurar Storage Buckets**

```sql
-- Bucket para CVs
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('cv-files', 'cv-files', true, 5242880);

-- Bucket para avatares
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('avatars', 'avatars', true, 2097152);
```

### **3. Configurar RLS Policies**

- **Políticas de inserción** para perfiles propios
- **Políticas de lectura** públicas para búsquedas
- **Políticas de actualización** para propietarios
- **Políticas de eliminación** con confirmación

## 📱 **Responsive Design**

### **Breakpoints**

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Características**

- **Grid system** adaptativo
- **Flexbox layouts** responsivos
- **Typography** escalable
- **Spacing** consistente

## 🎨 **Sistema de Temas**

### **Tema Claro**

- **Colores suaves** y profesionales
- **Contraste optimizado** para legibilidad
- **Sombras sutiles** para profundidad

### **Tema Oscuro**

- **Colores oscuros** para descanso visual
- **Acentos vibrantes** para elementos importantes
- **Transiciones suaves** entre modos

## 🔒 **Seguridad**

### **Autenticación**

- **JWT tokens** seguros
- **Refresh tokens** automáticos
- **Sesiones persistentes** opcionales

### **Autorización**

- **Row Level Security** en PostgreSQL
- **Políticas granulares** por usuario
- **Validación de entrada** en frontend y backend

### **Storage**

- **Archivos privados** por usuario
- **Validación de tipos** de archivo
- **Límites de tamaño** configurados

## 📊 **Performance**

### **Optimizaciones Frontend**

- **Code splitting** automático con Vite
- **Lazy loading** de componentes
- **Memoización** de cálculos costosos
- **Debouncing** de búsquedas

### **Optimizaciones Backend**

- **Índices optimizados** en PostgreSQL
- **Queries eficientes** con Supabase
- **Caching** de datos frecuentes
- **Compresión** de archivos

## 🧪 **Testing**

### **Tipos de Tests**

- **Unit tests** para componentes
- **Integration tests** para APIs
- **E2E tests** para flujos completos

### **Herramientas**

- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Playwright** - Testing E2E

## 📈 **Monitoreo y Analytics**

### **Métricas de Performance**

- **Core Web Vitals** con Vercel Analytics
- **Error tracking** automático
- **Performance monitoring** en tiempo real

### **Logs y Debugging**

- **Console logging** estructurado
- **Error boundaries** en React
- **Stack traces** detallados

## 🚀 **Roadmap**

### **Fase 1 - Core Features** ✅

- [x] Sistema de autenticación
- [x] Gestión de perfiles
- [x] Upload de archivos
- [x] Interfaz responsive

### **Fase 2 - Networking** 🔄

- [ ] Sistema de conexiones
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] Sistema de recomendaciones

### **Fase 3 - Advanced Features** 📋

- [ ] Dashboard analítico
- [ ] Sistema de pagos
- [ ] API pública
- [ ] Integraciones externas

## 🤝 **Contribución**

### **Guidelines**

1. **Fork** el repositorio
2. **Crea** una rama para tu feature
3. **Commit** tus cambios
4. **Push** a la rama
5. **Abre** un Pull Request

### **Estándares de Código**

- **TypeScript** estricto
- **ESLint** configurado
- **Prettier** para formateo
- **Conventional Commits** para mensajes

## 📄 **Licencia**

Este proyecto está bajo la licencia **MIT**. Ver el archivo `LICENSE` para más detalles.

## 🙏 **Agradecimientos**

- **Lovable** por la excelente plataforma de desarrollo visual
- **Supabase** por el excelente backend as a service
- **Vercel** por la plataforma de deployment
- **Shadcn/ui** por los componentes de UI
- **Cursor** por el IDE inteligente
- **Tailwind CSS** por el framework de estilos

## 📞 **Contacto**

- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **Email**: tu-email@ejemplo.com
- **LinkedIn**: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!**

**🔄 Última actualización**: Diciembre 2024
