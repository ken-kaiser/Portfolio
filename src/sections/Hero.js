import { site } from '../data/siteConfig.js';
import { projects } from '../data/projects.js';
import { esc } from '../lib/utils.js';

export function Hero() {
  const meta = [
    ['Based in', site.location],
    ['Studying', site.education],
    ['Focus', site.focus],
  ]
    .map(
      ([k, v]) => `
        <div class="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-ink py-2.5 last:border-b-0">
          <dt class="label text-mute">${esc(k)}</dt>
          <dd class="label text-ink">${esc(v)}</dd>
        </div>`
    )
    .join('');

  return `
    <section id="top" aria-labelledby="hero-title" class="border-b border-ink">
      <!-- Index strip -->
      <div class="grid grid-cols-2 border-b border-ink label md:grid-cols-4">
        <p class="px-page border-r border-ink py-3">Portfolio / ${esc(site.portfolioPeriod)}</p>
        <p class="px-page py-3 md:border-r md:border-ink"><span class="bg-ink px-1 text-paper">01</span> / Introduction</p>
        <p class="px-page hidden border-r border-ink py-3 text-mute md:block">${esc(site.coordinates)}</p>
        <p class="px-page hidden py-3 text-mute md:block">
          Local time <time data-clock class="text-ink">--:--</time> ${esc(site.timezoneLabel)}
        </p>
      </div>

      <!-- Headline -->
      <div class="px-page relative pt-10 pb-10 md:pt-14 lg:pt-16 lg:pb-14">
        <h1 id="hero-title" class="hero-title">
          <span class="block">I design.</span>
          <span class="block lg:pl-[1.15em]">I build.</span>
          <span class="block">I make things <span class="hl">work.</span></span>
        </h1>

        <dl class="mt-10 max-w-md border-y border-ink lg:absolute lg:top-16 lg:right-[clamp(1rem,3.2vw,3rem)] lg:mt-0 lg:w-[min(30%,26rem)]">
          ${meta}
        </dl>
      </div>

      <!-- Intro + actions -->
      <div class="grid border-t border-ink lg:grid-cols-12">
        <div class="px-page hidden border-r border-ink py-8 lg:col-span-2 lg:flex lg:flex-col lg:justify-between">
          <span class="font-display text-6xl leading-none font-bold" aria-hidden="true">↘</span>
          <span class="label text-mute">Scroll / Index</span>
        </div>

        <div class="px-page flex flex-col gap-8 py-8 md:py-10 lg:col-span-6 lg:border-r lg:border-ink">
          <p class="max-w-[34ch] font-display text-[clamp(1.35rem,2.2vw,1.9rem)] leading-[1.2] font-medium tracking-[-0.02em]">
            ${esc(site.intro)}
          </p>
          <div class="flex flex-col gap-3 sm:flex-row">
            <a href="#work" class="btn btn-primary sm:min-w-[15rem]">Explore my work <span class="arrow" aria-hidden="true">↘</span></a>
            <a href="#contact" class="btn btn-ghost sm:min-w-[12rem]">Let's talk <span class="arrow" aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div class="px-page grid grid-cols-2 border-t border-ink lg:col-span-4 lg:grid-cols-1 lg:border-t-0">
          <div class="flex flex-col justify-between gap-6 border-r border-ink py-6 lg:border-r-0 lg:border-b">
            <span class="label text-mute">Selected work</span>
            <span class="font-display text-5xl leading-none font-bold tracking-[-0.05em]">${String(projects.length).padStart(2, '0')}<span class="label ml-2 align-top tracking-normal">projects</span></span>
          </div>
          <div class="flex flex-col justify-between gap-6 py-6 pl-5 lg:pl-0">
            <span class="label text-mute">Last updated</span>
            <span class="label">${esc(site.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </section>`;
}

let clockTimer;

/** Live local time for Cebu (useful context for anyone scheduling a call). */
export function startClock() {
  clearInterval(clockTimer);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: site.timezone,
  });
  const tick = () => {
    document.querySelectorAll('[data-clock]').forEach((el) => {
      const now = new Date();
      el.textContent = fmt.format(now);
      el.dateTime = now.toISOString();
    });
  };
  tick();
  clockTimer = setInterval(tick, 15000);
}
