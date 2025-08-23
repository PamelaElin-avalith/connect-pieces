-- Esquema principal para Connect Pieces
-- Base de datos para conectar developers con empresas

-- Habilitar la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Developers
CREATE TABLE developers (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  skills text[] DEFAULT '{}',
  github text,
  linkedin text,
  web_url text,
  avatar_url text,
  cv_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  skills_required text[] DEFAULT '{}',
  budget_range text,
  project_type text CHECK (project_type IN ('full-time', 'part-time', 'freelance', 'contract')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Connections (conexiones entre developers y companies)
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(developer_id, company_id)
);

-- Tabla de Applications (aplicaciones a proyectos)
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  cover_letter text,
  proposed_rate numeric(10,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, developer_id)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Políticas para developers
CREATE POLICY "developers_select_policy" ON developers
  FOR SELECT USING (true);

CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "developers_update_policy" ON developers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "developers_delete_policy" ON developers
  FOR DELETE USING (auth.uid() = id);

-- Políticas para companies
CREATE POLICY "companies_select_policy" ON companies
  FOR SELECT USING (true);

CREATE POLICY "companies_insert_policy" ON companies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "companies_update_policy" ON companies
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "companies_delete_policy" ON companies
  FOR DELETE USING (auth.uid() = id);

-- Políticas para projects
CREATE POLICY "projects_select_policy" ON projects
  FOR SELECT USING (true);

CREATE POLICY "projects_insert_policy" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = projects.company_id 
      AND companies.id = auth.uid()
    )
  );

CREATE POLICY "projects_update_policy" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = projects.company_id 
      AND companies.id = auth.uid()
    )
  );

CREATE POLICY "projects_delete_policy" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = projects.company_id 
      AND companies.id = auth.uid()
    )
  );

-- Políticas para connections
CREATE POLICY "connections_select_policy" ON connections
  FOR SELECT USING (
    auth.uid() = developer_id OR 
    auth.uid() = company_id
  );

CREATE POLICY "connections_insert_policy" ON connections
  FOR INSERT WITH CHECK (
    auth.uid() = developer_id OR 
    auth.uid() = company_id
  );

CREATE POLICY "connections_update_policy" ON connections
  FOR UPDATE USING (
    auth.uid() = developer_id OR 
    auth.uid() = company_id
  );

CREATE POLICY "connections_delete_policy" ON connections
  FOR DELETE USING (
    auth.uid() = developer_id OR 
    auth.uid() = company_id
  );

-- Políticas para applications
CREATE POLICY "applications_select_policy" ON applications
  FOR SELECT USING (
    auth.uid() = developer_id OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = applications.project_id 
      AND projects.company_id = auth.uid()
    )
  );

CREATE POLICY "applications_insert_policy" ON applications
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "applications_update_policy" ON applications
  FOR UPDATE USING (
    auth.uid() = developer_id OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = applications.project_id 
      AND projects.company_id = auth.uid()
    )
  );

CREATE POLICY "applications_delete_policy" ON applications
  FOR DELETE USING (
    auth.uid() = developer_id OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = applications.project_id 
      AND projects.company_id = auth.uid()
    )
  );

-- Insertar datos de ejemplo para developers (solo para testing)
INSERT INTO developers (id, name, email, skills, github, linkedin) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Juan Pérez', 'juan@ejemplo.com', ARRAY['React', 'TypeScript', 'Node.js'], 'https://github.com/juanperez', 'https://linkedin.com/in/juanperez'),
  ('550e8400-e29b-41d4-a716-446655440002', 'María García', 'maria@ejemplo.com', ARRAY['Python', 'Django', 'PostgreSQL'], 'https://github.com/mariagarcia', 'https://linkedin.com/in/mariagarcia'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Carlos López', 'carlos@ejemplo.com', ARRAY['Vue.js', 'JavaScript', 'CSS'], 'https://github.com/carloslopez', 'https://linkedin.com/in/carloslopez'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Ana Rodríguez', 'ana@ejemplo.com', ARRAY['React Native', 'Firebase', 'JavaScript'], 'https://github.com/anarodriguez', 'https://linkedin.com/in/anarodriguez'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Luis Martínez', 'luis@ejemplo.com', ARRAY['Java', 'Spring Boot', 'MySQL'], 'https://github.com/luismartinez', 'https://linkedin.com/in/luismartinez');

-- Insertar datos de ejemplo para companies (solo para testing)
INSERT INTO companies (id, name, email, sector, description) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'TechCorp', 'contact@techcorp.com', 'Technology', 'Empresa líder en desarrollo de software y soluciones digitales'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Digital Solutions', 'hello@digitalsolutions.com', 'Technology', 'Especialistas en soluciones digitales y transformación tecnológica'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Innovation Labs', 'info@innovationlabs.com', 'Research', 'Laboratorio de innovación tecnológica y desarrollo de productos'),
  ('660e8400-e29b-41d4-a716-446655440004', 'StartupHub', 'hello@startuphub.com', 'Startup', 'Plataforma para conectar startups con talento tecnológico'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Enterprise Solutions', 'contact@enterprisesolutions.com', 'Enterprise', 'Soluciones empresariales a gran escala');

-- Insertar datos de ejemplo para projects (solo para testing)
INSERT INTO projects (id, title, description, company_id, skills_required, budget_range, project_type) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'App de E-commerce', 'Desarrollo de aplicación móvil para ventas online con sistema de pagos integrado', '660e8400-e29b-41d4-a716-446655440001', ARRAY['React Native', 'Node.js', 'Stripe'], '$5000-$10000', 'freelance'),
  ('770e8400-e29b-41d4-a716-446655440002', 'Dashboard Analytics', 'Panel de control con métricas empresariales y visualizaciones en tiempo real', '660e8400-e29b-41d4-a716-446655440002', ARRAY['Vue.js', 'Python', 'PostgreSQL', 'D3.js'], '$8000-$15000', 'contract'),
  ('770e8400-e29b-41d4-a716-446655440003', 'Sistema de Gestión', 'Software para administración de inventarios y control de stock', '660e8400-e29b-41d4-a716-446655440003', ARRAY['React', 'TypeScript', 'Node.js', 'MongoDB'], '$12000-$20000', 'full-time'),
  ('770e8400-e29b-41d4-a716-446655440004', 'Plataforma de Cursos', 'Sistema LMS para crear y gestionar cursos online', '660e8400-e29b-41d4-a716-446655440004', ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], '$15000-$25000', 'freelance'),
  ('770e8400-e29b-41d4-a716-446655440005', 'API de Microservicios', 'Arquitectura de microservicios para aplicación empresarial', '660e8400-e29b-41d4-a716-446655440005', ARRAY['Java', 'Spring Boot', 'Docker', 'Kubernetes'], '$20000-$35000', 'full-time');

-- Insertar datos de ejemplo para connections (solo para testing)
INSERT INTO connections (id, developer_id, company_id, status, message) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'accepted', 'Me interesa trabajar en proyectos de React y Node.js'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'pending', 'Tengo experiencia en Python y Django, me gustaría colaborar'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'accepted', 'Especialista en frontend, disponible para proyectos de Vue.js'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'pending', 'Desarrolladora móvil con experiencia en React Native'),
  ('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'rejected', 'Java developer buscando oportunidades en proyectos empresariales');

-- Insertar datos de ejemplo para applications (solo para testing)
INSERT INTO applications (id, project_id, developer_id, cover_letter, proposed_rate, status) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Tengo 3 años de experiencia en React Native y he desarrollado apps similares. Me apasiona crear experiencias de usuario excepcionales.', 7500, 'pending'),
  ('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Especialista en Python y Django con experiencia en proyectos de analytics. Me gustaría contribuir a este dashboard.', 12000, 'reviewed'),
  ('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Frontend developer con experiencia en React y TypeScript. Me interesa este proyecto de gestión.', 15000, 'accepted'),
  ('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Desarrolladora móvil con experiencia en React Native y plataformas educativas. Perfecto para este LMS.', 18000, 'pending'),
  ('990e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Java developer senior con experiencia en microservicios y arquitecturas empresariales.', 25000, 'reviewed');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_connections_developer_id ON connections(developer_id);
CREATE INDEX idx_connections_company_id ON connections(company_id);
CREATE INDEX idx_applications_project_id ON applications(project_id);
CREATE INDEX idx_applications_developer_id ON applications(developer_id);

-- Función para actualizar el timestamp de updated_at (opcional)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at (opcional)
-- CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
