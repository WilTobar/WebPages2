/**
 * CuencaData — script.js
 * Módulos: Nav, HeroGrid, Reveal, Contadores,
 *          Carrusel, Portafolio, Formulario,
 *          Accesibilidad, BtnTop, BarraProgreso
 */

'use strict';

/* ═══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════
   BARRA DE PROGRESO
══════════════════════════════════════════ */
function initBarraProgreso() {
  const bar = $('#progress-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docH > 0 ? (window.scrollY / docH * 100) + '%' : '0%';
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   NAVEGACIÓN — Sticky + Hamburguesa
══════════════════════════════════════════ */
function initNavegacion() {
  const navbar = $('#navbar');
  const btnHam = $('#btn-hamburguesa');
  const menu   = $('#menu-principal');
  if (!navbar || !btnHam || !menu) return;

  // Scroll → añade clase .scrolled
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburguesa toggle
  btnHam.addEventListener('click', () => {
    const abierto = menu.classList.toggle('active');
    btnHam.classList.toggle('active', abierto);
    btnHam.setAttribute('aria-expanded', String(abierto));
    document.body.style.overflow = abierto ? 'hidden' : '';
  });

  // Cerrar al hacer click en enlace
  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      btnHam.classList.remove('active');
      btnHam.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Cerrar con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      menu.classList.remove('active');
      btnHam.classList.remove('active');
      btnHam.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btnHam.focus();
    }
  });

  // Marcar enlace activo según scroll
  const secciones = $$('section[id], header[id]');
  const actualizarActivo = () => {
    const scrollY = window.scrollY + 100;
    let activo = null;
    secciones.forEach(sec => {
      if (sec.offsetTop <= scrollY) activo = sec.id;
    });
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('activo', href === `#${activo}`);
    });
  };
  window.addEventListener('scroll', actualizarActivo, { passive: true });
}

/* ═══════════════════════════════════════════
   CUADRÍCULA HERO (ELEMENTO SIGNATURE)
   Genera caracteres de código que pulsan
══════════════════════════════════════════ */
function initHeroGrid() {
  const grid = $('#hero-grid');
  if (!grid) return;

  const chars = '01{}();=></>function const let return import class async await'.split('');
  const cols = Math.ceil(window.innerWidth / 28) + 2;
  const rows = Math.ceil(window.innerHeight / 28) + 2;
  const total = cols * rows;

  // Usar DocumentFragment para rendimiento
  const frag = document.createDocumentFragment();
  for (let i = 0; i < total; i++) {
    const span = document.createElement('span');
    span.className = 'hero-char';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.setProperty('--dur', (2.5 + Math.random() * 4) + 's');
    span.style.setProperty('--del', (Math.random() * 5) + 's');
    span.style.setProperty('--op', (0.05 + Math.random() * 0.3).toFixed(2));
    frag.appendChild(span);
  }
  grid.appendChild(frag);

  // Refrescar chars periódicamente para sensación "viva"
  setInterval(() => {
    const spans = $$('.hero-char', grid);
    const n = Math.floor(total * 0.1);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * spans.length);
      spans[idx].textContent = chars[Math.floor(Math.random() * chars.length)];
    }
  }, 2000);
}

/* ═══════════════════════════════════════════
   REVEAL AL SCROLL (IntersectionObserver)
══════════════════════════════════════════ */
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   CONTADORES ANIMADOS
══════════════════════════════════════════ */
function initContadores() {
  const nums = $$('.stat-numero');
  if (!nums.length) return;

  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animar = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duracion = 1800;
    const inicio = performance.now();

    const step = (ahora) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      el.textContent = Math.floor(ease(progreso) * target);
      if (progreso < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animar(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   CARRUSEL DE TESTIMONIOS
══════════════════════════════════════════ */
function initCarrusel() {
  const track  = $('#carrusel-track');
  const puntos = $('#carrusel-puntos');
  const btnPrev = $('#prev-btn');
  const btnNext = $('#next-btn');
  if (!track) return;

  const cards = $$('.testimonio-card', track);
  let actual = 0;
  let timer = null;

  // Crear puntos
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carrusel-punto' + (i === 0 ? ' activo' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Testimonio ${i + 1}`);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => ir(i));
    puntos.appendChild(btn);
  });

  const getPuntos = () => $$('.carrusel-punto', puntos);

  const ir = (idx) => {
    actual = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${actual * 100}%)`;
    getPuntos().forEach((p, i) => {
      p.classList.toggle('activo', i === actual);
      p.setAttribute('aria-selected', String(i === actual));
    });
    reiniciarTimer();
  };

  const reiniciarTimer = () => {
    clearInterval(timer);
    timer = setInterval(() => ir(actual + 1), 5500);
  };

  btnPrev?.addEventListener('click', () => ir(actual - 1));
  btnNext?.addEventListener('click', () => ir(actual + 1));

  // Soporte teclado
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') ir(actual - 1);
    if (e.key === 'ArrowRight') ir(actual + 1);
  });

  // Soporte touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) ir(actual + (diff > 0 ? 1 : -1));
  });

  reiniciarTimer();
}

/* ═══════════════════════════════════════════
   FILTROS DE PORTAFOLIO
══════════════════════════════════════════ */
function initPortafolio() {
  const btns    = $$('.filtro-btn');
  const tarjetas = $$('.proyecto-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filtro = btn.dataset.filtro;

      // Actualizar botones
      btns.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');

      // Mostrar / ocultar con animación
      tarjetas.forEach(card => {
        const cat = card.dataset.categoria;
        const mostrar = filtro === 'todos' || cat === filtro;
        if (mostrar) {
          card.style.display = '';
          requestAnimationFrame(() => card.classList.remove('oculto'));
        } else {
          card.classList.add('oculto');
          card.addEventListener('transitionend', () => {
            if (card.classList.contains('oculto')) card.style.display = 'none';
          }, { once: true });
        }
      });
    });
  });
}

/* ═══════════════════════════════════════════
   FORMULARIO DE CONTACTO
══════════════════════════════════════════ */
function initFormulario() {
  const form = $('#form-contacto');
  if (!form) return;

  const respuesta = $('#form-respuesta');

  const reglas = {
    nombre:  { min: 2, msg: 'Ingresa tu nombre completo (mínimo 2 caracteres).' },
    correo:  { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingresa un correo válido.' },
    servicio:{ required: true, msg: 'Selecciona un servicio.' },
    mensaje: { min: 10, msg: 'El mensaje debe tener al menos 10 caracteres.' },
  };

  const validarCampo = (campo) => {
    const regla = reglas[campo.name];
    if (!regla) return true;
    const val = campo.value.trim();
    const errorEl = $(`#error-${campo.name}`);

    let valido = true;
    let msg = '';

    if (regla.min && val.length < regla.min) { valido = false; msg = regla.msg; }
    if (regla.pattern && !regla.pattern.test(val)) { valido = false; msg = regla.msg; }
    if (regla.required && !val) { valido = false; msg = regla.msg; }

    campo.classList.toggle('error', !valido);
    if (errorEl) errorEl.textContent = valido ? '' : msg;
    return valido;
  };

  // Validación en tiempo real (blur)
  Object.keys(reglas).forEach(nombre => {
    const campo = form.elements[nombre];
    if (campo) campo.addEventListener('blur', () => validarCampo(campo));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let todoValido = true;
    Object.keys(reglas).forEach(nombre => {
      const campo = form.elements[nombre];
      if (campo && !validarCampo(campo)) todoValido = false;
    });

    if (!todoValido) return;

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    // Simular envío (reemplazar con fetch real al backend)
    await new Promise(res => setTimeout(res, 1500));

    respuesta.textContent = '✓ Mensaje enviado. Te contactamos en menos de 24 horas.';
    respuesta.style.color = '#22C55E';
    form.reset();
    btn.textContent = 'Enviar mensaje →';
    btn.disabled = false;

    setTimeout(() => { respuesta.textContent = ''; }, 6000);
  });
}

/* ═══════════════════════════════════════════
   BOTÓN VOLVER ARRIBA
══════════════════════════════════════════ */
function initBtnTop() {
  const btn = $('#btn-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════
   PANEL DE ACCESIBILIDAD
══════════════════════════════════════════ */
/*function initAccesibilidad() {
  const btnAcc      = $('#btn-accesibilidad');
  const panel       = $('#panel-accesibilidad');
  const btnContraste = $('#btn-contraste');
  const btnMas      = $('#btn-fuente-mas');
  const btnMenos    = $('#btn-fuente-menos');
  const btnReset    = $('#btn-fuente-reset');
  if (!btnAcc || !panel) return;

  let escala = parseFloat(localStorage.getItem('cd-escala') || '1');
  let contraste = localStorage.getItem('cd-contraste') === 'true';

  // Aplicar estado guardado
  document.documentElement.style.setProperty('--font-scale', escala);
  if (contraste) {
    document.body.classList.add('alto-contraste');
    btnContraste?.setAttribute('aria-pressed', 'true');
  }

  // Abrir / cerrar panel
  btnAcc.addEventListener('click', () => {
    const abierto = !panel.hidden;
    panel.hidden = abierto;
    btnAcc.setAttribute('aria-expanded', String(!abierto));
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btnAcc) {
      panel.hidden = true;
      btnAcc.setAttribute('aria-expanded', 'false');
    }
  });

  // Alto contraste
  btnContraste?.addEventListener('click', () => {
    contraste = !contraste;
    document.body.classList.toggle('alto-contraste', contraste);
    btnContraste.setAttribute('aria-pressed', String(contraste));
    localStorage.setItem('cd-contraste', contraste);
  });

  // Tamaño fuente
  const aplicarEscala = (nueva) => {
    escala = Math.max(0.8, Math.min(1.4, nueva));
    document.documentElement.style.setProperty('--font-scale', escala);
    localStorage.setItem('cd-escala', escala);
  };

  btnMas?.addEventListener('click', () => aplicarEscala(escala + 0.1));
  btnMenos?.addEventListener('click', () => aplicarEscala(escala - 0.1));
  btnReset?.addEventListener('click', () => aplicarEscala(1));
}
*/

/* ═══════════════════════════════════════════
   SCROLL SUAVE para anclas del mismo sitio
══════════════════════════════════════════ */
function initScrollSuave() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const destino = document.getElementById(id);
      if (!destino) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 72;
      const top = destino.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════
   INIT — Arranque cuando el DOM está listo
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initBarraProgreso();
  initNavegacion();
  initHeroGrid();
  initReveal();
  initContadores();
  initCarrusel();
  initPortafolio();
  initFormulario();
  initBtnTop();
  initAccesibilidad();
  initScrollSuave();
});
