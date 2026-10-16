/**
 * CKG Logo Component
 * Renders the custom brutalist CKG SVG mark with adaptive ink / paper fill.
 * Path 1: C (slanted geometric)
 * Path 2: K (sharp acid accent #E3FF39)
 * Path 3: G (slanted geometric)
 */
export function Logo({ className = 'h-5 w-auto', dark = false } = {}) {
  const fg = dark ? '#F1F0E8' : 'currentColor';
  return `
    <svg class="${className} inline-block select-none transition-transform duration-200 ease-out group-hover:scale-[1.04]" viewBox="0 0 67 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CKG Logo">
      <path class="transition-colors duration-200" d="M31 0H22H7L0 13H17L19 9H15L14 10L13 9H8L9.5 6.5L11 4H15H18H21H22.5L18 13H24H25L31 0Z" fill="${fg}"/>
      <path class="transition-all duration-200 group-hover:brightness-115" d="M35 0H43L37.5 5.5L40 13H32L29 5.5L35 0Z" fill="#D7FF00"/>
      <path class="transition-colors duration-200" d="M47 0H66.5L64 4H52L49 9H54.5L57.5 4.5H63.5L58.5 13H40L47 0Z" fill="${fg}"/>
    </svg>`;
}
