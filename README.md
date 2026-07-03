# CuencaData — Sitio Web Corporativo

Sitio web corporativo para **CuencaData**, empresa de desarrollo de software con sede en Cuenca, Ecuador.

## Estructura del proyecto

```
CuencaData/
│
├── index.html          # Página principal (single page)
│
├── css/
│   ├── estilos.css     # Sistema de diseño, componentes, animaciones
│   └── responsive.css  # Breakpoints tablet y móvil
│
├── js/
│   └── script.js       # Módulos ES6: nav, hero, carrusel, filtros, etc.
│
├── img/                # (vacío — imágenes reales se agregan aquí)
│   ├── logo.png
│   ├── hero.jpg
│   ├── servicios/
│   ├── equipo/
│   ├── proyectos/
│   └── iconos/
│
└── README.md
```

## Características

- **Sin frameworks externos** — HTML5 puro, CSS3, JavaScript ES6
- **Totalmente responsivo** — escritorio, tablet (≤900px), móvil (≤600px)
- **Accesibilidad** — roles ARIA, foco visible, `prefers-reduced-motion`
- **HTML semántico** — `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<address>`

## Módulos JavaScript

| Módulo | Función |
|---|---|
| `initBarraProgreso` | Barra de progreso de lectura superior |
| `initNavegacion` | Menú sticky + hamburguesa + enlace activo |
| `initHeroGrid` | Cuadrícula de código animado (signature del sitio) |
| `initReveal` | Aparición de elementos al hacer scroll (IntersectionObserver) |
| `initContadores` | Contadores animados con easing |
| `initCarrusel` | Carrusel de testimonios con touch/swipe y teclado |
| `initPortafolio` | Filtros de proyectos por categoría |
| `initFormulario` | Validación de formulario en tiempo real |
| `initBtnTop` | Botón flotante "Volver arriba" |
| `initAccesibilidad` | Panel: alto contraste + escala de fuente + localStorage |
| `initScrollSuave` | Scroll suave para todos los anclas internos |

## Cómo usar

1. Abrir `index.html` directamente en el navegador o servir con Live Server (VS Code).
2. Para producción, colocar todos los archivos en el servidor.
3. Reemplazar el `fetch` comentado en `initFormulario` con el endpoint real del backend.

## Integración con backend

El formulario de contacto está preparado para integrarse con un API REST:

```javascript
// En script.js — initFormulario()
// Reemplazar el setTimeout de simulación con:
const res = await fetch('/api/contacto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
});
```

Compatible con Spring Boot, Django, Laravel u cualquier backend REST.

## Paleta de colores

| Token | Color | Hex |
|---|---|---|
| `--azul-oscuro` | Fondo principal | `#0F172A` |
| `--azul-tec` | Acento primario | `#2563EB` |
| `--celeste` | Acento secundario | `#38BDF8` |
| `--blanco` | Texto / fondos claros | `#FFFFFF` |
| `--gris-claro` | Fondos de tarjetas | `#F8FAFC` |
| `--gris-oscuro` | Texto base | `#334155` |

## Tipografía

- **Space Grotesk** — Display / encabezados (carácter técnico pero accesible)
- **Inter** — Cuerpo de texto (legibilidad óptima en pantalla)
- **JetBrains Mono** — Etiquetas de código, eyebrows, tags

---

© 2025 CuencaData. Todos los derechos reservados.
