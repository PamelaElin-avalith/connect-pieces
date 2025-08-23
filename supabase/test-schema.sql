-- Esquema de prueba simplificado para Connect Pieces
-- Ejecuta esto en Supabase SQL Editor para probar

-- Habilitar la extensión uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Developers (sin DEFAULT en id)
CREATE TABLE developers (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  skills text[] DEFAULT '{}',
  github text,
  linkedin text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Tabla de Companies (sin DEFAULT en id)
CREATE TABLE companies (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  sector text NOT NULL,
  description text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

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

-- Verificar que las tablas se crearon
SELECT 'developers' as table_name, count(*) as row_count FROM developers
UNION ALL
SELECT 'companies' as table_name, count(*) as row_count FROM companies;

-- Verificar las políticas RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('developers', 'companies')
ORDER BY tablename, policyname;
