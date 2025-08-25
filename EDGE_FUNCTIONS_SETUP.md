# 🚀 Configuración de Supabase Edge Functions para Envío de Emails

## 📋 Requisitos Previos

1. **Supabase CLI instalado**
2. **Cuenta de Supabase configurada**
3. **API key de Resend configurada**

## 🔧 Pasos de Configuración

### 1. Instalar Supabase CLI

```bash
npm install -g supabase
```

### 2. Iniciar sesión en Supabase

```bash
supabase login
```

### 3. Vincular proyecto

```bash
supabase link --project-ref sjzcnmrcombonnwxybwn
```

### 4. Configurar variables de entorno

```bash
supabase secrets set RESEND_API_KEY=re_aMMrNDD7_AFwdN7FLR939JEHHkWMw8G5i
```

### 5. Desplegar Edge Functions

```bash
supabase functions deploy send-email
```

### 6. Verificar despliegue

```bash
supabase functions list
```

## 🌐 Uso

La Edge Function estará disponible en:

```
https://tu-project-ref.supabase.co/functions/v1/send-email
```

## 🔒 Seguridad

- La función no requiere JWT (verify_jwt = false)
- Solo acepta peticiones POST
- Valida campos requeridos
- Maneja errores de forma segura

## 📧 Formato de Petición

```json
{
  "name": "Nombre del remitente",
  "email": "email@ejemplo.com",
  "subject": "Asunto del mensaje",
  "message": "Contenido del mensaje",
  "recipientEmail": "destinatario@ejemplo.com",
  "recipientName": "Nombre del destinatario"
}
```

## ✅ Respuesta Exitosa

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": { ... }
}
```

## ❌ Respuesta de Error

```json
{
  "error": "Descripción del error"
}
```
