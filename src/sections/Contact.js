import { site } from '../data/siteConfig.js';
import { esc, isSet, isPlaceholder } from '../lib/utils.js';

/** A big ruled link row. Placeholders render as a clearly marked, non-clickable row. */
function Row({ label, url, display, external = true, download = false }) {
  if (!url) return '';
  const base =
    'flex items-center justify-between gap-4 border-b border-paper/25 px-page py-5 md:py-6';

  if (isPlaceholder(url)) {
    return `
      <div class="${base} text-paper/55">
        <span class="label w-24 shrink-0">${esc(label)}</span>
        <span class="label flex-1 truncate">Not set — add in src/data/siteConfig.js</span>
        <span class="tbc">Placeholder</span>
      </div>`;
  }
  if (!isSet(url)) return '';

  return `
    <a href="${esc(url)}" class="row-link ${base}"
       ${external ? 'target="_blank" rel="noopener noreferrer"' : ''} ${download ? 'download' : ''}>
      <span class="label w-24 shrink-0">${esc(label)}</span>
      <span class="flex-1 truncate font-display text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-[-0.03em]">${esc(display || url.replace(/^https?:\/\/(www\.)?/, ''))}</span>
      <span class="row-arrow text-2xl" aria-hidden="true">${download ? '↓' : '↗'}</span>
      ${external ? '<span class="sr-only">(opens in a new tab)</span>' : ''}
    </a>`;
}

export function Contact() {
  const emailSet = isSet(site.email);

  const emailBlock = emailSet
    ? `
      <div class="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <a href="mailto:${esc(site.email)}" class="btn btn-primary min-h-16 flex-1 text-sm sm:text-base">
          <span class="truncate normal-case tracking-normal">${esc(site.email)}</span><span class="arrow" aria-hidden="true">↗</span>
        </a>
        <button type="button" class="btn btn-ghost border-paper text-paper hover:bg-paper hover:text-ink" data-copy="${esc(site.email)}">
          <span data-copy-label>Copy email</span><span class="arrow" aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <p class="label text-paper/60" aria-live="polite" data-copy-status></p>`
    : `
      <div class="border border-dashed border-paper/50 p-5">
        <p class="label text-acid">Email not set</p>
        <p class="mt-2 text-sm text-paper/70">Replace <code class="text-paper">YOUR_EMAIL_HERE</code> in <code class="text-paper">src/data/siteConfig.js</code> — the button and copy action appear automatically.</p>
      </div>`;

  return `
    <section id="contact" aria-labelledby="contact-title" class="on-dark bg-ink text-paper">
      <div class="px-page flex items-center justify-between gap-4 border-b border-paper/25 py-3 label">
        <span><span class="text-acid">06</span> / Your turn</span>
        <span class="flex items-center gap-2 text-paper/70"><span class="dot dot-live" aria-hidden="true"></span>${esc(site.availability.label)}</span>
      </div>

      <div class="grid lg:grid-cols-12">
        <div class="px-page border-b border-paper/25 pt-12 pb-10 lg:col-span-8 lg:border-r lg:border-b-0 lg:pt-20 lg:pb-16">
          <h2 id="contact-title" class="hero-title rise lg:text-[clamp(4.5rem,8vw,8.5rem)]!">
            Got something <span class="text-acid">in mind?</span>
          </h2>
        </div>
        <div class="px-page flex flex-col justify-end gap-6 py-10 lg:col-span-4 lg:py-16">
          <p class="max-w-[38ch] text-lg leading-relaxed text-paper/85">
            I&rsquo;m open to opportunities, collaborations, and projects where I can keep learning, contribute my skills, and make something useful.
          </p>
          ${emailBlock}
        </div>
      </div>

      <nav aria-label="Elsewhere" class="border-t border-paper/25">
        ${site.socials.map((s) => Row({ label: s.label, url: s.url })).join('')}
        ${Row({ label: 'Résumé', url: site.resumeUrl, display: 'Download résumé (PDF)', external: false, download: true })}
      </nav>
    </section>`;
}

/** Copy-to-clipboard for the email button (only rendered when an email is set). */
export function initContact() {
  const btn = document.querySelector('[data-copy]');
  if (!btn) return;
  const label = btn.querySelector('[data-copy-label]');
  const status = document.querySelector('[data-copy-status]');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      label.textContent = 'Copied';
      status.textContent = 'Email address copied to clipboard.';
    } catch {
      status.textContent = `Copy failed — the address is ${btn.dataset.copy}`;
    }
    setTimeout(() => {
      label.textContent = 'Copy email';
      status.textContent = '';
    }, 2200);
  });
}
