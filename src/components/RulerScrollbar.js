/**
 * ─────────────────────────────────────────────────────────────
 *  TECHNICAL RULER-STYLE SCROLL PROGRESS INDICATOR
 * ─────────────────────────────────────────────────────────────
 *  Minimalist vertical measuring instrument fixed to the right
 *  edge of the viewport, featuring evenly spaced horizontal tick marks,
 *  numbered scroll-position markers, and a small technical blue
 *  percentage indicator that updates in real time.
 */

export function RulerScrollbar() {
  // Generate evenly spaced horizontal tick marks from 0% to 100% at 2.5% intervals
  const ticks = [];
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

    ticks.push(`
      <div class="ruler-tick ${type}" style="top: ${i}%;" data-tick-pct="${i}" aria-hidden="true">
        <span class="ruler-tick-line"></span>
        ${label ? `<span class="ruler-tick-text">${label}</span>` : ''}
      </div>`);
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
  const progressBar = document.getElementById('scroll-progress');
  const btnTop = document.querySelector('[data-ruler-top]');
  const btnBottom = document.querySelector('[data-ruler-bottom]');

  if (!ruler || !track || !thumb || !pct) return;

  const majorTicks = track.querySelectorAll('.ruler-tick-major');
  let isDragging = false;
  let ticking = false;

  const update = () => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = docHeight - winHeight;

    const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    const pctVal = Math.round(progress * 100);

    const trackHeight = track.clientHeight;
    const thumbHeight = thumb.clientHeight || 24;
    const available = Math.max(0, trackHeight - thumbHeight);
    const thumbY = progress * available;

    thumb.style.transform = `translate3d(0, ${thumbY}px, 0)`;
    pct.textContent = `${pctVal}%`;
    track.setAttribute('aria-valuenow', String(pctVal));

    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }

    // Technical indicator: illuminate the nearest major calibration marker in subtle blue
    const nearestMajor = Math.round(progress * 10) * 10;
    majorTicks.forEach((tick) => {
      const tickVal = parseInt(tick.dataset.tickPct, 10);
      if (tickVal === nearestMajor) {
        tick.classList.add('is-active-tick');
      } else {
        tick.classList.remove('is-active-tick');
      }
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Update immediately when route changes or DOM height changes
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    ro.observe(document.body);
  }

  const scrollToRatio = (ratio, smooth = true) => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const maxScroll = Math.max(0, docHeight - winHeight);
    const clamped = Math.min(1, Math.max(0, ratio));
    window.scrollTo({
      top: clamped * maxScroll,
      behavior: smooth ? 'smooth' : 'instant',
    });
  };

  // Top/bottom calibration jump buttons
  btnTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btnBottom?.addEventListener('click', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max, behavior: 'smooth' });
  });

  // Track click & scrub interactions
  const handlePointerScrub = (e, smooth = false) => {
    const rect = track.getBoundingClientRect();
    const thumbHeight = thumb.clientHeight || 24;
    const available = rect.height - thumbHeight;
    if (available <= 0) return;

    const clickY = e.clientY - rect.top - thumbHeight / 2;
    const ratio = clickY / available;
    scrollToRatio(ratio, smooth);
  };

  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    thumb.classList.add('is-dragging');
    track.setPointerCapture(e.pointerId);
    handlePointerScrub(e, false);
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    handlePointerScrub(e, false);
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    thumb.classList.remove('is-dragging');
    try {
      track.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  track.addEventListener('pointerup', stopDrag);
  track.addEventListener('pointercancel', stopDrag);

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    const step = 90;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        window.scrollBy({ top: -step, behavior: 'smooth' });
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        window.scrollBy({ top: step, behavior: 'smooth' });
        break;
      case 'PageUp':
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        break;
      case 'PageDown':
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        break;
      case 'Home':
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'End':
        e.preventDefault();
        window.scrollTo({ top: max, behavior: 'smooth' });
        break;
    }
  });

  // Initial calculation
  update();

  return update;
}
