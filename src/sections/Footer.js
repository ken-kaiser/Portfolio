import { site } from '../data/siteConfig.js';
import { esc } from '../lib/utils.js';

export function Footer() {
  return `
    <footer class="border-t border-ink">
      <div class="sheet grid label sm:grid-cols-2 lg:grid-cols-4">
        <p class="px-page border-b border-ink py-4 sm:border-r lg:border-b-0">Designed &amp; built by ${esc(site.name)}</p>
        <p class="px-page border-b border-ink py-4 text-mute lg:border-r lg:border-b-0">${esc(site.location)} / © ${esc(site.portfolioPeriod)}</p>
        <p class="px-page border-b border-ink py-4 text-mute sm:border-r sm:border-b-0">Built with intention. Updated as I learn.</p>
        <a href="#top" class="px-page flex items-center justify-between py-4 hover:bg-acid" data-to-top>
          Back to top <span aria-hidden="true" class="font-sans text-base leading-none">↑</span>
        </a>
      </div>
    </footer>`;
}
