/**
 * ─────────────────────────────────────────────────────────────
 *  TECHNICAL RULER-STYLE SCROLL PROGRESS INDICATOR
 * ─────────────────────────────────────────────────────────────
 *  Minimalist vertical measuring instrument fixed to the right
 *  edge of the viewport, featuring evenly spaced horizontal tick marks,
 *  numbered scroll-position markers, and a small technical blue
 *  percentage indicator that updates in real time.
 *
 *  Upgrades (inspired by getartcraft.com's scroll rail):
 *   • Driven by the shared Lenis loop — jumps & drags glide.
 *   • Velocity-reactive ticks stretch near the needle on fast scrolls.
 *   • Hover "ghost" line previews where a click will land.
 *   • Drag-scrub lerps the page after the cursor instead of snapping.
 *   • Ticks draw in top-down on page load (CSS, see main.css).
 */
import {
  onScrollFrame,
  getScrollState,
  scrollToTarget,
  scrollByAmount,
  wakeScrollLoop,
} from '../lib/smoothScroll.js';

/* Tuning */
const VEL_RADIUS = 90; // track px around the needle whose ticks react to scroll speed
const VEL_STRETCH = 1.4; // extra tick length at full speed (1.4 → up to 2.4× long)
const VEL_FULL = 32; // px/frame treated as "full speed"
const DRAG_LERP = 0.18; // how tightly the page chases the cursor while dragging

const clamp = (min, v, max) => Math.min(max, Math.max(min, v));

export function RulerScrollbar() {
  // Generate evenly spaced horizontal tick marks from 0% to 100% at 2.5% intervals
  const ticks = [];
  let index = 0;
  for (let i = 0; i <= 100; i += 2.5) {
    const isMajor = i % 10 === 0;
    const isMedium = !isMajor && i % 5 === 0;

    let type = 'ruler-tick-minor';
    let label = '';

    if (isMajor) {
      type = 'ruler-tick-major';
      label = i === 100 ? '100' : String(i).padStart(2, '0');
    } else if (isMedium) {
      type = 'ruler-tick-medium';
    }

    // Ticks are inset by half the thumb height so the needle lands exactly on 0 and 100.
    ticks.push(`
      <div class="ruler-tick ${type}" style="top: calc(var(--ruler-pad) + (100% - 2 * var(--ruler-pad)) * ${i / 100}); --i: ${index};" data-tick-pct="${i}" aria-hidden="true">
        <span class="ruler-tick-line"></span>
        ${label ? `<span class="ruler-tick-text">${label}</span>` : ''}
      </div>`);
    index++;
  }

  return `
    <aside id="ruler-scrollbar" class="ruler-scrollbar" aria-label="Technical scroll progress ruler" role="region">
      <!-- Top Instrument Calibration / Return to Top -->
      <button type="button" class="ruler-nav-btn ruler-nav-top" data-ruler-top title="Return to 00% (Top)" aria-label="Scroll to top">
        <span class="ruler-btn-pip" aria-hidden="true"></span>
        <span class="ruler-btn-num">00</span>
        <span class="ruler-btn-tag">Y-AXIS</span>
      </button>

      <!-- Minimalist Vertical Track with Measuring Scale -->
      <div id="ruler-track" class="ruler-track" role="slider" tabindex="0"
           aria-label="Scroll progress position" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="ruler-ticks" aria-hidden="true">
          ${ticks.join('')}
        </div>

        <!-- Hover ghost: previews where a click will jump to -->
        <div id="ruler-ghost" class="ruler-ghost" aria-hidden="true">
          <span class="ruler-ghost-line"></span>
          <span id="ruler-ghost-pct" class="ruler-ghost-pct">00%</span>
        </div>

        <!-- Small Blue Percentage Indicator with Technical Needle -->
        <div id="ruler-thumb" class="ruler-thumb" aria-hidden="true">
          <span class="ruler-needle"></span>
          <span id="ruler-pct" class="ruler-pct">00%</span>
        </div>
      </div>

      <!-- Bottom Instrument Calibration / Jump to End -->
      <button type="button" class="ruler-nav-btn ruler-nav-bottom" data-ruler-bottom title="Jump to 100% (End)" aria-label="Scroll to end">
        <span class="ruler-btn-pip" aria-hidden="true"></span>
        <span class="ruler-btn-num">100</span>
        <span class="ruler-btn-tag">END</span>
      </button>
    </aside>`;
}

export function initRulerScrollbar() {
  const ruler = document.getElementById('ruler-scrollbar');
  const track = document.getElementById('ruler-track');
  const thumb = document.getElementById('ruler-thumb');
  const pct = document.getElementById('ruler-pct');
  const ghost = document.getElementById('ruler-ghost');
  const ghostPct = document.getElementById('ruler-ghost-pct');
  const progressBar = document.getElementById('scroll-progress');
  const btnTop = document.querySelector('[data-ruler-top]');
  const btnBottom = document.querySelector('[data-ruler-bottom]');

  if (!ruler || !track || !thumb || !pct) return;

  const ticks = [...track.querySelectorAll('.ruler-tick')].map((el) => ({
    el,
    line: el.querySelector('.ruler-tick-line'),
    pct: parseFloat(el.dataset.tickPct),
    major: el.classList.contains('ruler-tick-major'),
    scale: 1,
  }));

  // Cached geometry (refreshed by ResizeObserver, never read per frame)
  let trackH = track.clientHeight;
  let thumbH = thumb.offsetHeight || 24;
  const available = () => Math.max(0, trackH - thumbH);
  const measure = () => {
    trackH = track.clientHeight;
    thumbH = thumb.offsetHeight || 24;
  };

  let isDragging = false;
  let grabOffset = 0;
  let activeMajor = -1;
  let lastPct = -1;

  const update = (state = getScrollState()) => {
    const { y, max, velocity } = state;
    const progress = max > 0 ? clamp(0, y / max, 1) : 0;
    const pctVal = Math.round(progress * 100);
    const thumbY = progress * available();

    thumb.style.transform = `translate3d(0, ${thumbY.toFixed(2)}px, 0)`;

    if (pctVal !== lastPct) {
      pct.textContent = `${pctVal}%`;
      track.setAttribute('aria-valuenow', String(pctVal));
      lastPct = pctVal;
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // Technical indicator: illuminate the nearest major calibration marker
    const nearestMajor = Math.round(progress * 10) * 10;
    if (nearestMajor !== activeMajor) {
      ticks.forEach((t) => t.major && t.el.classList.toggle('is-active-tick', t.pct === nearestMajor));
      activeMajor = nearestMajor;
    }

    // Velocity-reactive ticks: the faster you scroll, the longer the ticks around the needle
    const intensity = Math.min(1, Math.abs(velocity) / VEL_FULL);
    const needleY = thumbY + thumbH / 2;
    for (const t of ticks) {
      let s = 1;
      if (intensity > 0.002) {
        const d = Math.abs(thumbH / 2 + (t.pct / 100) * available() - needleY);
        if (d < VEL_RADIUS) {
          const f = 1 - d / VEL_RADIUS;
          s = 1 + VEL_STRETCH * intensity * f * f;
        }
      }
      if (Math.abs(s - t.scale) > 0.004) {
        t.scale = s;
        t.line.style.setProperty('--vs', s.toFixed(3));
      }
    }
  };

  onScrollFrame(update);

  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      measure();
      update();
    }).observe(track);
    // Page height changes (route swaps, lazy content) → recompute progress
    new ResizeObserver(wakeScrollLoop).observe(document.body);
  }

  /* ── Pointer helpers ───────────────────────────────────── */
  const pointerRatio = (clientY, offset = 0) => {
    const rect = track.getBoundingClientRect();
    const avail = rect.height - thumbH;
    if (avail <= 0) return 0;
    return clamp(0, (clientY - rect.top - thumbH / 2 - offset) / avail, 1);
  };

  const scrollToRatio = (ratio, mode = 'jump') => {
    const { max } = getScrollState();
    const y = ratio * max;
    if (mode === 'drag') scrollToTarget(y, { lerp: DRAG_LERP });
    else scrollToTarget(y);
  };

  const showGhost = (clientY) => {
    if (!ghost) return;
    const ratio = pointerRatio(clientY);
    ghost.style.transform = `translate3d(0, ${(thumbH / 2 + ratio * available()).toFixed(1)}px, 0)`;
    if (ghostPct) ghostPct.textContent = `${Math.round(ratio * 100)}%`;
    ruler.classList.add('is-hovering');
  };

  // Top/bottom calibration jump buttons
  btnTop?.addEventListener('click', () => scrollToTarget(0));
  btnBottom?.addEventListener('click', () => scrollToTarget(getScrollState().max));

  // Track click (glide) & drag (lerp-chase) interactions
  track.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    track.setPointerCapture(e.pointerId);
    ruler.classList.add('is-dragging');
    thumb.classList.add('is-dragging');

    if (thumb.contains(e.target)) {
      // Grabbed the thumb: keep the cursor's offset so it doesn't jump
      const tr = thumb.getBoundingClientRect();
      grabOffset = e.clientY - (tr.top + tr.height / 2);
    } else {
      grabOffset = 0;
      scrollToRatio(pointerRatio(e.clientY), 'jump');
    }
  });

  track.addEventListener('pointermove', (e) => {
    if (isDragging) {
      scrollToRatio(pointerRatio(e.clientY, grabOffset), 'drag');
      return;
    }
    if (e.pointerType === 'mouse') showGhost(e.clientY);
  });

  track.addEventListener('pointerleave', () => {
    if (!isDragging) ruler.classList.remove('is-hovering');
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    ruler.classList.remove('is-dragging');
    thumb.classList.remove('is-dragging');
    try {
      track.releasePointerCapture(e.pointerId);
    } catch (_) {}
    if (e.pointerType === 'mouse' && track.matches(':hover')) showGhost(e.clientY);
    else ruler.classList.remove('is-hovering');
  };

  track.addEventListener('pointerup', stopDrag);
  track.addEventListener('pointercancel', stopDrag);

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    const step = 90;
    const page = window.innerHeight * 0.8;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        scrollByAmount(-step);
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        scrollByAmount(step);
        break;
      case 'PageUp':
        e.preventDefault();
        scrollByAmount(-page);
        break;
      case 'PageDown':
        e.preventDefault();
        scrollByAmount(page);
        break;
      case 'Home':
        e.preventDefault();
        scrollToTarget(0);
        break;
      case 'End':
        e.preventDefault();
        scrollToTarget(getScrollState().max);
        break;
    }
  });

  // Initial calculation
  update();

  return () => update();
}
