/**
 * ─────────────────────────────────────────────────────────────
 *  SCROLL-LINKED PARALLAX
 * ─────────────────────────────────────────────────────────────
 *  Driven by the shared smooth-scroll loop (no extra listeners).
 *
 *  data-parallax="0.18"   Element drifts at 18% of scroll speed
 *                         (lags behind → feels deeper). Negative
 *                         values move against the scroll.
 *  data-parallax-fade     Also fades + blurs as it scrolls away.
 *  data-parallax-media    On a `.frame`: the image inside drifts
 *                         within its (slightly zoomed) crop.
 */
import { onScrollFrame } from './smoothScroll.js';

const MEDIA_RANGE = 0.05; // fraction of frame height an image may drift (stays inside the 1.12 zoom crop)
const FADE_BLUR = 8; // px of blur once a fading layer has fully scrolled away
const FADE_MIN = 0.25; // opacity floor for fading layers

let layers = [];
let media = [];
let unsubscribe = null;
let ro = null;
let measureQueued = false;

const clamp = (min, v, max) => Math.min(max, Math.max(min, v));

function measure() {
  measureQueued = false;
  const y = window.scrollY;
  const vh = window.innerHeight;

  layers.forEach((l) => {
    l.el.style.transform = '';
    const r = l.el.getBoundingClientRect();
    l.top = r.top + y;
    l.height = r.height;
    // Scroll position where the layer is "at rest" (centred, or page top for hero content).
    l.anchor = Math.max(0, l.top + l.height / 2 - vh / 2);
    l.lastTf = '';
  });

  media.forEach((m) => {
    const r = m.el.getBoundingClientRect();
    m.top = r.top + y;
    m.height = r.height;
    m.last = '';
  });
}

function queueMeasure() {
  if (measureQueued) return;
  measureQueued = true;
  requestAnimationFrame(() => {
    measure();
    render({ y: window.scrollY });
  });
}

function render({ y }) {
  const vh = window.innerHeight;

  for (const l of layers) {
    if (l.top > y + vh * 1.2 || l.top + l.height < y - vh * 0.6) continue;
    const progress = y - l.anchor;

    const tf = `translate3d(0, ${(progress * l.speed).toFixed(1)}px, 0)`;
    if (tf !== l.lastTf) {
      l.el.style.transform = tf;
      l.lastTf = tf;
    }

    if (l.fade) {
      const fadeStart = Math.max(0, l.top - 80);
      const fadeDist = Math.max(160, l.height);
      const p = clamp(0, (y - fadeStart) / fadeDist, 1);
      l.el.style.opacity = p > 0.001 ? (1 - p * (1 - FADE_MIN)).toFixed(3) : '';
      l.el.style.filter = p > 0.001 ? `blur(${(p * FADE_BLUR).toFixed(2)}px)` : '';
    }
  }

  for (const m of media) {
    if (m.top > y + vh || m.top + m.height < y) continue;
    const offset = m.top + m.height / 2 - (y + vh / 2);
    const n = clamp(-1, offset / (vh / 2 + m.height / 2), 1);
    const py = `${(-n * m.height * MEDIA_RANGE).toFixed(1)}px`;
    if (py !== m.last) {
      m.el.style.setProperty('--py', py);
      m.last = py;
    }
  }
}

export function destroyParallax() {
  unsubscribe?.();
  unsubscribe = null;
  ro?.disconnect();
  window.removeEventListener('resize', queueMeasure);
  layers.forEach(({ el }) => {
    el.style.transform = '';
    el.style.opacity = '';
    el.style.filter = '';
  });
  media.forEach(({ el }) => el.style.removeProperty('--py'));
  layers = [];
  media = [];
}

/** (Re)bind parallax for everything inside `root`. Call after each route render. */
export function initParallax(root, { enabled = true } = {}) {
  destroyParallax();
  if (!enabled || !root) return;

  layers = [...root.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    fade: el.hasAttribute('data-parallax-fade'),
  }));
  media = [...root.querySelectorAll('[data-parallax-media]')].map((el) => ({ el }));
  if (!layers.length && !media.length) return;

  measure();
  unsubscribe = onScrollFrame(render);

  window.addEventListener('resize', queueMeasure, { passive: true });
  document.fonts?.ready.then(queueMeasure);
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(queueMeasure);
    ro.observe(root);
  }
}
