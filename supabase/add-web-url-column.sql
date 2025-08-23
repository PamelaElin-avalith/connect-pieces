-- Script para agregar columna web_url a la tabla developers existente
-- Ejecuta esto si ya tienes la tabla developers creada

-- Agregar columna web_url a developers
ALTER TABLE developers 
ADD COLUMN IF NOT EXISTS web_url text;

-- Verificar que se agregó la columna
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'developers' 
AND column_name = 'web_url';

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
