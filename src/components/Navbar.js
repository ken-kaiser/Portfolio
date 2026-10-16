import { site, nav } from '../data/siteConfig.js';
import { esc } from '../lib/utils.js';
import { Logo } from './Logo.js';

export function Navbar() {
  const links = nav
    .map(
      (n) => `
        <li class="h-full">
          <a class="nav-link label" href="#${n.id}" data-nav="${n.id}">
            <span class="text-mute">${n.index}</span>${esc(n.label)}
          </a>
        </li>`
    )
    .join('');

  const mobileLinks = nav
    .map(
      (n) => `
        <li class="border-b border-ink">
          <a class="flex items-baseline justify-between gap-4 px-page py-4 font-display text-4xl font-bold uppercase tracking-[-0.04em] hover:bg-acid"
             href="#${n.id}" data-nav="${n.id}">
            ${esc(n.label)}<span class="label text-mute">${n.index}</span>
          </a>
        </li>`
    )
    .join('');

  const status = site.availability.open
    ? `<span class="flex items-center gap-2 label">
         <span class="dot dot-live" aria-hidden="true"></span>${esc(site.availability.label)}
       </span>`
    : '';

  return `
    <header class="sticky top-0 z-50 border-b border-ink bg-paper">
      <div class="sheet flex h-[var(--nav-h)] items-stretch justify-between">
        <a href="#top" class="group flex items-center gap-3 pl-[clamp(1rem,3.2vw,3rem)] pr-4" aria-label="${esc(site.name)}, back to top">
          <span class="flex items-center transition-transform group-hover:-translate-y-0.5">${Logo({ className: 'h-4 sm:h-5 w-auto' })}</span>
          <span class="label hidden text-mute sm:inline">${esc(site.name)}</span>
        </a>

        <nav aria-label="Primary" class="hidden lg:flex">
          <ul class="flex h-full items-stretch">${links}</ul>
          <div class="flex items-center border-l border-ink px-5">${status}</div>
        </nav>

        <div class="flex items-stretch lg:hidden">
          <span class="hidden items-center border-l border-ink px-4 sm:flex" title="${esc(site.availability.label)}">
            <span class="dot dot-live" aria-hidden="true"></span>
            <span class="label ml-2">Open</span>
          </span>
          <button id="menu-toggle" type="button"
                  class="label flex items-center gap-3 border-l border-ink px-5 hover:bg-surface aria-expanded:bg-ink aria-expanded:text-paper"
                  aria-expanded="false" aria-controls="mobile-menu">
            <span data-menu-label>Menu</span>
            <span aria-hidden="true" class="font-sans text-base leading-none" data-menu-icon>+</span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="border-t border-ink bg-paper lg:hidden" hidden>
        <nav aria-label="Mobile">
          <ul>${mobileLinks}</ul>
        </nav>
        <div class="px-page py-4">${status}</div>
      </div>
    </header>`;
}

/** Wire up the mobile menu + active-section highlighting. Runs once. */
export function initNavbar() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const label = toggle.querySelector('[data-menu-label]');
  const icon = toggle.querySelector('[data-menu-icon]');

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    label.textContent = open ? 'Close' : 'Menu';
    icon.textContent = open ? '×' : '+';
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

let observer;

/** Highlight the nav item for the section currently in the middle of the viewport. */
export function trackActiveSection() {
  observer?.disconnect();
  const links = [...document.querySelectorAll('[data-nav]')];
  const setActive = (id) =>
    links.forEach((a) =>
      a.dataset.nav === id
        ? a.setAttribute('aria-current', 'location')
        : a.removeAttribute('aria-current')
    );

  const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
  if (!sections.length) return setActive(null);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
        else if (entry.target === sections[0] && entry.boundingClientRect.top > 0) setActive(null);
      });
    },
    { rootMargin: '-45% 0px -54% 0px' }
  );
  sections.forEach((s) => observer.observe(s));
}
