# PuzzleConnect 🧩

**Conecta. Encuentra. Crece.**

PuzzleConnect es una plataforma moderna que conecta developers y empresas como piezas de rompecabezas perfectas. Encuentra tu match ideal en el mundo tech con una experiencia minimalista y eficiente.

## ✨ Características

- **🔍 Match Inteligente**: Algoritmo que conecta talento con oportunidades basado en skills y cultura
- **👥 Perfiles Verificados**: Developers verificados con proyectos reales en GitHub
- **🏢 Para Empresas**: Registro y gestión de perfiles corporativos
- **🌙 Dark Mode**: Tema oscuro/claro con transiciones suaves
- **📱 Responsive**: Diseño adaptativo para desktop, tablet y mobile
- **🎨 Diseño Puzzle**: Estética inspirada en piezas de rompecabezas encastradas

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y servidor de desarrollo
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía
- **React Router Dom** - Enrutamiento
- **Radix UI** - Componentes accesibles primitivos

### UI/UX
- **Shadcn/ui** - Sistema de componentes
- **Class Variance Authority** - Gestión de variantes de estilos
- **Tailwind Animate** - Animaciones

### Funcionalidades
- **React Hook Form** - Gestión de formularios
- **TanStack Query** - Gestión de estado del servidor
- **Zod** - Validación de esquemas

### Backend (Ready for Integration)
- **Supabase** - Backend as a Service (BAAS)
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - Almacenamiento de archivos
  - APIs en tiempo real

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm, yarn o bun

### Ejecutar en desarrollo
```bash
npm run dev
# o
yarn dev
# o
bun dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción
```bash
npm run build
# o
yarn build
# o
bun run build
```

## 🗂️ Estructura del Proyecto

```
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx          # Cabecera principal
│   └── ui/                     # Componentes base (Shadcn/ui)
│       ├── puzzle-card.tsx     # Componente card temático
│       └── theme-provider.tsx  # Proveedor de temas
├── pages/
│   ├── auth/
│   │   ├── Login.tsx          # Página de inicio de sesión
│   │   └── Register.tsx       # Página de registro
│   ├── Home.tsx               # Página principal
│   └── Index.tsx              # Ruta principal
├── lib/
│   └── utils.ts               # Utilidades
├── hooks/                     # Hooks personalizados
├── index.css                  # Estilos globales y tokens de diseño
└── main.tsx                   # Punto de entrada
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: Azul profundo para conexiones fuertes
- **Secondary**: Púrpura complementario para variedad
- **Accent**: Naranja cálido para CTAs y highlights
- **Puzzle Connection**: Verde para estados de conexión

### Tokens de Diseño
El sistema usa tokens semánticos definidos en `src/index.css`:
- Gradientes para profundidad y sensación de conexión
- Sombras específicas para elevación de piezas de puzzle
- Animaciones de pulso para elementos de conexión

## 🔗 Integración con Supabase

### ¿Por qué Supabase?

**Justificación técnica:**
1. **Open Source**: Alternativa open source a Firebase
2. **PostgreSQL**: Base de datos relacional robusta y escalable
3. **Real-time**: Subscripciones en tiempo real out-of-the-box
4. **Row Level Security**: Seguridad granular a nivel de fila
5. **Auto-generación de APIs**: REST y GraphQL automáticas
6. **Storage**: Almacenamiento de archivos con CDN global
7. **Edge Functions**: Funciones serverless en el edge

### Configuración (Próximos pasos)

1. **Conectar Supabase**
   - Hacer clic en el botón verde "Supabase" en la interfaz de Lovable
   - Seguir el proceso de configuración

2. **Esquema de base de datos** (se configurará automáticamente)
   ```sql
   -- Tabla de usuarios developers
   CREATE TABLE developers (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     skills TEXT[],
     github_url TEXT,
     linkedin_url TEXT,
     cv_url TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Tabla de empresas
   CREATE TABLE companies (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT NOT NULL,
     sector TEXT,
     description TEXT,
     logo_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## 🚀 Deploy

### Opción 1: Deploy con Lovable (Recomendado)
1. Abrir el proyecto en [Lovable](https://lovable.dev/projects/79808fbc-4db1-4655-9880-a8dfdc48142c)
2. Hacer clic en "Share" → "Publish"
3. La aplicación se desplegará automáticamente

### Opción 2: Deploy manual en Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📋 Próximos Pasos

### Para activar funcionalidades completas:
1. **Conectar Supabase**: Hacer clic en el botón verde "Supabase" en Lovable
2. **Configurar autenticación**: Email/Password authentication
3. **Configurar Storage**: Para CVs, avatares y logos
4. **Implementar funcionalidades**: Perfiles, matching, etc.

## 🤝 Contribuir

Para modificar este proyecto:
- **Usar Lovable**: Visitar el [proyecto en Lovable](https://lovable.dev/projects/79808fbc-4db1-4655-9880-a8dfdc48142c)
- **Git**: Clonar repo, hacer cambios y push
- **GitHub Codespaces**: Editar directamente en el navegador

---

**PuzzleConnect** - Conectando talento con oportunidades, una pieza a la vez. 🧩
