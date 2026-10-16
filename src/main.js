import './styles/main.css';

import { site } from './data/siteConfig.js';
import { getProject } from './data/projects.js';
import { Navbar, initNavbar, trackActiveSection } from './components/Navbar.js';
import { Hero, startClock } from './sections/Hero.js';
import { Work } from './sections/Work.js';
import { About } from './sections/About.js';
import { Skills } from './sections/Skills.js';
import { VisualWorks, initVisualWorks } from './sections/VisualWorks.js';
import { Contact, initContact } from './sections/Contact.js';
import { Footer } from './sections/Footer.js';
import { CaseStudy, NotFound } from './pages/CaseStudy.js';

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
    window.scrollTo({ top: 0, behavior: 'instant' });
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
  <a href="#main" class="skip-link">Skip to content</a>
  ${Navbar()}
  <main id="main" class="sheet" tabindex="-1"></main>
  ${Footer()}`;

const main = document.getElementById('main');
initNavbar();
initScrollProgress();

// Top scroll reading progress bar micro-animation
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${progress})`;
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}

// Skip link + "back to top" act in place (they must not trigger the hash router).
document.addEventListener('click', (e) => {
  const skip = e.target.closest('.skip-link');
  const top = e.target.closest('[data-to-top]');
  if (skip) {
    e.preventDefault();
    main.focus();
    main.scrollIntoView();
  } else if (top) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    document.querySelector('header a')?.focus({ preventScroll: true });
  }
});

/* ── Reveal on scroll ──────────────────────────────────────── */
let revealObserver;
function initReveal() {
  revealObserver?.disconnect();
  const els = main.querySelectorAll('.reveal, .rise, .work-item');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealObserver.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -5% 0px', threshold: 0.02 }
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
    window.scrollTo({ top: 0, behavior: 'instant' });
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
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'instant' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }

  trackActiveSection();
  initReveal();
}

window.addEventListener('hashchange', route);
route();
