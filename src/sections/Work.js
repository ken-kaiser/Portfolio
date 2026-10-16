import { projects } from '../data/projects.js';
import { ProjectCard } from '../components/ProjectCard.js';
import { SectionHeader } from '../components/SectionHeader.js';

/**
 * Editorial archive layout for 2 curated flagship projects:
 *   [ 01 — Presentia: full width feature, text left / image right ]
 *   [ 02 — EasyCert: inverse full width, image left / text right ]
 */
export function Work() {
  const [p1, p2, ...rest] = projects;

  return `
    <section id="work" aria-labelledby="work-title" class="border-b border-ink">
      ${SectionHeader({
        index: '02',
        label: 'Selected work',
        title: 'Things I&rsquo;ve made.',
        aside: `${String(projects.length).padStart(2, '0')} entries / index`,
        id: 'work-title',
      })}

      ${p1 ? ProjectCard(p1, 'feature') : ''}
      ${p2 ? ProjectCard(p2, 'inverse') : ''}
      ${rest.map((p) => ProjectCard(p, 'feature')).join('')}

      <div class="px-page flex flex-col justify-between gap-2 py-4 label sm:flex-row text-mute">
        <span>Verified projects with live links, real roles, and production screenshots.</span>
        <span class="text-ink">02 / 02 curated</span>
      </div>
    </section>`;
}
