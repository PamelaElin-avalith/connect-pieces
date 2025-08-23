-- Esquema principal para Connect Pieces
-- Base de datos para conectar developers con empresas

-- Habilitar la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Developers
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

-- Tabla de Companies
CREATE TABLE companies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Projects
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

-- Tabla de Connections (conexiones entre developers y companies)
CREATE TABLE connections (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  developer_id bigint REFERENCES developers(id) ON DELETE CASCADE,
  company_id bigint REFERENCES companies(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(developer_id, company_id)
);

-- Tabla de Applications (aplicaciones a proyectos)
CREATE TABLE applications (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  project_id bigint REFERENCES projects(id) ON DELETE CASCADE,
  developer_id bigint REFERENCES developers(id) ON DELETE CASCADE,
  cover_letter text,
  proposed_rate numeric(10,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, developer_id)
);

-- Insertar datos de ejemplo para developers
INSERT INTO developers (name, email, skills, github, linkedin) VALUES
  ('Juan Pérez', 'juan@ejemplo.com', ARRAY['React', 'TypeScript', 'Node.js'], 'https://github.com/juanperez', 'https://linkedin.com/in/juanperez'),
  ('María García', 'maria@ejemplo.com', ARRAY['Python', 'Django', 'PostgreSQL'], 'https://github.com/mariagarcia', 'https://linkedin.com/in/mariagarcia'),
  ('Carlos López', 'carlos@ejemplo.com', ARRAY['Vue.js', 'JavaScript', 'CSS'], 'https://github.com/carloslopez', 'https://linkedin.com/in/carloslopez'),
  ('Ana Rodríguez', 'ana@ejemplo.com', ARRAY['React Native', 'Firebase', 'JavaScript'], 'https://github.com/anarodriguez', 'https://linkedin.com/in/anarodriguez'),
  ('Luis Martínez', 'luis@ejemplo.com', ARRAY['Java', 'Spring Boot', 'MySQL'], 'https://github.com/luismartinez', 'https://linkedin.com/in/luismartinez');

-- Insertar datos de ejemplo para companies
INSERT INTO companies (name, email, sector, description) VALUES
  ('TechCorp', 'contact@techcorp.com', 'Technology', 'Empresa líder en desarrollo de software y soluciones digitales'),
  ('Digital Solutions', 'hello@digitalsolutions.com', 'Technology', 'Especialistas en soluciones digitales y transformación tecnológica'),
  ('Innovation Labs', 'info@innovationlabs.com', 'Research', 'Laboratorio de innovación tecnológica y desarrollo de productos'),
  ('StartupHub', 'hello@startuphub.com', 'Startup', 'Plataforma para conectar startups con talento tecnológico'),
  ('Enterprise Solutions', 'contact@enterprisesolutions.com', 'Enterprise', 'Soluciones empresariales a gran escala');

-- Insertar datos de ejemplo para projects
INSERT INTO projects (title, description, company_id, skills_required, budget_range, project_type) VALUES
  ('App de E-commerce', 'Desarrollo de aplicación móvil para ventas online con sistema de pagos integrado', 1, ARRAY['React Native', 'Node.js', 'Stripe'], '$5000-$10000', 'freelance'),
  ('Dashboard Analytics', 'Panel de control con métricas empresariales y visualizaciones en tiempo real', 2, ARRAY['Vue.js', 'Python', 'PostgreSQL', 'D3.js'], '$8000-$15000', 'contract'),
  ('Sistema de Gestión', 'Software para administración de inventarios y control de stock', 3, ARRAY['React', 'TypeScript', 'Node.js', 'MongoDB'], '$12000-$20000', 'full-time'),
  ('Plataforma de Cursos', 'Sistema LMS para crear y gestionar cursos online', 4, ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], '$15000-$25000', 'freelance'),
  ('API de Microservicios', 'Arquitectura de microservicios para aplicación empresarial', 5, ARRAY['Java', 'Spring Boot', 'Docker', 'Kubernetes'], '$20000-$35000', 'full-time');

-- Insertar datos de ejemplo para connections
INSERT INTO connections (developer_id, company_id, status, message) VALUES
  (1, 1, 'accepted', 'Me interesa trabajar en proyectos de React y Node.js'),
  (2, 2, 'pending', 'Tengo experiencia en Python y Django, me gustaría colaborar'),
  (3, 3, 'accepted', 'Especialista en frontend, disponible para proyectos de Vue.js'),
  (4, 4, 'pending', 'Desarrolladora móvil con experiencia en React Native'),
  (5, 5, 'rejected', 'Java developer buscando oportunidades en proyectos empresariales');

-- Insertar datos de ejemplo para applications
INSERT INTO applications (project_id, developer_id, cover_letter, proposed_rate, status) VALUES
  (1, 1, 'Tengo 3 años de experiencia en React Native y he desarrollado apps similares. Me apasiona crear experiencias de usuario excepcionales.', 7500, 'pending'),
  (2, 2, 'Especialista en Python y análisis de datos. He trabajado en proyectos de analytics similares y puedo aportar valor inmediato.', 12000, 'reviewed'),
  (3, 3, 'Frontend developer con experiencia en React y TypeScript. Me gusta crear interfaces intuitivas y responsivas.', 15000, 'accepted'),
  (4, 4, 'Desarrolladora móvil con experiencia en React Native y Firebase. He creado apps educativas similares.', 18000, 'pending'),
  (5, 5, 'Java developer senior con experiencia en Spring Boot y arquitecturas de microservicios. He liderado equipos en proyectos similares.', 28000, 'reviewed');

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Políticas para developers
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

CREATE POLICY "users can delete own developer profile"
ON public.developers
FOR DELETE TO authenticated
USING (auth.email() = email);

-- Políticas para companies
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

CREATE POLICY "users can delete own company profile"
ON public.companies
FOR DELETE TO authenticated
USING (auth.email() = email);

-- Políticas para projects
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

CREATE POLICY "companies can delete own projects"
ON public.projects
FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM companies 
  WHERE companies.id = projects.company_id 
  AND companies.email = auth.email()
));

-- Políticas para connections
CREATE POLICY "users can view connections they're involved in"
ON public.connections
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM developers WHERE developers.id = connections.developer_id AND developers.email = auth.email()
  ) OR
  EXISTS (
    SELECT 1 FROM companies WHERE companies.id = connections.company_id AND companies.email = auth.email()
  )
);

CREATE POLICY "authenticated users can create connections"
ON public.connections
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "users can update connections they're involved in"
ON public.connections
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM developers WHERE developers.id = connections.developer_id AND developers.email = auth.email()
  ) OR
  EXISTS (
    SELECT 1 FROM companies WHERE companies.id = connections.company_id AND companies.email = auth.email()
  )
);

-- Políticas para applications
CREATE POLICY "users can view applications they're involved in"
ON public.applications
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM developers WHERE developers.id = applications.developer_id AND developers.email = auth.email()
  ) OR
  EXISTS (
    SELECT 1 FROM companies 
    JOIN projects ON projects.company_id = companies.id 
    WHERE projects.id = applications.project_id AND companies.email = auth.email()
  )
);

CREATE POLICY "developers can create applications"
ON public.applications
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM developers WHERE developers.id = applications.developer_id AND developers.email = auth.email()
  )
);

CREATE POLICY "companies can update applications to their projects"
ON public.applications
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM companies 
    JOIN projects ON projects.company_id = companies.id 
    WHERE projects.id = applications.project_id AND companies.email = auth.email()
  )
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_skills ON developers USING GIN(skills);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills_required);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_connections_developer ON connections(developer_id);
CREATE INDEX idx_connections_company ON connections(company_id);
CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_developer ON applications(developer_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Comentarios sobre la estructura
COMMENT ON TABLE developers IS 'Perfiles de desarrolladores con skills y enlaces profesionales';
COMMENT ON TABLE companies IS 'Perfiles de empresas por sector y descripción';
COMMENT ON TABLE projects IS 'Proyectos publicados por empresas con skills requeridos';
COMMENT ON TABLE connections IS 'Conexiones entre developers y empresas';
COMMENT ON TABLE applications IS 'Aplicaciones de developers a proyectos específicos';
