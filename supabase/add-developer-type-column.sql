-- Agregar columna "developer_type" a la tabla developers
ALTER TABLE developers 
ADD COLUMN IF NOT EXISTS developer_type VARCHAR(50);

-- Crear un tipo ENUM para los tipos de desarrollador más comunes
-- (opcional, pero recomendado para consistencia de datos)
DO $$ BEGIN
    CREATE TYPE developer_type_enum AS ENUM (
        'Frontend',
        'Backend', 
        'Fullstack',
        'Mobile',
        'DevOps',
        'Data Science',
        'Machine Learning',
        'Game Development',
        'Embedded Systems',
        'UI/UX Designer',
        'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agregar constraint para validar el tipo (opcional)
ALTER TABLE developers 
ADD CONSTRAINT check_developer_type 
CHECK (developer_type IN (
    'Frontend', 'Backend', 'Fullstack', 'Mobile', 'DevOps', 
    'Data Science', 'Machine Learning', 'Game Development', 
    'Embedded Systems', 'UI/UX Designer', 'Other'
));

-- Comentarios para documentar el propósito de la columna
COMMENT ON COLUMN developers.developer_type IS 'Especialidad principal del desarrollador (Frontend, Backend, Fullstack, etc.)';

-- Actualizar políticas RLS si es necesario (las existentes deberían funcionar)
-- La columna developer_type se incluye automáticamente en las políticas SELECT, UPDATE, INSERT existentes
