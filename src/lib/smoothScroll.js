/**
 * ─────────────────────────────────────────────────────────────
 *  SMOOTH SCROLL ENGINE
 * ─────────────────────────────────────────────────────────────
 *  Lenis-powered inertial scrolling (the "buttery" feel used on
 *  getartcraft.com) plus one shared per-frame scroll loop that the
 *  ruler, parallax layers and anything else can subscribe to.
 *
 *  Lenis scrolls the real document, so `position: fixed/sticky`,
 *  `window.scrollY` and IntersectionObserver keep working as usual.
 *  When the user prefers reduced motion, Lenis is never created and
 *  every helper here falls back to native scrolling.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/* Tuning */
const LERP = 0.12; // wheel smoothing — lower = floatier, higher = snappier
const JUMP_MIN = 0.45; // s — shortest programmatic jump
const JUMP_MAX = 1.25; // s — longest programmatic jump (long hops scale up to this)

let lenis = null;
const subscribers = new Set();
const state = { y: 0, max: 0, velocity: 0 };
let lastY = 0;
let rafId = 0;
let idleFrames = 0;

const clamp = (min, v, max) => Math.min(max, Math.max(min, v));
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const getMax = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

function emit() {
  subscribers.forEach((fn) => fn(state));
}

/* Runs only while the page is moving, then parks itself. */
function frame() {
  const y = window.scrollY;
  const delta = y - lastY;
  lastY = y;

  // Smoothed velocity in px/frame — decays naturally once scrolling stops.
  state.velocity += (delta - state.velocity) * 0.3;
  state.y = y;
  state.max = getMax();

  idleFrames = Math.abs(delta) < 0.05 && Math.abs(state.velocity) < 0.05 ? idleFrames + 1 : 0;

  if (idleFrames > 8) {
    state.velocity = 0;
    emit();
    rafId = 0;
    return;
  }

  emit();
  rafId = requestAnimationFrame(frame);
}

export function wakeScrollLoop() {
  if (!rafId) {
    idleFrames = 0;
    rafId = requestAnimationFrame(frame);
  }
}

/** Create Lenis (unless disabled) and start listening for scroll/resize. Runs once. */
export function initSmoothScroll({ smooth = true } = {}) {
  if (smooth && !lenis) {
    lenis = new Lenis({
      lerp: LERP,
      smoothWheel: true,
      autoRaf: true,
    });
  }

  window.addEventListener('scroll', wakeScrollLoop, { passive: true });
  window.addEventListener('resize', wakeScrollLoop, { passive: true });

  lastY = state.y = window.scrollY;
  state.max = getMax();
  return lenis;
}

export const getLenis = () => lenis;

/** Fresh snapshot of the scroll state (for one-off reads outside the loop). */
export function getScrollState() {
  return { y: window.scrollY, max: getMax(), velocity: state.velocity };
}

/**
 * Subscribe to per-frame scroll updates. The callback fires immediately
 * once, then every animation frame while the page is moving.
 * @returns {() => void} unsubscribe
 */
export function onScrollFrame(fn) {
  subscribers.add(fn);
  fn(getScrollState());
  return () => subscribers.delete(fn);
}

function resolveY(target) {
  if (typeof target === 'number') return target;
  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
  if (!el) return null;
  // Honour `scroll-margin-top` so sections still land below the sticky nav.
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return el.getBoundingClientRect().top + window.scrollY - margin;
}

/**
 * Scroll to a y-position, element, or element id.
 * @param {number|string|Element} target
 * @param {object}  [o]
 * @param {boolean} [o.immediate]  Jump without animating
 * @param {number}  [o.lerp]       Chase the target (used for drag-scrubbing)
 * @param {number}  [o.duration]   Override the auto-scaled jump duration (s)
 */
export function scrollToTarget(target, { immediate = false, lerp, duration } = {}) {
  let y = resolveY(target);
  if (y == null) return false;
  y = clamp(0, y, getMax());

  if (lenis) {
    lenis.resize(); // the DOM may have just changed (route swap)
    if (immediate) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else if (lerp) {
      lenis.scrollTo(y, { lerp, force: true });
    } else {
      const dist = Math.abs(y - window.scrollY);
      const auto = clamp(JUMP_MIN, 0.35 + (dist / window.innerHeight) * 0.18, JUMP_MAX);
      lenis.scrollTo(y, { duration: duration ?? auto, easing: easeOutExpo, force: true });
    }
  } else {
    // 'auto' respects the CSS scroll-behavior (smooth unless reduced motion).
    window.scrollTo({ top: y, behavior: immediate || lerp ? 'instant' : 'auto' });
  }

  wakeScrollLoop();
  return true;
}

/** Relative scroll that accumulates nicely on repeated key presses. */
export function scrollByAmount(delta) {
  const base = lenis ? lenis.targetScroll : window.scrollY;
  return scrollToTarget(base + delta, { duration: 0.6 });
}
