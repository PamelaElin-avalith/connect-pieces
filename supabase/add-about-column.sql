-- Agregar columna "about" a la tabla developers
ALTER TABLE developers 
ADD COLUMN IF NOT EXISTS about TEXT;

-- Agregar columna "about" a la tabla companies
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS about TEXT;

-- Comentarios para documentar el propósito de la columna
COMMENT ON COLUMN developers.about IS 'Información adicional sobre el desarrollador, experiencia, objetivos profesionales';
COMMENT ON COLUMN companies.about IS 'Información adicional sobre la empresa, misión, visión, valores';

-- Actualizar políticas RLS si es necesario (las existentes deberían funcionar)
-- La columna about se incluye automáticamente en las políticas SELECT, UPDATE, INSERT existentes
