/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — edit your personal details here.
 * ─────────────────────────────────────────────────────────────
 *  Any value that still contains "_HERE" is treated as a
 *  placeholder: the site renders it as a clearly marked,
 *  non-clickable "NOT SET" label instead of a broken link.
 *  Set a value to an empty string ('') to hide it entirely.
 */

export const site = {
  name: 'Clark Kent Gomez',
  shortName: 'Clark',
  monogram: 'CKG',
  role: 'Developer & Digital Designer',
  intro:
    "I'm a developer and digital designer who turns ideas into functional products and thoughtful visual experiences.",

  location: 'Cebu, Philippines',
  // Approximate coordinates of Cebu City, shown as hero metadata.
  coordinates: '10.3157° N / 123.8854° E',
  timezone: 'Asia/Manila',
  timezoneLabel: 'GMT+8',

  education: 'BSIT / Fourth Year',
  focus: 'Web Development / Digital Design',

  portfolioPeriod: '2026–2027',
  lastUpdated: 'OCT 2026',

  availability: {
    open: true,
    label: 'Open to opportunities',
  },

  // ── Contact ────────────────────────────────────────────────
  email: 'contactclark20@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/ken-kaiser' }
  ]
};

export const nav = [
  { id: 'work', label: 'Work', index: '02' },
  { id: 'about', label: 'About', index: '03' },
  { id: 'skills', label: 'My ToolKit', index: '04' },
  { id: 'works', label: 'My Works', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
];

export const about = {
  paragraphs: [
    "I'm a fourth-year BSIT student from Cebu, interested in the intersection of software development and visual design.",
    'I enjoy building web interfaces, exploring new technologies, and turning rough ideas into things people can actually use.',
    'Outside development, I spend time experimenting with graphic design, photo editing, digital illustration, and other creative projects.',
  ],
  interests: [
    'Frontend Development',
    'UI / Interface Design',
    'Web Applications',
    'Digital Art & Visual Design',
    'Creative Coding',
  ],
  principles: [
    { title: 'Make it useful.', text: 'Build around real user needs.' },
    {
      title: 'Sweat the details.',
      text: 'Typography, spacing, behavior, and accessibility matter.',
    },
    {
      title: 'Keep getting better.',
      text: 'Learn through experimentation, feedback, and iteration.',
    },
  ],
};

export const skills = [
  {
    group: 'Development',
    items: ['HTML', 'CSS', 'JavaScript', 'Responsive Web Design', 'Django', 'PostgreSQL', 'Git'],
  },
  {
    group: 'Design',
    items: ['UI Design', 'Graphic Design', 'Photoshop', 'Figma', 'PowerPoint', 'Photo Editing'],
  },
  {
    group: 'Current Explorations',
    items: [
      'ChatGPT & Claude (AI-assisted dev)',
      'Interaction design',
      'Frontend performance',
      'Accessible interfaces',
    ],
  },
];

// Visual works and posters are managed in src/data/visualWorks.js
export { visualWorks } from './visualWorks.js';
