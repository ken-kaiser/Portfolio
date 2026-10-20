import { esc, ratioLabel } from '../lib/utils.js';

// Shows the project image if src exists, otherwise falls back to a placeholder box with the right aspect ratio.
export function Media({
  image,
  ratio = '16/10',
  variant = 'plain',
  label = 'Project image placeholder',
  hint = '',
  mark = '',
  lazy = true,
  reveal = true,
  className = '',
}) {
  const wrap = `frame ${reveal ? 'reveal' : ''} ${className}`;
  const style = `aspect-ratio:${ratio}`;

  if (image && image.src) {
    return `
      <div class="${wrap}" style="${style}" data-parallax-media>
        <img src="${esc(image.src)}" alt="${esc(image.alt || '')}"
             ${lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"'} />
      </div>`;
  }

  const dark = variant === 'type';
  const sub = dark ? 'text-paper/60' : 'text-mute';

  return `
    <div class="${wrap}" style="${style}">
      <div class="ph ph-${variant}" role="img" aria-label="${esc(label)}${hint ? ` — add an image at ${esc(hint)}` : ''}">
        <span class="tick tl"></span><span class="tick tr"></span>
        <span class="tick bl"></span><span class="tick br"></span>

        <div class="ph-meta top-6 label">
          <span class="${dark ? 'bg-acid text-ink' : 'bg-ink text-paper'} px-1.5 py-0.5">${esc(label)}</span>
          <span class="${sub} hidden sm:inline">${ratioLabel(ratio)}</span>
        </div>

        ${
          mark
            ? `<span class="relative font-display font-bold leading-none tracking-[-0.06em] ${
                dark ? 'text-acid' : 'text-ink/15'
              } text-[clamp(4rem,14vw,12rem)] select-none" aria-hidden="true">${esc(mark)}</span>`
            : ''
        }

        ${hint ? `<div class="ph-meta bottom-6 label ${sub}"><span class="truncate">→ ${esc(hint)}</span></div>` : ''}
      </div>
    </div>`;
}
