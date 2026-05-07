# 🔐 Pasos Finales para Asegurar las APIs

## Status Actual
✅ Backend seguro implementado
✅ Rate limiting configurado
✅ Validación de inputs
✅ Middleware de autenticación
✅ SQL de RLS listo

**PENDIENTE:** Ejecutar SQL en Supabase para activar RLS

---

## PASO 1: Ejecutar RLS en Supabase (CRÍTICO)

### 1a. Acceder a Supabase
1. Ir a [https://app.supabase.com](https://app.supabase.com)
2. Seleccionar tu proyecto
3. Ir a `SQL Editor` (lado izquierdo)

### 1b. Ejecutar el SQL
1. Crear nueva query o click en "New query"
2. Copiar TODO el contenido de: `SECURITY.md` (sección "Row Level Security")
   O copiar archivo: `koba-studio-backend/sql/rls-policies.sql`
3. Pegar en el SQL Editor
4. Click en "Run"

**Verás:**
```
CREATE TABLE ... SUCCESS
ALTER TABLE ... SUCCESS
CREATE POLICY ... SUCCESS
(x8 policies más)
```

Si ves errores de "policy already exists", es normal. Ignorar.

### 1c. Verificar que RLS está activo
En Supabase Dashboard:
1. Ir a `Table Editor`
2. Seleccionar tabla `contact_messages`
3. Click en `RLS` (arriba a la derecha)
4. Debe mostrar "RLS is ON"

---

## PASO 2: Crear Tabla contact_messages (si no existe)

Si la tabla no existe, el SQL anterior la crea automáticamente.

**Verificar en Supabase:**
1. Table Editor → debe haber tabla `contact_messages`
2. Con campos: id, nombre, email, mensaje, servicio, empresa, urgencia, user_id, ip_address, read, created_at

Si NO existe, ejecutar este SQL simple:

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  servicio TEXT,
  empresa TEXT,
  urgencia TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## PASO 3: Probar que todo funciona

### 3a. Iniciar servidor backend localmente

```bash
cd koba-studio-backend
npm install  # Si no lo hiciste
npm run dev  # Debe mostrar: Server running on http://localhost:3001
```

### 3b. Probar desde frontend

1. Abrir http://localhost:5173/contacto
2. Llenar el formulario
3. Click en "Enviar"
4. Debe mostrar "¡Recibimos tu mensaje!"

### 3c. Probar rate limiting

Enviar 6 mensajes en rápida sucesión:
- Los primeros 5: SUCCESS
- El 6to: Error "Demasiados mensajes enviados desde esta IP"

### 3d. Verificar que se guardó en Supabase

1. Supabase Dashboard → Table Editor → `contact_messages`
2. Debe haber nuevas filas con tus mensajes de prueba
3. Si estabas autenticado: `user_id` debe tener tu UUID
4. Si eras anónimo: `user_id` = NULL

---

## PASO 4: Pushear cambios a main

Una vez que:
- ✅ RLS está activo en Supabase
- ✅ Probaste y funciona
- ✅ Viste mensajes guardados en BD

### Crear PR:
**Link:** https://github.com/koba-Studio/koba-studio/compare/main...claude/laughing-bhabha-13de69

O usar gh CLI:
```bash
cd koba-studio-react
gh pr create \
  --base main \
  --head claude/laughing-bhabha-13de69 \
  --title "feat: dashboard redesign + API security" \
  --body "Implementa dashboard redesignado y seguridad completa de APIs"
```

### Mergear:
```bash
gh pr merge --squash  # Desde el PR
```

---

## PASO 5: Configurar en Cloudflare (Producción)

### Variables de entorno en Cloudflare Pages:

1. Ir a tu proyecto en Cloudflare Pages
2. Settings → Environment variables
3. Agregar (production):

```
VITE_API_URL = https://api.kobastudio.com
(o tu dominio real del backend)

VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = tu-anon-key
```

4. Redeploy el sitio

### Si el backend está en servidor aparte:

1. Configurar `.env` en el servidor con:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
FRONTEND_URL=https://kobastudio.com
PORT=3001
```

2. Actualizar CORS en server.js:
```javascript
app.use(cors({
  origin: ['https://kobastudio.com', 'https://www.kobastudio.com'],
  credentials: true,
}))
```

---

## PASO 6: Verificación Final (Checklist)

Antes de considerar esto "done":

- [ ] RLS está activo en Supabase (verificado en Dashboard)
- [ ] Tabla `contact_messages` existe y tiene datos de prueba
- [ ] Backend corre en localhost:3001 sin errores
- [ ] Formulario de contacto envía mensajes
- [ ] Rate limiting bloquea el 6to mensaje
- [ ] PR creado y mergeado a main
- [ ] Cloudflare Pages redeploy completado
- [ ] Variables de entorno en Cloudflare configuradas
- [ ] Probaste formulario en sitio en producción

---

## 🚨 Problemas Comunes

### "Error: Missing or invalid authorization header"
- Respuesta: El endpoint acepta anónimos. Es un error de logeo.
- Solución: Ignorar, es correcto.

### "Policy already exists" en SQL
- Respuesta: Supabase detectó que la política ya existe
- Solución: OK. Continuar.

### "Too Many Requests" en 2do o 3er mensaje
- Respuesta: Rate limiting más agresivo de lo esperado
- Solución: Esperar 1 hora, o cambiar windowMs en rateLimiter.js

### Mensajes no aparecen en Supabase
- Verificar: RLS está en "ON"
- Verificar: usuario autenticado? Mirá `user_id`
- Verificar: logs de backend en terminal

---

## Soporte

Si algo no funciona:
1. Revisar SECURITY.md
2. Revisar logs en backend terminal
3. Revisar console del navegador (F12)
4. Revisar Supabase Dashboard → Logs

---

**¡Eso es todo! Una vez que hagas el merge a main, tus APIs estarán seguras y listas para producción.**
