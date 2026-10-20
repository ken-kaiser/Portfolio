import { projects } from '../data/projects.js';
import { Media } from '../components/Media.js';
import { esc, isSet } from '../lib/utils.js';

const STATUS_STYLE = {
  implemented: 'bg-acid text-ink border-ink',
  'in progress': 'bg-paper text-ink border-ink',
  planned: 'bg-transparent text-mute border-mute border-dashed',
  concept: 'bg-surface text-ink border-ink',
};

const todo = (prompt) => `
  <div class="todo">
    <p class="label mb-2"><span class="bg-ink px-1.5 py-0.5 text-paper">To write</span></p>
    <p class="text-[0.95rem] leading-relaxed text-mute">${esc(prompt)}</p>
  </div>`;

const prose = (text) =>
  (Array.isArray(text) ? text : [text]).map((t) => `<p>${esc(t)}</p>`).join('');

/** One numbered chapter: sticky label on the left, narrow reading column on the right. */
function Chapter(n, title, body, { wide = false } = {}) {
  const num = String(n).padStart(2, '0');
  return `
    <section class="grid border-b border-ink lg:grid-cols-12" aria-labelledby="ch-${num}">
      <div class="px-page border-b border-ink py-4 lg:col-span-3 lg:border-r lg:border-b-0 lg:py-8">
        <h2 id="ch-${num}" class="label lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
          <span class="text-mute">${num} /</span> ${esc(title)}
        </h2>
      </div>
      <div class="px-page py-8 lg:py-12 ${wide ? 'lg:col-span-9' : 'lg:col-span-7 xl:col-span-6'}">
        <div class="flex max-w-[64ch] flex-col gap-5 text-[1.075rem] leading-[1.7] ${wide ? 'max-w-none' : ''}">${body}</div>
      </div>
    </section>`;
}

export function CaseStudy(p) {
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const cs = p.caseStudy;
  const TBC = '<span class="tbc">To confirm</span>';

  const facts = [
    ['Category', esc(p.category)],
    ['Role', p.role ? esc(p.role) : TBC],
    ['Tools', p.stack?.length ? esc(p.stack.join(' · ')) : TBC],
    ['Status', esc(p.status)],
    ['Year', p.year ? esc(p.year) : TBC],
  ]
    .map(
      ([k, v]) => `
        <div class="border-b border-ink px-page py-4 sm:border-r lg:border-b-0 lg:px-5 last:border-r-0">
          <dt class="label mb-1.5 text-mute">${k}</dt>
          <dd class="text-[0.95rem] leading-snug">${v}</dd>
        </div>`
    )
    .join('');

  const features = `
    <table class="w-full border-collapse text-left text-[0.95rem]">
      <caption class="label mb-3 text-left text-mute">Scope — what exists vs. what is planned</caption>
      <thead>
        <tr class="border-y border-ink">
          <th scope="col" class="label py-2.5 pr-4 font-normal">Feature</th>
          <th scope="col" class="label w-36 py-2.5 font-normal">Status</th>
        </tr>
      </thead>
      <tbody>
        ${p.features
          .map(
            (f) => `
          <tr class="border-b border-ink/25">
            <td class="py-3 pr-4">${esc(f.name)}</td>
            <td class="py-3">${
              f.status
                ? `<span class="label inline-block border px-1.5 py-0.5 ${STATUS_STYLE[f.status] || ''}">${esc(f.status)}</span>`
                : TBC
            }</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>`;

  const gallery = `
    <div class="grid gap-x-5 gap-y-8 md:grid-cols-2">
      ${p.gallery
        .map(
          (g, gi) => `
        <figure class="flex flex-col gap-3 ${gi === 0 ? 'md:col-span-2' : ''}">
          ${Media({
            image: g.image,
            ratio: g.ratio,
            variant: gi === 0 ? p.cover.variant : 'plain',
            label: 'Screenshot placeholder',
            hint: `public/images/${p.slug}-${String(gi + 1).padStart(2, '0')}.png`,
            lazy: false,
            reveal: false,
          })}
          <figcaption class="label flex gap-3 border-t border-ink pt-2">
            <span class="font-medium">Fig. ${String(gi + 1).padStart(2, '0')}</span>
            <span class="text-mute">${esc(g.caption)}</span>
          </figcaption>
        </figure>`
        )
        .join('')}
    </div>`;

  const links = p.links.filter((l) => isSet(l.url));
  const linkList = links.length
    ? `<ul class="flex flex-col">${links
        .map(
          (l) => `
          <li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer"
                 class="row-link flex items-center justify-between border-b border-ink py-4">
            <span class="font-display text-2xl font-medium tracking-[-0.03em]">${esc(l.label)}</span>
            <span class="row-arrow text-xl" aria-hidden="true">↗</span>
            <span class="sr-only">(opens in a new tab)</span>
          </a></li>`
        )
        .join('')}</ul>`
    : `<p>No public link yet.</p>${todo('Add a repository, live demo, Figma file or video walkthrough in src/data/projects.js → links.')}`;

  const decisions = cs.decisions?.length
    ? `<ol class="flex flex-col">${cs.decisions
        .map(
          (d, di) => `
          <li class="grid grid-cols-[2.5rem_1fr] gap-2 border-t border-ink py-4">
            <span class="label pt-1">${String(di + 1).padStart(2, '0')}</span>
            <div><p class="font-medium">${esc(d.title)}</p><p class="text-mute">${esc(d.text)}</p></div>
          </li>`
        )
        .join('')}</ol>`
    : todo(cs.prompts.decisions);

  return `
    <article aria-labelledby="cs-title">
      <!-- Breadcrumb bar -->
      <div class="grid grid-cols-2 border-b border-ink label md:grid-cols-3">
        <a href="#/" class="px-page flex items-center gap-2 border-r border-ink py-3 hover:bg-acid">
          <span aria-hidden="true">←</span> Back to Home
        </a>
        <p class="px-page hidden border-r border-ink py-3 text-mute md:block">Case study / P—${p.number}</p>
        <a href="#/work/${next.slug}" class="px-page flex items-center justify-end gap-2 py-3 text-right hover:bg-acid">
          Next: ${esc(next.name)} <span aria-hidden="true">→</span>
        </a>
      </div>

      <!-- Title -->
      <header class="border-b border-ink">
        <div class="px-page grid gap-8 pt-10 pb-10 lg:grid-cols-12 lg:pt-16 lg:pb-14">
          <div class="lg:col-span-8">
            <p class="label mb-6 flex flex-wrap gap-x-4 gap-y-2">
              <span class="font-medium">P—${p.number}</span>
              <span class="text-mute">${esc(p.identifier)}</span>
              ${p.badge ? `<span class="bg-acid px-1.5 py-0.5">${esc(p.badge)}</span>` : ''}
            </p>
            <h1 id="cs-title" tabindex="-1" class="hero-title outline-none lg:text-[clamp(5rem,10vw,10rem)]!">${esc(p.name)}</h1>
          </div>
          <p class="max-w-[42ch] self-end font-display text-[clamp(1.15rem,1.7vw,1.45rem)] leading-[1.3] tracking-[-0.015em] lg:col-span-4">
            ${esc(p.summary)}
          </p>
        </div>
        <dl class="grid border-t border-ink sm:grid-cols-2 lg:grid-cols-5">${facts}</dl>
      </header>

      <!-- Cover -->
      <div class="px-page border-b border-ink py-[clamp(1rem,2vw,1.75rem)]">
        ${Media({
          image: p.cover.image,
          ratio: '21/9',
          variant: p.cover.variant,
          mark: p.name,
          hint: `public/images/${p.slug}-cover.webp`,
          lazy: false,
          reveal: false,
          className: 'min-h-64 max-h-[70vh] w-full',
        })}
      </div>

      ${Chapter(1, 'Overview', `<p>${esc(p.summary)}</p>${features}`)}
      ${Chapter(2, 'Problem / opportunity', cs.problem ? prose(cs.problem) : todo(cs.prompts.problem))}
      ${Chapter(3, 'Approach', cs.approach ? prose(cs.approach) : todo(cs.prompts.approach))}
      ${Chapter(4, 'My role', p.role ? `<p>${esc(p.role)}</p>` : todo(cs.prompts.role))}
      ${Chapter(
        5,
        'Technology & tools',
        p.stack?.length
          ? `<ul class="flex flex-col">${p.stack
              .map((s, si) => `<li class="flex justify-between border-t border-ink py-3"><span>${esc(s)}</span><span class="label text-mute">T${si + 1}</span></li>`)
              .join('')}</ul>`
          : todo('List the languages, frameworks, libraries and design tools actually used.')
      )}
      ${Chapter(6, 'Key decisions', decisions)}
      ${Chapter(7, 'Visual documentation', gallery, { wide: true })}
      ${Chapter(8, 'Challenges & lessons', cs.challenges ? prose(cs.challenges) : todo(cs.prompts.challenges))}
      ${Chapter(9, 'Links', linkList)}

      <!-- Next project -->
      <a href="#/work/${next.slug}" class="row-link group block border-b border-ink">
        <div class="px-page flex items-end justify-between gap-6 py-10 lg:py-14">
          <div>
            <p class="label mb-3 text-mute group-hover:text-ink">Next project / P—${next.number}</p>
            <p class="project-title text-[clamp(2.5rem,7vw,6rem)]!">${esc(next.name)}</p>
          </div>
          <span class="row-arrow font-display text-[clamp(2.5rem,6vw,5rem)] leading-none" aria-hidden="true">→</span>
        </div>
      </a>
    </article>`;
}

export function NotFound() {
  return `
    <section class="px-page flex min-h-[70vh] flex-col justify-center gap-8 border-b border-ink py-16" aria-labelledby="nf-title">
      <p class="label text-mute">Error / 404</p>
      <h1 id="nf-title" tabindex="-1" class="hero-title outline-none">Nothing <span class="hl">here.</span></h1>
      <p class="max-w-[40ch] text-lg">That project doesn&rsquo;t exist, or it moved. The index is a better place to start.</p>
      <div><a href="#work" class="btn btn-primary">Back to selected work <span class="arrow" aria-hidden="true">↘</span></a></div>
    </section>`;
}
