/* ============================================================
   main.js — O Violeiro Portfolio
   ============================================================ */

'use strict';

// ============================================================
// CURSOR PERSONALIZADO
// ============================================================
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();


// ============================================================
// LOADER
// ============================================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations after loader hides
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade, .hero .reveal-right')
      .forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150 + 300);
      });
  }, 1600);
});


// ============================================================
// BACK TO TOP
// ============================================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ============================================================
// HERO PARTICLES
// ============================================================
(function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const COUNT = 24;
  const notes = ['♪', '♫', '♩', '♬', '·', '·', '·'];

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.classList.add('particle');
    const isNote = i < 8;
    el.textContent = isNote ? notes[i % notes.length] : '';

    if (isNote) {
      el.style.cssText = `
        position: absolute;
        font-size: ${0.8 + Math.random() * 1.2}rem;
        color: rgba(212,160,52,${0.15 + Math.random() * 0.3});
        left: ${Math.random() * 100}%;
        bottom: ${-5 + Math.random() * 10}%;
        background: transparent;
        width: auto; height: auto;
        border-radius: 0;
        animation: particleDrift ${6 + Math.random() * 8}s linear ${Math.random() * -8}s infinite;
      `;
    } else {
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 30}%;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        opacity: ${0.2 + Math.random() * 0.5};
        animation: particleDrift ${8 + Math.random() * 12}s linear ${Math.random() * -12}s infinite;
      `;
    }
    container.appendChild(el);
  }
})();


// ============================================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================================
(function initScrollReveal() {
  const selectors = '.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-zoom';
  const elements  = document.querySelectorAll(selectors);

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = parseInt(el.dataset.delay ?? '0', 10);

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  // Skip hero elements (animated by loader)
  elements.forEach(el => {
    if (!el.closest('.hero')) observer.observe(el);
  });
})();


// ============================================================
// POEMA: staggered line animation
// ============================================================
(function initPoema() {
  const lines = document.querySelectorAll('.poema-line');
  if (!lines.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        lines.forEach(line => {
          const delay = parseInt(line.dataset.delay ?? '0', 10);
          setTimeout(() => line.classList.add('visible'), delay);
        });
        observer.disconnect();
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(document.querySelector('.poema-card') ?? lines[0]);
})();


// ============================================================
// DISCOVERY ITEMS: stagger on scroll
// ============================================================
(function initDiscoveries() {
  const items = document.querySelectorAll('.discovery-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item  = entry.target;
        const delay = parseInt(item.dataset.delay ?? '0', 10);
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, delay);
        observer.unobserve(item);
      });
    },
    { threshold: 0.2 }
  );

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(30px)';
    item.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(item);
  });
})();


// ============================================================
// PARALLAX: subtle parallax on hero painting
// ============================================================
(function initParallax() {
  const painting = document.querySelector('.hero-painting');
  if (!painting) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.3;
    painting.style.transform = `translateY(${y}px)`;
  }, { passive: true });
})();


// ============================================================
// SMOOTH SECTION TRANSITIONS (progress tint)
// ============================================================
(function initSectionProgress() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach(s => observer.observe(s));
})();


// ============================================================
// TILT EFFECT: artista card on hover
// ============================================================
(function initTilt() {
  const cards = document.querySelectorAll('.viola-card, .barretos-card, .aprendizado-item');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotX   = ((y - centerY) / centerY) * -6;
      const rotY   = ((x - centerX) / centerX) *  6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


// ============================================================
// COUNTER ANIMATION: aprendizado numbers
// ============================================================
(function initCounters() {
  const numbers = document.querySelectorAll('.aprendizado-number');
  if (!numbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.textContent, 10);
        let  current = 0;
        const step   = () => {
          current++;
          el.textContent = String(current).padStart(2, '0');
          if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach(n => observer.observe(n));
})();


// ============================================================
// IMAGE LIGHTBOX (simple)
// ============================================================
(function initLightbox() {
  const images = document.querySelectorAll(
    '.obra-img, .viola-gallery-img, .timeline-img'
  );
  if (!images.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <div class="lightbox-content">
      <img class="lightbox-img" src="" alt="" />
      <button class="lightbox-close" aria-label="Fechar">✕</button>
    </div>
  `;
  Object.assign(overlay.style, {
    position:       'fixed',
    inset:          '0',
    zIndex:         '9000',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    opacity:        '0',
    visibility:     'hidden',
    transition:     'opacity .4s ease, visibility .4s ease',
  });

  const backdrop = overlay.querySelector('.lightbox-backdrop');
  Object.assign(backdrop.style, {
    position:   'absolute',
    inset:      '0',
    background: 'rgba(15,5,0,.92)',
    backdropFilter: 'blur(8px)',
  });

  const content = overlay.querySelector('.lightbox-content');
  Object.assign(content.style, {
    position:          'relative',
    maxWidth:          'min(90vw, 900px)',
    maxHeight:         '85vh',
    borderRadius:      '16px',
    overflow:          'hidden',
    transform:         'scale(.9)',
    transition:        'transform .4s ease',
    boxShadow:         '0 32px 80px rgba(0,0,0,.6)',
  });

  const img = overlay.querySelector('.lightbox-img');
  Object.assign(img.style, {
    width:       '100%',
    height:      '100%',
    maxHeight:   '85vh',
    objectFit:   'contain',
    display:     'block',
  });

  const closeBtn = overlay.querySelector('.lightbox-close');
  Object.assign(closeBtn.style, {
    position:   'absolute',
    top:        '12px',
    right:      '12px',
    width:      '36px',
    height:     '36px',
    background: 'rgba(255,255,255,.15)',
    border:     'none',
    borderRadius:'50%',
    color:      '#fff',
    fontSize:   '1rem',
    cursor:     'pointer',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background .2s ease',
    zIndex:     '1',
  });

  document.body.appendChild(overlay);

  const open  = (src, alt) => {
    img.src = src; img.alt = alt;
    overlay.style.opacity    = '1';
    overlay.style.visibility = 'visible';
    content.style.transform  = 'scale(1)';
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    overlay.style.opacity    = '0';
    overlay.style.visibility = 'hidden';
    content.style.transform  = 'scale(.9)';
    document.body.style.overflow = '';
    setTimeout(() => { img.src = ''; }, 400);
  };

  images.forEach(image => {
    image.style.cursor = 'zoom-in';
    image.addEventListener('click', () => open(image.src, image.alt));
  });

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();
