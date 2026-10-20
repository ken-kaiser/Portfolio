import { esc } from '../lib/utils.js';

// Section header with index numbering, category tag, and main heading
export function SectionHeader({ index, label, title, aside = '', id, dark = false }) {
  const rule = dark ? 'border-paper/30' : 'border-ink';
  return `
    <header class="border-b ${rule}">
      <div class="px-page flex items-center justify-between gap-4 border-b ${rule} py-3 label">
        <span><span class="${dark ? 'text-acid' : ''}">${esc(index)}</span> / ${esc(label)}</span>
        ${aside ? `<span class="${dark ? 'text-paper/70' : 'text-mute'} text-right">${aside}</span>` : ''}
      </div>
      <h2 id="${id}" class="section-title rise px-page pt-10 pb-8 md:pt-16 md:pb-12">${title}</h2>
    </header>`;
}
