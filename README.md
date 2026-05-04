# KoBa Studio — Setup

## Estructura del proyecto

```
koba-studio/
├── index.html          ← HOME (hero, sticky cards, ticker, etc.)
├── store.html          ← /productos (catálogo)
├── servicios.html      ← /servicios
├── proceso.html        ← /proceso
├── contacto.html       ← /contacto
├── dashboard.html      ← área privada del usuario (requiere login)
├── admin/
│   └── index.html      ← panel interno (solo propietarios)
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── supabase.js     ← cliente Supabase
│   │   ├── auth.js         ← funciones de autenticación
│   │   ├── navbar.js       ← lógica del navbar
│   │   ├── modal.js        ← modal login/signup
│   │   ├── main.js         ← entrada principal (todas las páginas)
│   │   └── dashboard.js    ← lógica del dashboard (solo dashboard.html)
│   ├── images/
│   └── videos/
└── supabase-schema.sql ← ejecutar una vez en Supabase SQL Editor
```

## Configuración inicial

### 1. Supabase
1. Ir a supabase.com → tu proyecto → SQL Editor
2. Copiar y ejecutar el contenido de `supabase-schema.sql`
3. Verificar que las tablas `profiles`, `purchases` y `products` se crearon

### 2. HTML — agregar en cada página antes de `</body>`
```html
<script type="module" src="/assets/js/main.js"></script>
```

### 3. HTML — estructura del navbar requerida
```html
<nav id="navbar">
  <a href="/index.html" class="nav-logo">KoBa Studio</a>
  <div class="nav-links">
    <a href="/servicios.html">Servicios</a>
    <a href="/proceso.html">Proceso</a>
    <a href="/store.html">Productos</a>
    <a href="/contacto.html">Contacto</a>
  </div>
  <button id="btn-login" class="btn-outline">Iniciar sesión</button>
  <a href="/dashboard.html" id="btn-profile" style="display:none" class="btn-outline">
    Mi perfil
  </a>
</nav>
```

### 4. HTML — modal auth (agregar en index.html y todas las páginas)
```html
<div id="modal-auth" class="modal-overlay">
  <div class="modal-box">
    <button id="modal-close">&times;</button>
    <div class="modal-tabs">
      <button id="tab-login" class="active">Entrar</button>
      <button id="tab-signup">Registrarse</button>
    </div>
    <form id="form-login" style="display:flex; flex-direction:column; gap:12px">
      <input id="login-email" type="email" placeholder="Email" required />
      <input id="login-password" type="password" placeholder="Contraseña" required />
      <p id="error-login" style="color:red; font-size:13px"></p>
      <button type="submit" class="btn-primary">Entrar</button>
    </form>
    <form id="form-signup" style="display:none; flex-direction:column; gap:12px">
      <input id="signup-email" type="email" placeholder="Email" required />
      <input id="signup-password" type="password" placeholder="Contraseña (mínimo 6 caracteres)" required />
      <p id="error-signup" style="font-size:13px"></p>
      <button type="submit" class="btn-primary">Crear cuenta</button>
    </form>
  </div>
</div>
```

### 5. dashboard.html — agregar al final
```html
<script type="module" src="/assets/js/dashboard.js"></script>
```

## GitHub + Cloudflare Pages

### Primer deploy
```bash
git init
git add .
git commit -m "init koba-studio"
git remote add origin https://github.com/TU-USUARIO/koba-studio.git
git push -u origin main
```

### Cloudflare Pages
- Build command: (vacío)
- Output directory: /
- Root directory: /

### Colaboración con socio
```bash
# Crear rama para cambios
git checkout -b feature/nombre-del-cambio

# Subir rama
git push origin feature/nombre-del-cambio

# Fusionar a main cuando esté listo (en GitHub: Pull Request)
```
