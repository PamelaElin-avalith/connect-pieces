# 📧 Configuración del Sistema de Emails

## 🚀 Configuración con Resend

### 1. Crear cuenta en Resend

- Ve a [resend.com](https://resend.com)
- Crea una cuenta gratuita
- Verifica tu dominio de email

### 2. Obtener API Key

- En el dashboard de Resend, ve a "API Keys"
- Crea una nueva API key
- Copia la key generada

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Resend (Email Service)
VITE_RESEND_API_KEY=tu_api_key_de_resend
```

### 4. Verificar dominio

- En Resend, ve a "Domains"
- Agrega tu dominio (ej: connectpieces.com)
- Sigue las instrucciones de verificación DNS

## 📝 Notas importantes

- **Resend**: Ofrece 3,000 emails gratuitos por mes
- **Seguridad**: Nunca compartas tus API keys
- **Producción**: Usa dominios verificados para mejor deliverability

## 🧪 Probar el sistema

1. Configura las variables de entorno
2. Reinicia el servidor de desarrollo
3. Ve a `/developers` o `/companies`
4. Haz clic en "Conectar" o "Ver Perfil"
5. Llena el formulario y envía
6. Verifica que el email llegue al destinatario

## 🚨 Solución de problemas

### Error: "API key de Resend no configurada"

- Verifica que `.env.local` existe
- Asegúrate de que `VITE_RESEND_API_KEY` esté configurado
- Reinicia el servidor después de cambiar variables de entorno

### Error: "Error de Resend"

- Verifica que tu API key sea válida
- Asegúrate de que tu dominio esté verificado en Resend
- Revisa los logs de la consola para más detalles

### Emails no llegan

- Verifica la carpeta de spam
- Asegúrate de que el dominio esté verificado
- Revisa la configuración de DNS
