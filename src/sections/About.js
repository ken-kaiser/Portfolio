import { about, site } from '../data/siteConfig.js';
import { SectionHeader } from '../components/SectionHeader.js';
import { esc } from '../lib/utils.js';

export function About() {
  const [lead, ...body] = about.paragraphs;

  const interests = about.interests
    .map(
      (item, i) => `
        <li class="interest-item flex items-baseline gap-4 border-b border-ink py-3 last:border-b-0 cursor-default">
          <span class="label w-6 text-mute">${String(i + 1).padStart(2, '0')}</span>
          <span class="font-display text-xl font-medium tracking-[-0.02em]">${esc(item)}</span>
        </li>`
    )
    .join('');

  const principles = about.principles
    .map(
      (p, i) => `
        <li class="rise grid gap-3 border-b border-ink py-7 last:border-b-0 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9">
          <span class="label md:col-span-2">${String(i + 1).padStart(2, '0')} —</span>
          <h4 class="font-display text-[clamp(2rem,4.6vw,4rem)] leading-[0.95] font-bold uppercase tracking-[-0.045em] md:col-span-6">${esc(p.title)}</h4>
          <p class="max-w-[36ch] text-lg text-mute md:col-span-4">${esc(p.text)}</p>
        </li>`
    )
    .join('');

  return `
    <section id="about" aria-labelledby="about-title" class="border-b border-ink">
      ${SectionHeader({
        index: '03',
        label: 'The person behind the pixels',
        title: 'Still learning. <span class="hl">Always</span> building.',
        aside: esc(site.location),
        id: 'about-title',
      })}

      <div class="grid lg:grid-cols-12">
        <div class="px-page flex flex-col gap-6 border-b border-ink py-10 lg:col-span-7 lg:border-r lg:border-b-0 lg:py-14">
          <p class="max-w-[30ch] font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.15] font-medium tracking-[-0.025em]">${esc(lead)}</p>
          <div class="grid max-w-[64ch] gap-5 text-[1.075rem] leading-relaxed md:grid-cols-2 md:gap-8">
            ${body.map((t) => `<p>${esc(t)}</p>`).join('')}
          </div>
        </div>

        <aside class="px-page py-10 lg:col-span-5 lg:py-14" aria-labelledby="interests-title">
          <h3 id="interests-title" class="label mb-4 flex justify-between border-b border-ink pb-3">
            <span>Current interests</span><span class="text-mute">(${String(about.interests.length).padStart(2, '0')})</span>
          </h3>
          <ul>${interests}</ul>
        </aside>
      </div>

      <div class="border-t border-ink bg-surface">
        <h3 class="px-page label border-b border-ink py-3">How I work</h3>
        <ol class="px-page">${principles}</ol>
      </div>
    </section>`;
}
