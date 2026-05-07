# KOBA-STUDIO React — Instrucciones de Diseño

## ⚠️ REGLA CRÍTICA: No romper el diseño

Este proyecto tuvo múltiples sesiones donde el diseño se rompió al hacer cambios. Antes de modificar cualquier archivo de estilos o componentes, leer estas reglas.

---

## Fuente de verdad visual

Los archivos HTML originales en `D:\Documentos SSD\Proyectos\KOBA-STUDIO_MAIN\koba originales\` son la referencia definitiva de diseño. Ante cualquier duda, comparar con ellos antes de hacer cambios.

Archivos originales:
- `KoBa Studio v2.html` → Landing (home)
- `Servicios.html` → Servicios
- `Proceso.html` → Proceso
- `Productos.html` → Productos
- `Contacto.html` → Contacto
- `shared.css` → CSS base compartido

---

## Arquitectura del proyecto

```
koba-studio-react/src/
├── index.css          ← TODO el CSS va aquí. No crear archivos CSS adicionales.
├── App.jsx            ← Routing. NO incluir Navbar compartida (cada página tiene la suya)
└── pages/
    ├── Landing.jsx    ← Home
    ├── Servicios.jsx
    ├── Proceso.jsx
    ├── Productos.jsx
    ├── Contacto.jsx
    └── Dashboard.jsx
```

---

## Reglas de CSS — NO violar

### Clases de animación
- Las páginas usan `.wa` (NOT `.will-animate`) para IntersectionObserver
- El Landing usa `.will-animate` (legacy, ambas están definidas en index.css)
- NO cambiar la clase que usa cada página

### Sistema de gradientes por página
El CSS usa variables `--pg-from` y `--pg-to` en `:root`. Las subpáginas setean una clase en `document.body` para sus colores:

| Página | Clase body | Color from | Color to |
|--------|-----------|------------|----------|
| Landing | (ninguna) | `#7B6FE8` iris | `#E8507A` rose |
| Servicios | `page-servicios` | `#0EA5E9` sky | `#10B981` emerald |
| Proceso | `page-proceso` | `#F97316` orange | `#EF4444` red |
| Productos | `page-productos` | `#8B5CF6` violet | `#06B6D4` cyan |
| Contacto | `page-contacto` | `#EC4899` pink | `#F59E0B` amber |

Cada página agrega su clase en `useEffect` y la limpia al desmontar:
```jsx
useEffect(() => {
  document.body.classList.add('page-X')
  return () => document.body.classList.remove('page-X')
}, [])
```

### Gradientes que NO usan las variables de página (mantener hardcodeados)
- `btn-gold` → gradiente animado multi-stop (marca global)
- `.nav-links a::after` → hover underline (marca global)
- `.f-nav a::after` → footer hover (marca global)
- `.dash`, `.p-card-code-dot`, `.prog-dot.active` → Landing process section
- Crystal section gradients (`nth-child`) y `--grad-iris`

---

## Reglas de JS/React — NO violar

### Cursor
Todas las páginas (excepto Landing) usan lerp interpolation con `requestAnimationFrame`:
```js
const lerp = (a, b, t) => a + (b - a) * t
dx = lerp(dx, mx, 0.15)  // dot
rx = lerp(rx, mx, 0.07)  // ring
```
El Landing usa movimiento directo (sin lerp). NO unificar — son comportamientos distintos.

### Navbar
- Cada página tiene su propia `<nav>` interna (NO hay Navbar compartida en App.jsx)
- El hamburger usa `useState(mobileMenuOpen)` con toggle
- La clase `mobile-open` se agrega al `<ul className="nav-links">`
- El link activo lleva `className="active"` hardcodeado

### App.jsx
```jsx
// NO agregar <Navbar /> ni <Footer /> aquí — cada página los tiene propios
// NO usar componente Home — es Landing
```

### Animaciones de entrada (navbar)
```js
setTimeout(() => document.getElementById('nl')?.classList.add('in'), 100)
;['nl1','nl2','nl3','nl4'].forEach((id, i) =>
  setTimeout(() => document.getElementById(id)?.classList.add('in'), 250 + i * 100)
)
setTimeout(() => document.getElementById('nb')?.classList.add('in'), 650)
```

---

## Problemas que ocurrieron antes (no repetir)

1. **Tailwind conflicto**: Se instaló Tailwind que rompió todo el CSS. Tailwind NO está en este proyecto. Si `package.json` no lo tiene, no agregar.

2. **Navbar duplicada**: Se agregó `<Navbar />` en App.jsx Y cada página tenía su propio `<nav>`. Siempre solo una navbar por página.

3. **Clase `.will-animate` vs `.wa`**: Las subpáginas usan `.wa` para el IntersectionObserver. Si se cambia a `.will-animate` sin actualizar el CSS, las animaciones no disparan.

4. **Puerto Vite**: Si el servidor no arranca en 5173, hay procesos node colgados. Matar con PowerShell: `Get-Process node | Stop-Process -Force` antes de `npm run dev`.

5. **Romper index.css**: Este archivo tiene ~700 líneas de CSS cuidadosamente estructurado. Ante cualquier adición, leer primero qué ya existe para no duplicar ni contradecir.

---

## Cómo iniciar el servidor

```bat
cd koba-studio-react
npm run dev
# O usar start-dev.bat
```

Servidor en `http://localhost:5173` (o puerto siguiente disponible).

---

## Estado actual (Mayo 2025)

- ✅ Landing, Servicios, Proceso, Productos, Contacto — diseño restaurado y funcionando
- ✅ Hamburger mobile funciona en todas las páginas
- ✅ Sistema de gradiente por página implementado
- ✅ Proceso page: horizontal pan en scroll implementado
- ⏳ Backend / auth / payment gateway — pendiente (Fase 2)
- ⏳ Dashboard — pendiente de auth
