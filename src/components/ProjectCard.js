import { Media } from './Media.js';
import { esc } from '../lib/utils.js';

const TBC = '<span class="tbc">To confirm</span>';

const value = (v) => (Array.isArray(v) ? (v.length ? esc(v.join(' · ')) : TBC) : v ? esc(v) : TBC);

/**
 * Project card. Layouts:
 *  - feature : full width, text left / image right
 *  - stack   : image on top, text below (for half-width columns)
 *  - inverse : full width on ink, image left / text right
 */
export function ProjectCard(p, layout = 'stack') {
  const dark = layout === 'inverse';
  const rule = dark ? 'border-paper/25' : 'border-ink';
  const sub = dark ? 'text-paper/65' : 'text-mute';

  const media = Media({
    image: p.cover.image,
    ratio: p.cover.ratio,
    variant: p.cover.variant,
    mark: p.number,
    hint: `public/images/${p.slug}-cover.png`,
    lazy: false,
    reveal: false,
  });

  const meta = `
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 label">
      <span class="font-medium">P—${p.number}</span>
      <span class="${sub}">${esc(p.identifier)}</span>
      ${p.badge ? `<span class="bg-acid px-1.5 py-0.5 text-ink">${esc(p.badge)}</span>` : ''}
    </div>`;

  const facts = `
    <dl class="grid grid-cols-[6.5rem_1fr] border-t ${rule} text-sm">
      <dt class="label border-b ${rule} py-2.5 ${sub}">Category</dt>
      <dd class="border-b ${rule} py-2.5">${esc(p.category)}</dd>
      <dt class="label border-b ${rule} py-2.5 ${sub}">Role</dt>
      <dd class="border-b ${rule} py-2.5">${value(p.role)}</dd>
      <dt class="label border-b ${rule} py-2.5 ${sub}">Tools</dt>
      <dd class="border-b ${rule} py-2.5">${value(p.stack)}</dd>
      <dt class="label py-2.5 ${sub}">Status</dt>
      <dd class="py-2.5">${value(p.status)}</dd>
    </dl>`;

  const cta = `
    <div class="flex items-center justify-between gap-4 pt-2">
      <span class="label">Read case study</span>
      <span class="go grid size-12 place-items-center border ${dark ? 'border-paper group-hover:text-ink group-focus-visible:text-ink' : 'border-ink'} text-xl" aria-hidden="true">↗</span>
    </div>`;

  const text = `
    <div class="flex h-full flex-col gap-6 p-[clamp(1.25rem,2.4vw,2.25rem)]">
      ${meta}
      <h3 class="project-title"><span>${esc(p.name)}</span></h3>
      <p class="max-w-[52ch] text-[1.05rem] leading-relaxed ${dark ? 'text-paper/85' : ''}">${esc(p.summary)}</p>
      <div class="mt-auto flex flex-col gap-5">${facts}${cta}</div>
    </div>`;

  const href = `#/work/${p.slug}`;
  const aria = `${p.name}: ${p.category}. Read case study`;

  if (layout === 'feature') {
    return `
      <article class="border-b border-ink">
        <a href="${href}" class="project-link group grid lg:grid-cols-12 hover:bg-surface/60" aria-label="${esc(aria)}">
          <div class="order-2 lg:order-1 lg:col-span-5 lg:border-r lg:border-ink">${text}</div>
          <div class="order-1 p-[clamp(1rem,2vw,1.75rem)] lg:order-2 lg:col-span-7">${media}</div>
        </a>
      </article>`;
  }

  if (layout === 'inverse') {
    return `
      <article class="on-dark border-b border-ink bg-ink text-paper">
        <a href="${href}" class="project-link group grid md:grid-cols-12" aria-label="${esc(aria)}">
          <div class="p-[clamp(1rem,2vw,1.75rem)] md:col-span-5 md:border-r md:border-paper/25">${media}</div>
          <div class="md:col-span-7">${text}</div>
        </a>
      </article>`;
  }

  return `
    <article class="h-full">
      <a href="${href}" class="project-link group flex h-full flex-col hover:bg-surface/60" aria-label="${esc(aria)}">
        <div class="p-[clamp(1rem,2vw,1.75rem)] pb-0">${media}</div>
        <div class="flex-1">${text}</div>
      </a>
    </article>`;
}
