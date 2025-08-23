-- Script para configurar el bucket de storage para CVs
-- Ejecuta esto en Supabase SQL Editor para configurar el storage

-- Crear bucket para archivos CV
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-files',
  'cv-files',
  true,
  5242880, -- 5MB en bytes
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Crear política para permitir subida de archivos
CREATE POLICY "Users can upload their own CVs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Crear política para permitir lectura pública de CVs
CREATE POLICY "CVs are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-files');

-- Crear política para permitir eliminación de CVs propios
CREATE POLICY "Users can delete their own CVs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cv-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Verificar que el bucket se creó correctamente
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'cv-files';

-- Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
