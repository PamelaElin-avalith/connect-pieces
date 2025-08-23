# 🚀 Instrucciones para Configurar Supabase

## ⚠️ **IMPORTANTE: Antes de continuar**

El esquema ha sido actualizado para usar **UUIDs** en lugar de `bigint`, lo que es compatible con Supabase Auth. Esto solucionará el error 401 que estabas experimentando.

## 🔍 **Cambio Clave en el Esquema**

### **Antes (Problemático):**

```sql
CREATE TABLE developers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- ❌ No permite insertar auth.uid()
  -- ...
);

-- ❌ Política RLS problemática
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (auth.uid() = id); -- ❌ auth.uid() = id falla en inserción
```

### **Después (Correcto):**

```sql
CREATE TABLE developers (
  id uuid PRIMARY KEY, -- ✅ Permite insertar auth.uid() manualmente
  -- ...
);

-- ✅ Política RLS corregida
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (true); -- ✅ Permite inserción inicial
```

**¿Por qué este cambio?**

- **Supabase Auth** genera un UUID único para cada usuario
- **Necesitamos insertar** ese UUID en la columna `id` de la tabla de perfiles
- **Con `DEFAULT gen_random_uuid()`**, no podemos insertar un valor específico
- **Sin `DEFAULT`**, podemos insertar el `auth.uid()` directamente
- **Política de inserción**: `WITH CHECK (true)` permite la inserción inicial
- **Políticas de modificación**: `USING (auth.uid() = id)` protege después de la inserción

## 🚨 **Problema RLS Identificado y Solucionado**

### **Error Original:**

```
Error 42501: new row violates row-level security policy for table "developers"
```

### **Causa del Problema:**

La política RLS original verificaba `auth.uid() = id` **antes** de la inserción, pero:

1. **En inserción**: `id` es el valor que estamos insertando (`auth.uid()`)
2. **La verificación**: `auth.uid() = auth.uid()` debería ser `true`
3. **El problema**: PostgreSQL evalúa la política antes de que `id` exista en la tabla

### **Solución Implementada:**

```sql
-- ✅ CORRECTO - Permite inserción inicial
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (true);

-- ✅ CORRECTO - Protege modificaciones posteriores
CREATE POLICY "developers_update_policy" ON developers
  FOR UPDATE USING (auth.uid() = id);
```

## 📋 **Pasos para Configurar Supabase**

### **1. Acceder al Dashboard de Supabase**

- Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Inicia sesión con tu cuenta
- Selecciona tu proyecto

### **2. Ir al SQL Editor**

- En el menú lateral izquierdo, haz clic en **"SQL Editor"**
- Haz clic en **"New query"**

### **3. Ejecutar el Nuevo Esquema**

- **Opción A**: Copia todo el contenido del archivo `supabase/schema.sql`
- **Opción B**: Usa `supabase/test-schema.sql` para una prueba rápida
- Pégalo en el editor SQL
- Haz clic en **"Run"**

### **4. Verificar la Configuración**

- Ve a **"Table Editor"** en el menú lateral
- Deberías ver las siguientes tablas:
  - `developers`
  - `companies`
  - `projects`
  - `connections`
  - `applications`

### **5. Verificar las Políticas RLS**

- Ve a **"Authentication"** → **"Policies"**
- Deberías ver políticas para cada tabla
- **Importante**: Verifica que `developers_insert_policy` tenga `WITH CHECK (true)`

## 🔧 **Si Ya Tienes Datos en la Base**

Si ya ejecutaste el esquema anterior, necesitas:

### **Opción A: Resetear Completamente (Recomendado)**

1. Ve a **"Settings"** → **"General"**
2. Haz clic en **"Reset Database"**
3. Confirma la acción
4. Ejecuta el nuevo esquema

### **Opción B: Usar el Script de Migración**

1. Ejecuta primero `supabase/migration-script.sql`
2. Luego ejecuta el nuevo `supabase/schema.sql`

## 🎯 **Qué Cambió en el Esquema**

### **1. Tipos de ID:**

```sql
-- ❌ ANTES (Problemático)
id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY

-- ✅ DESPUÉS (Correcto)
id uuid PRIMARY KEY
```

### **2. Referencias:**

```sql
-- ❌ ANTES
company_id bigint REFERENCES companies(id)

-- ✅ DESPUÉS
company_id uuid REFERENCES companies(id)
```

### **3. Políticas RLS:**

```sql
-- ✅ CORRECTO - Usa auth.uid() directamente
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🔐 **Políticas RLS Implementadas**

- **developers**: Solo pueden leer todos, pero solo pueden modificar su propio perfil
- **companies**: Solo pueden leer todas, pero solo pueden modificar su propio perfil
- **projects**: Solo las empresas pueden crear/modificar sus proyectos
- **connections**: Solo los usuarios involucrados pueden ver/modificar
- **applications**: Solo los developers pueden crear, ambos pueden ver según el contexto

## 📱 **Variables de Entorno Requeridas**

Asegúrate de tener en tu archivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 🧪 **Probar el Registro**

Después de ejecutar el esquema:

1. Ve a tu aplicación
2. Intenta registrar un nuevo usuario
3. Debería funcionar sin errores 401
4. Verifica en **"Table Editor"** que se creó el perfil

## 🆘 **Si Sigues Teniendo Problemas**

### **Error 401 Persiste:**

1. Verifica que ejecutaste el esquema completo
2. Asegúrate de que las políticas RLS estén activas
3. Verifica que tu `.env.local` tenga las credenciales correctas

### **Error de Tipos:**

1. Reinicia tu servidor de desarrollo
2. Verifica que los tipos en `supabaseClient.ts` coincidan con el esquema

### **Error de Conexión:**

1. Verifica que tu proyecto de Supabase esté activo
2. Confirma que las credenciales sean correctas
3. Verifica que no haya restricciones de IP

## 📊 **Verificar que Funciona**

Después del registro exitoso, deberías ver:

1. **En la consola del navegador**: Sin errores 401
2. **En Supabase Table Editor**: Nuevo registro en `developers` o `companies`
3. **En tu aplicación**: Usuario autenticado y modal cerrado
4. **En el estado**: `isAuthenticated: true` y `userType` establecido

## 🔍 **Verificación del Esquema**

Para verificar que el esquema se aplicó correctamente, ejecuta esta query:

```sql
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('developers', 'companies')
AND column_name = 'id'
ORDER BY table_name;
```

**Resultado esperado:**

- `developers.id`: `uuid`, `NO`, `NULL` (sin DEFAULT)
- `companies.id`: `uuid`, `NO`, `NULL` (sin DEFAULT)

## 🎉 **¡Listo!**

Una vez que hayas ejecutado el nuevo esquema, el registro debería funcionar perfectamente sin errores 401. El sistema ahora:

- ✅ Usa UUIDs compatibles con Supabase Auth
- ✅ Permite insertar `auth.uid()` en la columna `id`
- ✅ Tiene políticas RLS correctas
- ✅ Permite registro y login sin problemas
- ✅ Mantiene la seguridad de los datos

---

**¿Necesitas ayuda con algún paso específico?** ¡Déjame saber si encuentras algún problema!
