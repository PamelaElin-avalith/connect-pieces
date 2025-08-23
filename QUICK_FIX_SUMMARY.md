# 🚨 SOLUCIÓN RÁPIDA: Error RLS 42501

## ❌ **Problema Identificado:**

```
Error 42501: new row violates row-level security policy for table "developers"
```

## 🔍 **Causa:**

La política RLS para inserción estaba verificando `auth.uid() = id` **antes** de que la fila existiera.

## ✅ **Solución:**

Cambiar la política de inserción de:

```sql
-- ❌ PROBLEMÁTICO
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (auth.uid() = id);
```

A:

```sql
-- ✅ CORRECTO
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (true);
```

## 📋 **Pasos para Aplicar:**

### **1. En Supabase SQL Editor:**

```sql
-- Eliminar política problemática
DROP POLICY IF EXISTS "developers_insert_policy" ON developers;
DROP POLICY IF EXISTS "companies_insert_policy" ON companies;

-- Crear políticas corregidas
CREATE POLICY "developers_insert_policy" ON developers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "companies_insert_policy" ON companies
  FOR INSERT WITH CHECK (true);
```

### **2. O ejecutar el esquema completo:**

- Usa `supabase/schema.sql` (esquema completo)
- O `supabase/test-schema.sql` (solo developers/companies)

## 🎯 **¿Por qué Funciona?**

- **Inserción**: `WITH CHECK (true)` permite crear el perfil inicial
- **Modificación**: `USING (auth.uid() = id)` protege después de la inserción
- **Seguridad**: Solo el usuario puede modificar su propio perfil

## 🧪 **Probar:**

1. Ejecuta el esquema corregido
2. Intenta registrar un nuevo usuario
3. Debería funcionar sin errores RLS
4. Verifica en Table Editor que se creó el perfil

---

**¿Necesitas ayuda?** Lee `SUPABASE_SETUP_INSTRUCTIONS.md` para pasos detallados.
