# 🔐 Guía de Seguridad — KOBA-STUDIO

## Estado de Seguridad

### ✅ Implementado

1. **Autenticación JWT**
   - Middleware para verificar tokens en endpoints protegidos
   - Validación contra Supabase Auth
   - Soporte para usuarios anónimos (sin token)

2. **Rate Limiting**
   - 5 mensajes por hora por IP en `/api/contact`
   - 100 requests por 15 minutos por IP (global)
   - 60 requests por minuto por usuario autenticado

3. **Validación de Inputs**
   - Validación de email con librería `validator`
   - Límites de longitud en campos
   - Sanitización con escape() para prevenir XSS

4. **Row Level Security (RLS) en Supabase**
   - Tabla `contact_messages`: usuarios ven solo sus mensajes
   - Tabla `purchases`: usuarios ven solo sus compras
   - Tabla `products`: lectura pública, escritura admin-only

5. **CORS**
   - Configurado en servidor para aceptar solo `http://localhost:5173` (desarrollo)
   - Debe actualizarse en producción

### 🔴 CRÍTICO: Implementar Antes de Producción

#### 1. **Ejecutar SQL de RLS en Supabase**
```bash
1. Ir a Supabase Dashboard → SQL Editor
2. Copiar contenido de: backend/sql/rls-policies.sql
3. Ejecutar todas las políticas
```

**Sin RLS**, cualquiera podría leer todos los mensajes de contacto.

#### 2. **Configurar Variables en Cloudflare Pages**
```
Settings → Environment variables (Production)

VITE_API_URL: https://api.kobastudio.com/api
(o tu URL de backend en producción)

VITE_SUPABASE_URL: https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY: tu-anon-key
```

#### 3. **Configurar Variables en Cloudflare Workers / Backend**
Si desplegás el backend en Cloudflare:

```
SUPABASE_URL: https://your-project.supabase.co
SUPABASE_ANON_KEY: tu-anon-key
FRONTEND_URL: https://kobastudio.com
JWT_SECRET: generar con: openssl rand -base64 32
```

#### 4. **Actualizar CORS en server.js**
```javascript
// Cambiar de:
origin: process.env.FRONTEND_URL || 'http://localhost:5173'

// Para producción, hacer más específico:
origin: ['https://kobastudio.com', 'https://www.kobastudio.com']
```

### ⚠️ Posibles Mejoras Futuras

1. **Email Notifications**
   - Enviar email a admin cuando hay nuevo contacto
   - Configurar SMTP (Gmail, SendGrid, etc.)

2. **Captcha**
   - Agregar reCAPTCHA v3 en formulario de contacto
   - Prevenir bots

3. **Payment Gateway Security**
   - Implementar webhooks de Mercado Pago con firma
   - Guardar pagos en tabla de Supabase con RLS

4. **Audit Logging**
   - Registrar acceso a datos sensibles
   - Tabla de `audit_logs` con RLS

5. **Rate Limiting por Usuario**
   - Limitar basado en user_id cuando están autenticados
   - Implementado pero comentado en rateLimiter.js

---

## Checklist de Deploy a Producción

- [ ] Ejecutar SQL de RLS en Supabase
- [ ] Configurar variables en Cloudflare (frontend)
- [ ] Configurar variables de backend (si está en servidor separado)
- [ ] Actualizar CORS en server.js
- [ ] Verificar HTTPS en todas las URLs
- [ ] Probar endpoint `/api/contact` con JWT
- [ ] Probar endpoint `/api/contact` sin JWT (debe funcionar)
- [ ] Verificar rate limiting está activo
- [ ] Revisar logs de Supabase para errores de RLS
- [ ] Hacer test manual del formulario de contacto

---

## Endpoints Protegidos

### Públicos (sin autenticación requerida)
- `POST /api/contact` — Enviar mensaje de contacto (rate limited)
- `GET /api/products` — Listar productos
- `GET /health` — Health check

### Autenticados (requieren JWT)
- `GET /api/purchases` — Ver tus compras
- `PUT /api/auth/update` — Actualizar perfil

### Admin-only (requieren JWT + rol admin)
- `GET /api/contact` — Ver todos los mensajes (no implementado)
- `PUT /api/products/:id` — Editar producto

---

## Cómo Pasar JWT desde Frontend

El formulario de contacto ahora automáticamente agrega el JWT si el usuario está autenticado:

```javascript
// En Contacto.jsx
if (user) {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
}
```

Sin user: el endpoint funciona de todas formas (seguro por rate limiting + RLS)
Con user: se guarda `user_id` en la BD para auditoría

---

## Respaldo de Credenciales

**NUNCA** commitear a git:
- `.env`, `.env.local`
- Keys de Supabase
- Tokens de pago
- Secrets de JWT

Están protegidos en `.gitignore`.

Para desarrollo local, crear `.env.local` copiando `.env.example`.

---

## Testing de Seguridad

### Probar rate limiting:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/contact \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Test","email":"test@test.com","mensaje":"Test"}' &
done
# El 6to request debe retornar 429 Too Many Requests
```

### Probar validación:
```bash
# Email inválido
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"invalid","mensaje":"Test"}'
# Debe retornar 400 con "Email inválido"
```

### Probar RLS:
```javascript
// En Supabase con anon key
const { data, error } = await supabase
  .from('contact_messages')
  .select('*')
// Debe retornar [] (vacío, no error)
// Porque anon no puede leer, solo insertar
```

---

## Referencias

- [Supabase RLS Documentation](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
