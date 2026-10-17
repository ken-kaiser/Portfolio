import './styles/main.css';

import { site } from './data/siteConfig.js';
import { getProject } from './data/projects.js';
import { RulerScrollbar, initRulerScrollbar } from './components/RulerScrollbar.js';
import { Navbar, initNavbar, trackActiveSection } from './components/Navbar.js';
import { Hero, startClock } from './sections/Hero.js';
import { Work } from './sections/Work.js';
import { About } from './sections/About.js';
import { Skills } from './sections/Skills.js';
import { VisualWorks, initVisualWorks } from './sections/VisualWorks.js';
import { Contact, initContact } from './sections/Contact.js';
import { Footer } from './sections/Footer.js';
import { CaseStudy, NotFound } from './pages/CaseStudy.js';
import { initSmoothScroll, scrollToTarget } from './lib/smoothScroll.js';
import { initParallax } from './lib/parallax.js';

// Always return to top on page refresh/reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const isReload =
  (performance.getEntriesByType('navigation')[0] &&
    performance.getEntriesByType('navigation')[0].type === 'reload') ||
  performance.navigation?.type === 1;

if (isReload) {
  // Clear any internal anchor so page reload stays at the top
  if (location.hash && !location.hash.startsWith('#/work/')) {
    history.replaceState(null, '', location.pathname);
  }
}

window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  if (isReload || !location.hash || location.hash === '#top') {
    scrollToTarget(0, { immediate: true });
  }
});

const root = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches) document.documentElement.classList.add('js-motion');

const HOME_TITLE = `${site.name} — ${site.role}, ${site.location}`;
const HOME_DESC =
  'Portfolio of Clark Kent Gomez, a BSIT student, frontend developer and digital designer from Cebu, Philippines.';

/* ── Shell (rendered once) ─────────────────────────────────── */
root.innerHTML = `
  <div id="scroll-progress" class="fixed top-0 left-0 right-0 h-[2.5px] bg-acid z-[70] origin-left pointer-events-none will-change-transform" style="transform: scaleX(0);" aria-hidden="true"></div>
  ${RulerScrollbar()}
  <a href="#main" class="skip-link">Skip to content</a>
  ${Navbar()}
  <main id="main" class="sheet" tabindex="-1"></main>
  ${Footer()}`;

const main = document.getElementById('main');
initSmoothScroll({ smooth: !reduceMotion.matches });
initNavbar();
const updateRuler = initRulerScrollbar();

// Skip link + "back to top" act in place (they must not trigger the hash router).
// In-page section links glide via Lenis instead of the browser's instant jump.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const skip = e.target.closest('.skip-link');
  const top = e.target.closest('[data-to-top]');
  if (skip) {
    e.preventDefault();
    main.focus({ preventScroll: true });
    scrollToTarget(main, { immediate: true });
    return;
  }
  if (top) {
    e.preventDefault();
    scrollToTarget(0);
    document.querySelector('header a')?.focus({ preventScroll: true });
    return;
  }

  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href.startsWith('#/')) return; // case-study routes → hash router

  const id = href.slice(1);
  const el = id ? document.getElementById(id) : null;
  if (!el || !main.contains(el)) return; // section not on this page → let the router render home first

  e.preventDefault();
  scrollToTarget(id === 'top' ? 0 : el);
  if (location.hash !== href) history.pushState(null, '', href);

  // Move keyboard focus to the section without the browser scrolling it.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
});

/* ── Reveal on scroll (blur → sharp) ───────────────────────── */
const REVEAL_STAGGER = 70; // ms between elements entering in the same batch

/** Once revealed, strip the motion classes so hover transitions stay snappy and no filter lingers. */
function settleReveal(el) {
  const done = () => {
    clearTimeout(timer);
    el.removeEventListener('transitionend', onEnd);
    el.classList.remove('reveal', 'rise', 'is-in');
    el.style.removeProperty('--reveal-delay');
  };
  const onEnd = (ev) => {
    if (ev.target === el && ev.propertyName === 'opacity') done();
  };
  const delay = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-delay')) || 0;
  const timer = setTimeout(done, 1400 + delay);
  el.addEventListener('transitionend', onEnd);
}

let revealObserver;
function initReveal() {
  revealObserver?.disconnect();
  const els = main.querySelectorAll('.reveal, .rise, .work-item');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      let batch = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        // Auto-stagger siblings that enter together (unless CSS already sets a delay)
        if (!getComputedStyle(el).getPropertyValue('--reveal-delay').trim() && batch > 0) {
          el.style.setProperty('--reveal-delay', `${Math.min(batch, 6) * REVEAL_STAGGER}ms`);
        }
        batch++;
        el.classList.add('is-in');
        settleReveal(el);
        revealObserver.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0 }
  );
  els.forEach((el) => revealObserver.observe(el));
}

function setMeta(title, description) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
}

/* ── Router ────────────────────────────────────────────────────
   #/work/<slug>  → case study
   #<section-id>  → home, scrolled to that section
   (empty)        → home                                       */
let view = null;

function route() {
  const hash = decodeURIComponent(location.hash);
  const match = hash.match(/^#\/work\/([\w-]+)\/?$/);

  if (match) {
    const project = getProject(match[1]);
    view = `case:${match[1]}`;
    main.innerHTML = project ? CaseStudy(project) : NotFound();
    setMeta(
      project ? `${project.name} — Case study / ${site.name}` : `Not found / ${site.name}`,
      project ? project.summary : HOME_DESC
    );
    scrollToTarget(0, { immediate: true });
    main.querySelector('h1')?.focus({ preventScroll: true });
  } else {
    const target = hash.startsWith('#/') ? '' : hash.slice(1);
    if (view !== 'home') {
      view = 'home';
      main.innerHTML = Hero() + Work() + About() + Skills() + VisualWorks() + Contact();
      setMeta(HOME_TITLE, HOME_DESC);
      initContact();
      initVisualWorks();
      startClock();

      // If refreshed or loading home, return directly to top
      if (isReload || !target || target === 'top') {
        scrollToTarget(0, { immediate: true });
      } else if (!scrollToTarget(target, { immediate: true })) {
        scrollToTarget(0, { immediate: true });
      }
    }
  }

  trackActiveSection();
  initReveal();
  initParallax(main, { enabled: !reduceMotion.matches });
  updateRuler?.();
}

window.addEventListener('hashchange', route);
route();
