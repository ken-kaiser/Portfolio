import { skills } from '../data/siteConfig.js';
import { SectionHeader } from '../components/SectionHeader.js';
import { esc } from '../lib/utils.js';

export function Skills() {
  const groups = skills
    .map(
      (g, gi) => `
        <div class="rise border-b border-ink last:border-b-0 md:border-b-0 ${
          gi < skills.length - 1 ? 'md:border-r md:border-ink' : ''
        } ${gi === skills.length - 1 ? 'bg-surface' : ''}">
          <h3 class="px-page label flex items-center justify-between border-b border-ink py-3 md:px-6">
            <span><span class="text-mute">${String.fromCharCode(65 + gi)} /</span> ${esc(g.group)}</span>
            <span class="text-mute">(${String(g.items.length).padStart(2, '0')})</span>
          </h3>
          <ul class="px-page md:px-6">
            ${g.items
              .map(
                (item, i) => `
                  <li class="flex items-baseline justify-between gap-4 border-b border-ink/20 py-3 last:border-b-0">
                    <span class="font-display text-[1.35rem] font-medium tracking-[-0.02em]">${esc(item)}</span>
                    <span class="label text-mute">${String.fromCharCode(65 + gi)}${i + 1}</span>
                  </li>`
              )
              .join('')}
          </ul>
        </div>`
    )
    .join('');

  return `
    <section id="skills" aria-labelledby="skills-title" class="border-b border-ink">
      ${SectionHeader({
        index: '04',
        label: 'My ToolKit',
        title: 'What I work with.',
        aside: 'No percentages. No pretending.',
        id: 'skills-title',
      })}
      <div class="grid md:grid-cols-3">${groups}</div>
      <p class="px-page label border-t border-ink py-4 text-mute">
        Tools I use and am actively learning — listed for context, not as a claim of mastery.
      </p>
    </section>`;
}
