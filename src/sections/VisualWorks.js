import { visualWorks, visualCategories } from '../data/visualWorks.js';
import { SectionHeader } from '../components/SectionHeader.js';
import { Media } from '../components/Media.js';
import { esc } from '../lib/utils.js';

// Helper to get normalized array of images for an item
function getItemImages(w) {
  if (Array.isArray(w.images) && w.images.length) return w.images;
  if (w.image) return [w.image];
  return [];
}

export function VisualWorks() {
  const filterButtons = visualCategories
    .map(
      (cat, i) => `
        <button type="button"
                data-work-filter="${esc(cat)}"
                class="work-filter-btn label px-4 py-2 border-r border-ink last:border-r-0 hover:bg-acid transition-colors ${
                  i === 0 ? 'bg-ink text-paper hover:text-ink' : 'bg-transparent text-ink'
                }"
                aria-pressed="${i === 0 ? 'true' : 'false'}">
          ${esc(cat)}
        </button>`
    )
    .join('');

  const cards = visualWorks
    .map((w, index) => {
      const images = getItemImages(w);
      const isSeries = images.length > 1;
      const total = images.length || 1;

      // For infinite looping on the card: prepend last item & append first item
      const cardSlideList = isSeries
        ? [images[total - 1], ...images, images[0]]
        : images.length
        ? images
        : [null];

      return `
        <article class="work-item group flex flex-col border border-ink bg-paper transition-shadow hover:shadow-[4px_4px_0_var(--color-ink)]"
                 data-category="${esc(w.category)}"
                 data-work-id="${esc(w.id)}"
                 data-current-slide="0"
                 data-track-pos="${isSeries ? '1' : '0'}"
                 data-total-slides="${total}">
          <!-- Top metadata strip -->
          <div class="flex items-center justify-between border-b border-ink px-3 py-2 label bg-surface/50">
            <div class="flex items-center gap-2">
              <span class="font-medium">PST—${esc(w.id)}</span>
              <span class="bg-ink px-1.5 py-0.5 text-paper text-[0.65rem]">${esc(w.category)}</span>
            </div>
            ${
              isSeries
                ? `<span class="bg-acid px-1.5 py-0.5 text-ink font-bold text-[0.65rem]">SERIES · ${total} POSTERS</span>`
                : `<span class="text-mute">${esc(w.year)}</span>`
            }
          </div>

          <!-- Clickable poster frame + infinite sliding track -->
          <div class="relative overflow-hidden bg-surface group/frame">
            <button type="button"
                    class="work-trigger block w-full text-left cursor-zoom-in relative overflow-hidden"
                    data-open-lightbox="${esc(w.id)}"
                    aria-label="View ${esc(w.title)} poster full screen">
              <!-- Sliding track for posters -->
              <div class="card-slider-viewport overflow-hidden w-full relative">
                <div class="card-slider-track flex w-full will-change-transform ${
                  isSeries ? 'transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]' : ''
                }"
                     data-slider-track="${esc(w.id)}"
                     style="transform: translateX(${isSeries ? '-100%' : '0%'});">
                  ${cardSlideList
                    .map((imgSrc, slideIdx) => {
                      const realNumber = isSeries
                        ? slideIdx === 0
                          ? total
                          : slideIdx === total + 1
                          ? 1
                          : slideIdx
                        : 1;

                      return `
                    <div class="w-full shrink-0 select-none">
                      ${Media({
                        image: imgSrc ? { src: imgSrc, alt: `${w.title} - Slide ${realNumber}` } : null,
                        ratio: w.ratio || '3/4',
                        variant: realNumber % 2 === 0 ? 'grid' : 'hatch',
                        label: imgSrc
                          ? `${w.title} [${realNumber}/${total}]`
                          : isSeries
                          ? `Poster ${realNumber} of ${total}`
                          : 'Poster slot',
                        mark: `0${realNumber}`,
                        hint: isSeries
                          ? `public/works/nike/poster-0${realNumber}.jpg`
                          : `public/works/poster-${w.id}.jpg`,
                        lazy: false,
                        reveal: false,
                      })}
                    </div>`;
                    })
                    .join('')}
                </div>
              </div>

              <!-- Hover overlay prompt -->
              <div class="absolute inset-0 bg-ink/15 opacity-0 group-hover/frame:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <span class="btn btn-primary text-xs pointer-events-none py-1.5 px-3">
                  ${isSeries ? `View All ${total} Posters ⧉` : `Expand View ⧉`}
                </span>
              </div>
            </button>

            ${
              isSeries
                ? `
              <!-- On-card Slide Counter Badge -->
              <div class="absolute top-2.5 right-2.5 z-20 pointer-events-none">
                <span class="label bg-ink/90 text-paper px-2 py-1 text-[0.7rem] border border-ink font-mono" data-card-counter="${esc(w.id)}">
                  01 / ${String(total).padStart(2, '0')}
                </span>
              </div>

              <!-- Infinite Quick Slide Arrows on Card -->
              <div class="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20 opacity-0 group-hover/frame:opacity-100 transition-opacity">
                <button type="button"
                        class="card-nav-prev pointer-events-auto size-9 bg-paper/95 text-ink hover:bg-acid active:scale-95 border border-ink flex items-center justify-center font-bold text-lg shadow-[2px_2px_0_var(--color-ink)] transition-transform cursor-pointer"
                        data-card-prev="${esc(w.id)}"
                        aria-label="Previous slide in series">
                  ‹
                </button>
                <button type="button"
                        class="card-nav-next pointer-events-auto size-9 bg-paper/95 text-ink hover:bg-acid active:scale-95 border border-ink flex items-center justify-center font-bold text-lg shadow-[2px_2px_0_var(--color-ink)] transition-transform cursor-pointer"
                        data-card-next="${esc(w.id)}"
                        aria-label="Next slide in series">
                  ›
                </button>
              </div>

              <!-- Segmented slide indicators at bottom of frame -->
              <div class="absolute bottom-2 inset-x-4 flex gap-1 z-20 pointer-events-none" data-card-dots="${esc(w.id)}">
                ${images
                  .map(
                    (_, di) => `
                  <span class="h-1 flex-1 border border-ink/40 transition-all ${
                    di === 0 ? 'bg-acid border-ink' : 'bg-paper/70'
                  }" data-dot-idx="${di}"></span>`
                  )
                  .join('')}
              </div>`
                : ''
            }
          </div>

          <!-- Bottom description strip -->
          <div class="flex flex-col gap-2 p-4 border-t border-ink mt-auto">
            <div class="flex items-baseline justify-between gap-2">
              <h3 class="font-display text-xl font-bold tracking-[-0.02em] group-hover:underline">
                ${esc(w.title)}
              </h3>
              <span class="label text-mute text-[0.7rem] shrink-0">${esc(w.ratio)}</span>
            </div>
            <p class="label text-mute">${esc(w.tools)}</p>
            ${
              w.caption
                ? `<p class="text-sm text-ink/85 leading-snug pt-1 border-t border-ink/15">${esc(w.caption)}</p>`
                : ''
            }
          </div>
        </article>`;
    })
    .join('');

  return `
    <section id="works" aria-labelledby="works-title" class="border-b border-ink">
      ${SectionHeader({
        index: '05',
        label: 'My Works',
        title: 'Posters &amp; visual archive.',
        aside: 'Print, layout &amp; graphic explorations',
        id: 'works-title',
      })}

      <!-- Filter bar -->
      <div class="border-b border-ink bg-surface flex flex-wrap items-center justify-between">
        <div class="flex flex-wrap items-center">
          <span class="px-page py-2 label text-mute border-r border-ink hidden sm:inline">Filter /</span>
          ${filterButtons}
        </div>
        <div class="px-page py-2 label text-mute hidden md:block">
          Infinite Loop Carousel Active · Click any poster to expand · Use ‹ › or swipe
        </div>
      </div>

      <!-- Poster Gallery Grid -->
      <div class="px-page grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:py-14" id="works-grid">
        ${cards}
      </div>

      <!-- Quick Upload Guide Note -->
      <div class="px-page flex flex-col justify-between gap-3 border-t border-ink py-4 label sm:flex-row text-mute bg-paper">
        <span>To add photos, drop files into <code class="text-ink font-bold">public/works/</code> or subfolders (like <code class="text-ink font-bold">public/works/nike/</code>) and list them in <code class="text-ink font-bold">src/data/visualWorks.js</code>.</span>
        <span class="text-ink shrink-0">${String(visualWorks.length).padStart(2, '0')} visual entries</span>
      </div>

      <!-- Lightbox Modal Container (Infinite Loop Carousel) -->
      <div id="works-lightbox"
           class="fixed inset-0 z-[100] hidden items-center justify-center bg-ink/85 backdrop-blur-sm p-3 md:p-6"
           role="dialog"
           aria-modal="true"
           aria-labelledby="lightbox-title">
        <div class="relative flex flex-col max-h-[95vh] max-w-5xl w-full border-2 border-ink bg-paper shadow-[8px_8px_0_var(--color-acid)] overflow-hidden">
          <!-- Lightbox Top bar -->
          <div class="flex items-center justify-between border-b border-ink bg-surface px-4 py-3 label">
            <div class="flex items-center gap-3">
              <span id="lightbox-badge" class="bg-acid text-ink px-1.5 py-0.5 font-bold"></span>
              <span id="lightbox-slide-counter" class="text-ink font-mono font-bold"></span>
              <span class="label hidden sm:inline text-mute border-l border-ink/40 pl-3">Infinite Loop Active ↻</span>
            </div>
            <button type="button"
                    id="lightbox-close"
                    class="label flex items-center gap-2 border border-ink bg-paper px-3 py-1 hover:bg-ink hover:text-paper transition-colors cursor-pointer"
                    aria-label="Close modal">
              <span>Close</span> <span aria-hidden="true">✕</span>
            </button>
          </div>

          <!-- Lightbox Content Area -->
          <div class="grid md:grid-cols-12 overflow-y-auto max-h-[82vh]">
            <div class="md:col-span-8 bg-ink/5 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-ink overflow-hidden relative">
              <!-- Infinite Sliding track viewport -->
              <div id="lightbox-viewport" class="w-full max-h-[62vh] overflow-hidden relative flex items-center justify-center group/modalview select-none touch-pan-y cursor-grab active:cursor-grabbing">
                <!-- Track -->
                <div id="lightbox-slider-track"
                     class="flex w-full will-change-transform items-center"
                     style="transform: translateX(-100%);">
                  <!-- Injected by JS -->
                </div>

                <!-- Direct Left / Right navigation buttons on the lightbox container -->
                <button type="button"
                        id="lightbox-container-prev"
                        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 size-11 bg-paper/95 hover:bg-acid text-ink border-2 border-ink flex items-center justify-center font-bold text-2xl shadow-[3px_3px_0_var(--color-ink)] transition-transform active:scale-95 cursor-pointer"
                        aria-label="Previous poster in series">
                  ‹
                </button>
                <button type="button"
                        id="lightbox-container-next"
                        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 size-11 bg-paper/95 hover:bg-acid text-ink border-2 border-ink flex items-center justify-center font-bold text-2xl shadow-[3px_3px_0_var(--color-ink)] transition-transform active:scale-95 cursor-pointer"
                        aria-label="Next poster in series">
                  ›
                </button>

                <!-- Touch / swipe hint badge -->
                <div class="absolute bottom-2 right-2 z-20 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
                  <span class="label text-[0.62rem] bg-ink text-paper px-2 py-0.5 font-mono">
                    SWIPE / ‹ › / ESC
                  </span>
                </div>
              </div>

              <!-- Series Thumbnail Strip -->
              <div id="lightbox-thumbnails" class="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-full overflow-x-auto py-1">
                <!-- Thumbnails injected by JS -->
              </div>
            </div>

            <div class="md:col-span-4 p-6 flex flex-col justify-between gap-6 bg-paper">
              <div class="space-y-4">
                <p id="lightbox-meta" class="label text-mute"></p>
                <h3 id="lightbox-title" class="font-display text-2xl lg:text-3xl font-bold tracking-[-0.03em] leading-tight"></h3>
                <p id="lightbox-tools" class="label text-ink bg-surface p-2 border border-ink inline-block"></p>
                <p id="lightbox-caption" class="text-sm text-ink/85 leading-relaxed"></p>
              </div>

              <!-- Navigation arrows inside modal sidebar -->
              <div class="flex items-center justify-between border-t border-ink pt-4 mt-auto">
                <button type="button" id="lightbox-prev" class="btn btn-ghost text-xs px-3 py-2 cursor-pointer">
                  ← Prev Poster
                </button>
                <span class="label text-mute text-xs">‹ › / Esc</span>
                <button type="button" id="lightbox-next" class="btn btn-primary text-xs px-3 py-2 cursor-pointer">
                  Next Poster →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;
}

/** Wire up infinite card sliders, category filtering, and infinite lightbox interactions */
export function initVisualWorks() {
  const filterBtns = document.querySelectorAll('[data-work-filter]');
  const items = document.querySelectorAll('.work-item');
  const lightbox = document.getElementById('works-lightbox');
  if (!lightbox) return;

  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const containerPrevBtn = document.getElementById('lightbox-container-prev');
  const containerNextBtn = document.getElementById('lightbox-container-next');
  const lightboxViewport = document.getElementById('lightbox-viewport');
  const lightboxTrack = document.getElementById('lightbox-slider-track');
  const thumbsContainer = document.getElementById('lightbox-thumbnails');
  const titleEl = document.getElementById('lightbox-title');
  const badgeEl = document.getElementById('lightbox-badge');
  const slideCounterEl = document.getElementById('lightbox-slide-counter');
  const metaEl = document.getElementById('lightbox-meta');
  const toolsEl = document.getElementById('lightbox-tools');
  const captionEl = document.getElementById('lightbox-caption');

  let currentWorkIndex = 0;
  let currentSlideIndex = 0; // 0-indexed real slide (0 to total-1)
  let currentLightboxTrackPos = 1; // 1 to total in the cloned track
  let resetTimer = null;

  // ─────────────────────────────────────────────────────────────
  // 1. On-Card Infinite Loop Slider Logic (Bulletproof)
  // ─────────────────────────────────────────────────────────────
  const cardSlideLocks = new Map();

  const handleCardInfiniteSlide = (itemEl, direction) => {
    const workId = itemEl.dataset.workId;
    if (cardSlideLocks.get(workId)) return;

    const w = visualWorks.find((item) => item.id === workId);
    if (!w) return;
    const images = getItemImages(w);
    const total = images.length;
    if (total <= 1) return;

    cardSlideLocks.set(workId, true);
    setTimeout(() => cardSlideLocks.set(workId, false), 460);

    let trackPos = parseInt(itemEl.dataset.trackPos || '1', 10);
    const track = itemEl.querySelector('[data-slider-track]');
    if (!track) return;

    // Boundary snap check before moving:
    if (trackPos >= total + 1) {
      trackPos = 1;
      itemEl.dataset.trackPos = '1';
      track.style.transition = 'none';
      track.style.transform = 'translateX(-100%)';
      void track.offsetWidth;
    } else if (trackPos <= 0) {
      trackPos = total;
      itemEl.dataset.trackPos = String(total);
      track.style.transition = 'none';
      track.style.transform = `translateX(-${total * 100}%)`;
      void track.offsetWidth;
    }

    trackPos = direction === 'next' ? trackPos + 1 : trackPos - 1;
    itemEl.dataset.trackPos = String(trackPos);

    track.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    track.style.transform = `translateX(-${trackPos * 100}%)`;

    // Real slide index (0 to total - 1)
    const realSlide = ((trackPos - 1) % total + total) % total;
    itemEl.dataset.currentSlide = String(realSlide);

    const cardCounter = itemEl.querySelector('[data-card-counter]');
    if (cardCounter) {
      cardCounter.textContent = `${String(realSlide + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    const dotsWrap = itemEl.querySelector('[data-card-dots]');
    if (dotsWrap) {
      dotsWrap.querySelectorAll('[data-dot-idx]').forEach((dot, di) => {
        if (di === realSlide) {
          dot.classList.add('bg-acid', 'border-ink');
          dot.classList.remove('bg-paper/70');
        } else {
          dot.classList.remove('bg-acid', 'border-ink');
          dot.classList.add('bg-paper/70');
        }
      });
    }

    // Seamless loop reset on boundary clones (with guaranteed timer fallback)
    const resetCardClone = () => {
      if (trackPos >= total + 1) {
        trackPos = 1;
        itemEl.dataset.trackPos = '1';
        track.style.transition = 'none';
        track.style.transform = `translateX(-100%)`;
        void track.offsetWidth;
      } else if (trackPos <= 0) {
        trackPos = total;
        itemEl.dataset.trackPos = String(total);
        track.style.transition = 'none';
        track.style.transform = `translateX(-${total * 100}%)`;
        void track.offsetWidth;
      }
    };

    if (trackPos >= total + 1 || trackPos <= 0) {
      setTimeout(resetCardClone, 460);
    }
  };

  document.querySelectorAll('[data-card-prev]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemEl = btn.closest('.work-item');
      if (itemEl) handleCardInfiniteSlide(itemEl, 'prev');
    });
  });

  document.querySelectorAll('[data-card-next]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemEl = btn.closest('.work-item');
      if (itemEl) handleCardInfiniteSlide(itemEl, 'next');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Category Filtering
  // ─────────────────────────────────────────────────────────────
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.workFilter;

      filterBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.setAttribute('aria-pressed', String(isCurrent));
        if (isCurrent) {
          b.classList.add('bg-ink', 'text-paper');
          b.classList.remove('bg-transparent', 'text-ink');
        } else {
          b.classList.remove('bg-ink', 'text-paper');
          b.classList.add('bg-transparent', 'text-ink');
        }
      });

      items.forEach((item) => {
        const itemCat = item.dataset.category;
        if (cat === 'All' || itemCat === cat) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Infinite Loop Lightbox Modal Logic (Bulletproof State Machine)
  // ─────────────────────────────────────────────────────────────

  // Update text & thumbnail UI
  const updateLightboxInfo = (realIdx, total, w) => {
    currentSlideIndex = realIdx;
    badgeEl.textContent = `PST—${w.id}`;
    slideCounterEl.textContent =
      total > 1 ? `POSTER ${realIdx + 1} OF ${total}` : `${currentWorkIndex + 1} OF ${visualWorks.length}`;
    titleEl.textContent = w.title;
    metaEl.textContent = `${w.category.toUpperCase()} / ${w.year} / ${w.ratio}`;
    toolsEl.textContent = `TOOLS: ${w.tools}`;
    captionEl.textContent = w.caption || 'Visual exploration and composition study.';

    if (thumbsContainer) {
      thumbsContainer.querySelectorAll('[data-thumb-idx]').forEach((thumbBtn, ti) => {
        if (ti === realIdx) {
          thumbBtn.classList.add('border-ink', 'bg-acid', 'ring-2', 'ring-ink');
          thumbBtn.classList.remove('border-ink/40', 'opacity-70');
        } else {
          thumbBtn.classList.remove('border-ink', 'bg-acid', 'ring-2', 'ring-ink');
          thumbBtn.classList.add('border-ink/40', 'opacity-70');
        }
      });
    }
  };

  // Instant snap without transition
  const resetTrackPositionWithoutAnimation = (targetPos) => {
    currentLightboxTrackPos = targetPos;
    lightboxTrack.style.transition = 'none';
    lightboxTrack.style.transform = `translateX(-${targetPos * 100}%)`;
    void lightboxTrack.offsetWidth; // Force instant reflow
  };

  // Build cloned track: [ Clone(Last), Slide(0), ... Slide(N-1), Clone(0) ]
  const initLightboxTrack = (w, startIndex) => {
    const images = getItemImages(w);
    const total = images.length || 1;
    const isSeries = images.length > 1;

    const clonedSlides = isSeries
      ? [images[total - 1], ...images, images[0]]
      : images.length
      ? images
      : [null];

    lightboxTrack.innerHTML = clonedSlides
      .map((src, i) => {
        const realIdx = isSeries ? (i === 0 ? total : i === total + 1 ? 1 : i) : 1;
        if (src) {
          return `
            <div class="w-full shrink-0 flex items-center justify-center p-2 select-none" data-lightbox-slide="${i}">
              <img src="${esc(src)}"
                   alt="${esc(w.title)} Poster ${realIdx}"
                   class="max-h-[58vh] max-w-full object-contain border border-ink shadow-sm pointer-events-none select-none" />
            </div>`;
        }
        return `
          <div class="w-full shrink-0 flex items-center justify-center p-2 select-none" data-lightbox-slide="${i}">
            <div class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-ink bg-paper text-center max-w-sm select-none">
              <span class="label bg-acid px-2 py-0.5 text-ink mb-2">${total > 1 ? `Poster ${realIdx} of ${total}` : 'Poster Slot'}</span>
              <p class="font-display text-lg font-bold mb-1">${esc(w.title)}</p>
              <p class="label text-mute text-xs mb-3">Drop file at: ${total > 1 ? `public/works/nike/poster-0${realIdx}.jpg` : `public/works/poster-${w.id}.jpg`}</p>
              <span class="label text-ink border border-ink px-2 py-1 bg-surface">${w.ratio} Ratio</span>
            </div>
          </div>`;
      })
      .join('');

    // Real slide 0 is positioned at track index 1 (after the clone of the last slide)
    currentLightboxTrackPos = isSeries ? startIndex + 1 : 0;
    resetTrackPositionWithoutAnimation(currentLightboxTrackPos);

    // Show or hide on-container overlay arrows based on whether it's a series
    if (containerPrevBtn && containerNextBtn) {
      containerPrevBtn.style.display = isSeries ? 'flex' : 'none';
      containerNextBtn.style.display = isSeries ? 'flex' : 'none';
    }

    updateLightboxInfo(startIndex, total, w);
  };

  // Infinite Next Slide (Bulletproof state machine)
  const lightboxNext = () => {
    const w = visualWorks[currentWorkIndex];
    const images = getItemImages(w);
    const total = images.length;

    // Single image item: loop infinitely to next work in archive
    if (total <= 1) {
      currentWorkIndex = (currentWorkIndex + 1) % visualWorks.length;
      showLightbox(currentWorkIndex, 0);
      return;
    }

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    // Safety guard: if already on boundary clone, snap to real index 1 first
    if (currentLightboxTrackPos >= total + 1) {
      resetTrackPositionWithoutAnimation(1);
    } else if (currentLightboxTrackPos <= 0) {
      resetTrackPositionWithoutAnimation(total);
    }

    currentLightboxTrackPos++;
    lightboxTrack.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    lightboxTrack.style.transform = `translateX(-${currentLightboxTrackPos * 100}%)`;

    const realIndex = ((currentLightboxTrackPos - 1) % total + total) % total;
    updateLightboxInfo(realIndex, total, w);

    // If we just slid to the boundary clone (pos = total + 1), seamlessly reset to 1
    if (currentLightboxTrackPos >= total + 1) {
      resetTimer = setTimeout(() => {
        if (currentLightboxTrackPos >= total + 1) {
          resetTrackPositionWithoutAnimation(1);
        }
      }, 460);
    }
  };

  // Infinite Prev Slide (Bulletproof state machine)
  const lightboxPrev = () => {
    const w = visualWorks[currentWorkIndex];
    const images = getItemImages(w);
    const total = images.length;

    // Single image item: loop infinitely to previous work in archive
    if (total <= 1) {
      currentWorkIndex = (currentWorkIndex - 1 + visualWorks.length) % visualWorks.length;
      showLightbox(currentWorkIndex, 0);
      return;
    }

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    // Safety guard: if already on boundary clone, snap to real index total first
    if (currentLightboxTrackPos <= 0) {
      resetTrackPositionWithoutAnimation(total);
    } else if (currentLightboxTrackPos >= total + 1) {
      resetTrackPositionWithoutAnimation(1);
    }

    currentLightboxTrackPos--;
    lightboxTrack.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    lightboxTrack.style.transform = `translateX(-${currentLightboxTrackPos * 100}%)`;

    const realIndex = ((currentLightboxTrackPos - 1) % total + total) % total;
    updateLightboxInfo(realIndex, total, w);

    // If we just slid to the boundary clone (pos = 0), seamlessly reset to total
    if (currentLightboxTrackPos <= 0) {
      resetTimer = setTimeout(() => {
        if (currentLightboxTrackPos <= 0) {
          resetTrackPositionWithoutAnimation(total);
        }
      }, 460);
    }
  };

  // Persistent transitionend listener on lightboxTrack for zero-latency reset
  lightboxTrack.addEventListener('transitionend', (e) => {
    if (e.target !== lightboxTrack) return;
    const w = visualWorks[currentWorkIndex];
    const total = getItemImages(w).length;
    if (total <= 1) return;

    if (currentLightboxTrackPos >= total + 1) {
      if (resetTimer) clearTimeout(resetTimer);
      resetTrackPositionWithoutAnimation(1);
    } else if (currentLightboxTrackPos <= 0) {
      if (resetTimer) clearTimeout(resetTimer);
      resetTrackPositionWithoutAnimation(total);
    }
  });

  // Direct Thumbnail Jump
  const jumpToThumbnail = (targetIndex) => {
    const w = visualWorks[currentWorkIndex];
    const images = getItemImages(w);
    const total = images.length;
    if (total <= 1) return;

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    currentLightboxTrackPos = targetIndex + 1;
    lightboxTrack.style.transition = 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    lightboxTrack.style.transform = `translateX(-${currentLightboxTrackPos * 100}%)`;
    updateLightboxInfo(targetIndex, total, w);
  };

  // Show Lightbox Modal
  const showLightbox = (workIndex, slideIndex = 0) => {
    currentWorkIndex = workIndex;
    const w = visualWorks[currentWorkIndex];
    if (!w) return;
    const images = getItemImages(w);
    const total = images.length || 1;

    // Render thumbnail strip if series
    if (total > 1) {
      thumbsContainer.innerHTML = images
        .map(
          (src, ti) => `
          <button type="button"
                  data-thumb-idx="${ti}"
                  class="size-12 border-2 transition-all p-0.5 bg-paper flex items-center justify-center overflow-hidden cursor-pointer ${
                    ti === slideIndex
                      ? 'border-ink bg-acid ring-2 ring-ink'
                      : 'border-ink/40 opacity-70 hover:opacity-100 hover:border-ink'
                  }"
                  aria-label="View poster ${ti + 1}">
            ${
              src
                ? `<img src="${esc(src)}" class="w-full h-full object-cover pointer-events-none" alt="" />`
                : `<span class="label text-[0.65rem] font-mono">${ti + 1}</span>`
            }
          </button>`
        )
        .join('');

      thumbsContainer.querySelectorAll('[data-thumb-idx]').forEach((thumbBtn) => {
        thumbBtn.addEventListener('click', () => {
          const idx = parseInt(thumbBtn.dataset.thumbIdx, 10);
          jumpToThumbnail(idx);
        });
      });
      thumbsContainer.style.display = 'flex';
    } else {
      thumbsContainer.innerHTML = '';
      thumbsContainer.style.display = 'none';
    }

    initLightboxTrack(w, slideIndex);
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    closeBtn.focus();
  };

  const closeLightbox = () => {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
  };

  // Open modal on poster click
  document.querySelectorAll('[data-open-lightbox]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('[data-card-prev]') || e.target.closest('[data-card-next]')) return;
      const id = trigger.dataset.openLightbox;
      const index = visualWorks.findIndex((item) => item.id === id);
      const itemEl = trigger.closest('.work-item');
      const startSlide = itemEl ? parseInt(itemEl.dataset.currentSlide || '0', 10) : 0;
      if (index !== -1) showLightbox(index, startSlide);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation handlers (both container overlay buttons and sidebar buttons)
  prevBtn.addEventListener('click', lightboxPrev);
  nextBtn.addEventListener('click', lightboxNext);
  if (containerPrevBtn) containerPrevBtn.addEventListener('click', lightboxPrev);
  if (containerNextBtn) containerNextBtn.addEventListener('click', lightboxNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });

  // Touch & Pointer Drag Gestures for the Lightbox Container
  if (lightboxViewport) {
    let startX = 0;
    let isPointerDown = false;
    let didMove = false;

    lightboxViewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      isPointerDown = true;
      startX = e.clientX;
      didMove = false;
    });

    lightboxViewport.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;
      if (Math.abs(e.clientX - startX) > 10) {
        didMove = true;
      }
    });

    const handlePointerEnd = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (didMove) {
        const deltaX = e.clientX - startX;
        if (deltaX > 45) {
          lightboxPrev();
        } else if (deltaX < -45) {
          lightboxNext();
        }
      }
    };

    lightboxViewport.addEventListener('pointerup', handlePointerEnd);
    lightboxViewport.addEventListener('pointercancel', handlePointerEnd);
  }
}
