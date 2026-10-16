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

const root = document.getElementById('app');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches) document.documentElement.classList.add('js-motion');

const HOME_TITLE = `${site.name} — ${site.role}, ${site.location}`;
const HOME_DESC =
  'Portfolio of Clark Kent Gomez, a BSIT student, frontend developer and digital designer from Cebu, Philippines.';

/* ── Shell (rendered once) ─────────────────────────────────── */
root.innerHTML = `
  <a href="#main" class="skip-link">Skip to content</a>
  ${Navbar()}
  <main id="main" class="sheet" tabindex="-1"></main>
  ${Footer()}`;

const main = document.getElementById('main');
initNavbar();

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
  const els = main.querySelectorAll('.reveal, .rise');
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
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
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
      // Coming back from a case study: jump straight to the section.
      const el = target && document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
    // Same-page anchors scroll natively (smooth via CSS).
  }

  trackActiveSection();
  initReveal();
}

window.addEventListener('hashchange', route);
route();
