-- Verificar y crear la tabla projects si no existe
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
    skills_required TEXT[] DEFAULT '{}',
    budget_range VARCHAR(100),
    project_type VARCHAR(50) DEFAULT 'freelance',
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar columnas que puedan faltar
ALTER TABLE projects ADD COLUMN IF NOT EXISTS developer_id UUID REFERENCES developers(id) ON DELETE CASCADE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS skills_required TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget_range VARCHAR(100);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(50) DEFAULT 'freelance';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'open';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear la tabla applications si no existe
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    developer_id UUID REFERENCES developers(id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, developer_id)
);

-- Agregar políticas RLS para projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver proyectos
DO $$ BEGIN
    CREATE POLICY "Anyone can view projects" ON projects
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que usuarios autenticados puedan crear proyectos
DO $$ BEGIN
    CREATE POLICY "Authenticated users can create projects" ON projects
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que el creador pueda actualizar sus proyectos
DO $$ BEGIN
    CREATE POLICY "Users can update own projects" ON projects
        FOR UPDATE USING (
            auth.uid() = company_id OR 
            auth.uid() = developer_id
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que el creador pueda eliminar sus proyectos
DO $$ BEGIN
    CREATE POLICY "Users can delete own projects" ON projects
        FOR DELETE USING (
            auth.uid() = company_id OR 
            auth.uid() = developer_id
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agregar políticas RLS para applications
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Política para que todos puedan ver aplicaciones
DO $$ BEGIN
    CREATE POLICY "Anyone can view applications" ON applications
        FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que developers puedan crear aplicaciones
DO $$ BEGIN
    CREATE POLICY "Developers can create applications" ON applications
        FOR INSERT WITH CHECK (auth.uid() = developer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que el desarrollador pueda actualizar sus aplicaciones
DO $$ BEGIN
    CREATE POLICY "Developers can update own applications" ON applications
        FOR UPDATE USING (auth.uid() = developer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Política para que el desarrollador pueda eliminar sus aplicaciones
DO $$ BEGIN
    CREATE POLICY "Developers can delete own applications" ON applications
        FOR DELETE USING (auth.uid() = developer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_developer_id ON projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_developer_id ON applications(developer_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- Comentarios para documentar las tablas
COMMENT ON TABLE projects IS 'Tabla de proyectos creados por empresas o developers';
COMMENT ON TABLE applications IS 'Tabla de aplicaciones de developers a proyectos';
COMMENT ON COLUMN projects.company_id IS 'ID de la empresa que creó el proyecto (null si lo creó un developer)';
COMMENT ON COLUMN projects.developer_id IS 'ID del developer que creó el proyecto (null si lo creó una empresa)';
COMMENT ON COLUMN applications.status IS 'Estado de la aplicación: pending, reviewed, accepted, rejected';
