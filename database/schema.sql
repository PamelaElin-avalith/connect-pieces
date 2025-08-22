-- Habilitar la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Developers
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

-- Tabla de Empresas
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

-- Tabla de conexiones entre developers y companies
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(developer_id, company_id)
);

-- Tabla de proyectos
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  skills_required text[] DEFAULT '{}',
  budget_range text,
  project_type text CHECK (project_type IN ('full-time', 'part-time', 'freelance', 'contract')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'completed', 'cancelled')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Tabla de aplicaciones a proyectos
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  cover_letter text,
  proposed_rate numeric(10,2),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(project_id, developer_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_developers_email ON developers(email);
CREATE INDEX idx_developers_skills ON developers USING GIN(skills);
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_sector ON companies(sector);
CREATE INDEX idx_connections_developer ON connections(developer_id);
CREATE INDEX idx_connections_company ON connections(company_id);
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills_required);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_developer ON applications(developer_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_developers_updated_at BEFORE UPDATE ON developers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Políticas para developers
CREATE POLICY "Developers can view all developers" ON developers FOR SELECT USING (true);
CREATE POLICY "Developers can insert their own profile" ON developers FOR INSERT WITH CHECK (auth.uid()::text = email);
CREATE POLICY "Developers can update their own profile" ON developers FOR UPDATE USING (auth.uid()::text = email);
CREATE POLICY "Developers can delete their own profile" ON developers FOR DELETE USING (auth.uid()::text = email);

-- Políticas para companies
CREATE POLICY "Companies can view all companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Companies can insert their own profile" ON companies FOR INSERT WITH CHECK (auth.uid()::text = email);
CREATE POLICY "Companies can update their own profile" ON companies FOR UPDATE USING (auth.uid()::text = email);
CREATE POLICY "Companies can delete their own profile" ON companies FOR DELETE USING (auth.uid()::text = email);

-- Políticas para connections
CREATE POLICY "Users can view connections they're involved in" ON connections FOR SELECT USING (
  auth.uid()::text IN (
    SELECT email FROM developers WHERE id = developer_id
    UNION
    SELECT email FROM companies WHERE id = company_id
  )
);
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update connections they're involved in" ON connections FOR UPDATE USING (
  auth.uid()::text IN (
    SELECT email FROM developers WHERE id = developer_id
    UNION
    SELECT email FROM companies WHERE id = company_id
  )
);

-- Políticas para projects
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Companies can create projects" ON projects FOR INSERT WITH CHECK (
  auth.uid()::text IN (SELECT email FROM companies WHERE id = company_id)
);
CREATE POLICY "Companies can update their own projects" ON projects FOR UPDATE USING (
  auth.uid()::text IN (SELECT email FROM companies WHERE id = company_id)
);

-- Políticas para applications
CREATE POLICY "Users can view applications they're involved in" ON applications FOR SELECT USING (
  auth.uid()::text IN (
    SELECT email FROM developers WHERE id = developer_id
    UNION
    SELECT email FROM companies WHERE id = (SELECT company_id FROM projects WHERE id = project_id)
  )
);
CREATE POLICY "Developers can create applications" ON applications FOR INSERT WITH CHECK (
  auth.uid()::text IN (SELECT email FROM developers WHERE id = developer_id)
);
CREATE POLICY "Companies can update applications to their projects" ON applications FOR UPDATE USING (
  auth.uid()::text IN (SELECT email FROM companies WHERE id = (SELECT company_id FROM projects WHERE id = project_id))
);
