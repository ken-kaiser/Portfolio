/**
 * ─────────────────────────────────────────────────────────────
 *  VISUAL WORKS & POSTERS — Clark Kent Gomez
 * ─────────────────────────────────────────────────────────────
 *  How to add your posters and graphics:
 *
 *  Single Poster:
 *    image: './works/my-poster.jpg'
 *
 *  Poster Series / Multi-Poster Folder (like Nike series):
 *    images: [
 *      './works/nike/poster-01.jpg',
 *      './works/nike/poster-02.jpg',
 *      ...
 *    ]
 *
 *  Aspect Ratios: '3/4' (standard poster), '4/5', or '1/1' (square).
 */

export const visualCategories = ['All', 'Posters', 'Typography', 'Branding', 'Logo Design'];

export const visualWorks = [
  {
    id: '01',
    title: 'Shuriken Logo Pattern',
    category: 'Logo Design',
    tools: 'Figma',
    year: '2026',
    ratio: '3/4',
    image: './works/Pattern.jpg',
    caption: 'An exploration of pattern and modularity using a single shuriken-style logo.',
  },
  {
    id: '02',
    title: 'Neon Type Poster',
    category: 'Typography',
    tools: 'Figma · Photoshop',
    year: '2026',
    ratio: '3/4',
    image: './works/Frame.jpg',
    caption: 'Oversized typographic print study testing distortion, letterform weight contrast, and ink textures.',
  },
  {
    id: '03',
    title: 'Student Community Day 2026 — Community Partners',
    category: 'Posters',
    tools: 'Figma · Photo Editing',
    year: '2026',
    ratio: '1/1',
    images: [
      './works/scd/poster-01.jpg',
      './works/scd/poster-02.jpg',
      './works/scd/poster-03.jpg',
      './works/scd/poster-04.jpg',
      './works/scd/poster-05.jpg',
      './works/scd/poster-06.jpg',
      './works/scd/poster-07.jpg',
      './works/scd/poster-08.jpg',
      './works/scd/poster-09.jpg',
      './works/scd/poster-10.jpg',
    ],
    caption: 'A 10-part partner recognition and promotional campaign designed for Student Community Day 2026, celebrating university community partners through clean typography, organizational badges, and cohesive square layouts.',
  },
  {
    id: '04',
    title: 'Where Great Ideas Become Exceptional Prints',
    category: 'Branding',
    tools: 'Figma · Photoshop',
    year: '2026',
    ratio: '4/5',
    image: './works/poster-04.jpg',
    caption: 'Commercial print branding showcase highlighting floating collateral composition, dramatic top-lit lighting, and high-impact typography.',
  },
  {
    id: '05',
    title: 'Nike Poster Series',
    category: 'Posters',
    tools: 'Figma · Illustrator',
    year: '2026',
    ratio: '3/4',
    images: [
      './works/nike/poster-01.jpg',
      './works/nike/poster-02.jpg',
      './works/nike/poster-03.jpg',
      './works/nike/poster-04.jpg',
      './works/nike/poster-05.jpg',
      './works/nike/poster-06.jpg',
      './works/nike/poster-07.jpg',
    ],
    caption: 'A 7-poster conceptual campaign exploring motion, raw athlete energy, and bold Swiss/brutalist typography for Nike.',
  },
  {
    id: '06',
    title: 'Presentia — Product Slide Deck',
    category: 'Posters',
    tools: 'Figma',
    year: '2026',
    ratio: '1/1',
    images: [
      './works/presentia/slide1.png',
      './works/presentia/slide2.png',
      './works/presentia/slide3.png',
      './works/presentia/slide4.png',
      './works/presentia/slide5.png',
    ],
    caption: 'A 5-part panoramic slide deck showcasing Presentia v1.4.0, highlighting student biometric enrollment, 5-pose liveness verification, and real-time Google Meet and Zoom classroom monitoring through 3D isometric glassmorphism mockups.',
  },
];
