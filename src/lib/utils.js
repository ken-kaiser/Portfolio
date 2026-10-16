/** Escape text before interpolating it into HTML templates. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** A config value is "set" when it is non-empty and not a `_HERE` placeholder. */
export const isSet = (value) =>
  typeof value === 'string' && value.trim() !== '' && !value.includes('_HERE');

/** A config value is a visible placeholder (still contains `_HERE`). */
export const isPlaceholder = (value) => typeof value === 'string' && value.includes('_HERE');

/** Join template fragments, dropping falsy values. */
export const join = (parts) => parts.filter(Boolean).join('');

/** "16/10" → "16:10" */
export const ratioLabel = (ratio) => ratio.replace('/', ':');
