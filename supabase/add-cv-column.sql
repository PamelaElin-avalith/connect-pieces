-- Script para agregar columnas CV y Web a la tabla developers existente
-- Ejecuta esto si ya tienes la tabla developers creada

-- Agregar columna cv_url a developers
ALTER TABLE developers 
ADD COLUMN IF NOT EXISTS cv_url text;

-- Agregar columna web_url a developers
ALTER TABLE developers 
ADD COLUMN IF NOT EXISTS web_url text;

-- Verificar que se agregaron las columnas
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'developers' 
AND column_name IN ('cv_url', 'web_url');

-- Mostrar estructura actual de la tabla developers
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'developers'
ORDER BY ordinal_position;
