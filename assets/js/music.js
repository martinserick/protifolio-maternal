/* ============================================================
   music.js — Música ambiente com autoplay
   O Violeiro Portfolio
   ============================================================ */

'use strict';

(function initBackgroundMusic() {
  const audio = document.getElementById('bgAudio');
  const btn   = document.getElementById('musicToggle');
  if (!audio || !btn) return;

  const AMBIENT_VOLUME = 0.18;
  const FADE_STEPS     = 50;
  const FADE_INTERVAL  = 40; // ms

  let isPlaying = false;
  let fadeTimer = null;

  // ── Ondas de áudio no botão ──────────────────────────────
  const wavesEl = document.createElement('span');
  wavesEl.className = 'music-waves';
  wavesEl.innerHTML =
    '<span class="music-wave-bar"></span>'.repeat(5);
  btn.querySelector('.music-icon').insertAdjacentElement('afterend', wavesEl);

  audio.volume = 0;
  audio.loop   = true;

  // ── Fade in ──────────────────────────────────────────────
  function fadeIn() {
    clearInterval(fadeTimer);
    let step = 0;
    fadeTimer = setInterval(() => {
      step++;
      audio.volume = Math.min(AMBIENT_VOLUME, (step / FADE_STEPS) * AMBIENT_VOLUME);
      if (step >= FADE_STEPS) clearInterval(fadeTimer);
    }, FADE_INTERVAL);
  }

  // ── Fade out ─────────────────────────────────────────────
  function fadeOut(onDone) {
    clearInterval(fadeTimer);
    const startVol = audio.volume;
    let step = 0;
    fadeTimer = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol - (step / FADE_STEPS) * startVol);
      if (step >= FADE_STEPS) {
        clearInterval(fadeTimer);
        audio.pause();
        audio.volume = 0;
        if (onDone) onDone();
      }
    }, FADE_INTERVAL);
  }

  // ── Estado do botão ──────────────────────────────────────
  function setPlayingState(playing) {
    isPlaying = playing;
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
    const labelEl = btn.querySelector('.music-label');
    if (labelEl) labelEl.textContent = playing ? 'Pausar' : 'Música';
  }

  // ── Iniciar música ───────────────────────────────────────
  function startMusic() {
    audio.play()
      .then(() => {
        setPlayingState(true);
        fadeIn();
      })
      .catch(() => { /* Silencioso */ });
  }

  // ── Botão manual ─────────────────────────────────────────
  btn.addEventListener('click', () => {
    if (isPlaying) {
      fadeOut(() => setPlayingState(false));
    } else {
      startMusic();
    }
  });

  // ── Overlay de boas-vindas ───────────────────────────────
  // Mostrado apenas se o autoplay for bloqueado pelo navegador.
  // Assim a música SEMPRE começa ao abrir o site.
  function buildWelcomeOverlay() {
    const ov = document.createElement('div');
    ov.id = 'soundOverlay';
    ov.innerHTML = `
      <div class="sound-overlay-inner">
        <div class="sound-overlay-notes">
          <span>♪</span><span>♫</span><span>♪</span>
        </div>
        <h2>O Violeiro</h2>
        <p>CEI Pequeno Einstein · Turma Maternal</p>
        <button class="sound-overlay-btn" id="soundOverlayBtn">
          <span class="sound-btn-icon">🎵</span>
          Entrar no Portfólio
        </button>
        <span class="sound-overlay-hint">Com música ambiente</span>
      </div>
    `;
    document.body.appendChild(ov);

    document.getElementById('soundOverlayBtn').addEventListener('click', () => {
      // Fecha overlay com animação
      ov.classList.add('hiding');
      setTimeout(() => ov.remove(), 600);
      startMusic();
    });

    return ov;
  }

  // ── Estratégia de autoplay ───────────────────────────────
  // 1. Aguarda o loader sumir, depois tenta autoplay direto.
  // 2. Se o navegador bloquear → mostra o overlay.
  function attemptAutoplay() {
    audio.play()
      .then(() => {
        // Autoplay liberado (ex.: Chrome com configuração permissiva)
        setPlayingState(true);
        fadeIn();
      })
      .catch(() => {
        // Bloqueado pelo navegador → mostra overlay elegante
        buildWelcomeOverlay();
      });
  }

  // Espera o loader fechar antes de tentar (evita conflito de UX)
  const loader = document.getElementById('loader');
  if (loader) {
    // Observa quando a classe 'hidden' for adicionada ao loader
    const mo = new MutationObserver(() => {
      if (loader.classList.contains('hidden')) {
        mo.disconnect();
        setTimeout(attemptAutoplay, 400);
      }
    });
    mo.observe(loader, { attributes: true, attributeFilter: ['class'] });
  } else {
    // Sem loader — tenta direto após carregamento
    window.addEventListener('load', () => setTimeout(attemptAutoplay, 300));
  }

  // ── Reduz volume em aba inativa ──────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (!isPlaying) return;
    if (document.hidden) {
      clearInterval(fadeTimer);
      audio.volume = AMBIENT_VOLUME * 0.3;
    } else {
      fadeIn();
    }
  });
})();
