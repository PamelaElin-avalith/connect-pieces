-- Esquema simplificado para empezar con Supabase
-- Basado en el patrón que sugeriste

-- Habilitar la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Developers (simplificada)
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

-- Tabla de Companies (simplificada)
CREATE TABLE companies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Projects (simplificada)
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

-- Insertar datos de ejemplo para developers
INSERT INTO developers (name, email, skills, github, linkedin) VALUES
  ('Juan Pérez', 'juan@ejemplo.com', ARRAY['React', 'TypeScript', 'Node.js'], 'https://github.com/juanperez', 'https://linkedin.com/in/juanperez'),
  ('María García', 'maria@ejemplo.com', ARRAY['Python', 'Django', 'PostgreSQL'], 'https://github.com/mariagarcia', 'https://linkedin.com/in/mariagarcia'),
  ('Carlos López', 'carlos@ejemplo.com', ARRAY['Vue.js', 'JavaScript', 'CSS'], 'https://github.com/carloslopez', 'https://linkedin.com/in/carloslopez');

-- Insertar datos de ejemplo para companies
INSERT INTO companies (name, email, sector, description) VALUES
  ('TechCorp', 'contact@techcorp.com', 'Technology', 'Empresa líder en desarrollo de software'),
  ('Digital Solutions', 'hello@digitalsolutions.com', 'Technology', 'Especialistas en soluciones digitales'),
  ('Innovation Labs', 'info@innovationlabs.com', 'Research', 'Laboratorio de innovación tecnológica');

-- Insertar datos de ejemplo para projects
INSERT INTO projects (title, description, company_id, skills_required, budget_range, project_type) VALUES
  ('App de E-commerce', 'Desarrollo de aplicación móvil para ventas online', 1, ARRAY['React Native', 'Node.js'], '$5000-$10000', 'freelance'),
  ('Dashboard Analytics', 'Panel de control con métricas empresariales', 2, ARRAY['Vue.js', 'Python', 'PostgreSQL'], '$8000-$15000', 'contract'),
  ('Sistema de Gestión', 'Software para administración de inventarios', 3, ARRAY['React', 'TypeScript', 'Node.js'], '$12000-$20000', 'full-time');

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Políticas simples para developers
CREATE POLICY "public can read developers"
ON public.developers
FOR SELECT TO anon
USING (true);

CREATE POLICY "authenticated users can insert developers"
ON public.developers
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "users can update own developer profile"
ON public.developers
FOR UPDATE TO authenticated
USING (auth.email() = email);

-- Políticas simples para companies
CREATE POLICY "public can read companies"
ON public.companies
FOR SELECT TO anon
USING (true);

CREATE POLICY "authenticated users can insert companies"
ON public.companies
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "users can update own company profile"
ON public.companies
FOR UPDATE TO authenticated
USING (auth.email() = email);

-- Políticas simples para projects
CREATE POLICY "public can read projects"
ON public.projects
FOR SELECT TO anon
USING (true);

CREATE POLICY "authenticated users can insert projects"
ON public.projects
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "companies can update own projects"
ON public.projects
FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM companies 
  WHERE companies.id = projects.company_id 
  AND companies.email = auth.email()
));

-- Índices básicos para mejorar el rendimiento
CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_skills ON developers USING GIN(skills);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills_required);
CREATE INDEX idx_projects_status ON projects(status);
