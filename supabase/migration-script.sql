-- Script de migración para cambiar de bigint a UUID
-- Ejecuta esto SOLO si ya tienes datos en tu base de datos

-- ⚠️ ADVERTENCIA: Este script eliminará todos los datos existentes
-- Si quieres conservar datos, haz backup antes de ejecutar

-- 1. Eliminar todas las tablas existentes
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS developers CASCADE;

-- 2. Eliminar políticas RLS existentes (si las hay)
-- (Esto se hace automáticamente al eliminar las tablas)

-- 3. Ejecutar el nuevo esquema
-- Copia y pega el contenido completo de schema.sql aquí
-- O ejecuta schema.sql en una nueva query

-- 4. Verificar que las tablas se crearon correctamente
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('developers', 'companies', 'projects', 'connections', 'applications')
ORDER BY table_name, ordinal_position;

-- 5. Verificar que las políticas RLS están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
