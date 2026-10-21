import { projects } from '../data/projects.js';
import { ProjectCard } from '../components/ProjectCard.js';
import { SectionHeader } from '../components/SectionHeader.js';

/**
 * Editorial archive layout for curated flagship projects:
 *   [ 01 — Out of Context: full width feature, text left / image right ]
 *   [ 02 — Presentia: inverse full width on ink, image left / text right ]
 *   [ 03 — EasyCert: full width feature, text left / image right ]
 *   [ 04 — Bato-Bato Pick: inverse full width on ink, image left / text right ]
 */
export function Work() {
  return `
    <section id="work" aria-labelledby="work-title" class="border-b border-ink">
      ${SectionHeader({
        index: '02',
        label: 'Selected work',
        title: 'Things I&rsquo;ve made.',
        aside: `${String(projects.length).padStart(2, '0')} entries / index`,
        id: 'work-title',
      })}

      ${projects.map((p, i) => ProjectCard(p, i % 2 === 1 ? 'inverse' : 'feature')).join('')}

      <div class="px-page flex flex-col justify-between gap-2 py-4 label sm:flex-row text-mute">
        <span>Verified projects with live links, real roles, and production screenshots.</span>
        <span class="text-ink">${String(projects.length).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')} curated</span>
      </div>
    </section>`;
}
