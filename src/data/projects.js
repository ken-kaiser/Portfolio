/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — Clark Kent Gomez Portfolio
 * ─────────────────────────────────────────────────────────────
 *  Active, verified projects with real screenshots, live URLs,
 *  genuine roles, and actual development tools.
 */

export const projects = [
  {
    slug: 'presentia',
    number: '01',
    name: 'Presentia',
    category: 'AI / Desktop Application / Capstone Project',
    identifier: 'AI / CAPSTONE',
    badge: 'Capstone Project',
    summary:
      'An AI-powered virtual classroom attendance management system using facial recognition and liveness detection to help instructors verify student identity and monitor attendance during online classes.',
    status: 'Capstone Project',
    role: 'Project Manager',
    stack: ['Git', 'ChatGPT', 'Claude'],
    year: '2026',
    links: [
      { label: 'Live Portal', url: 'https://presentia.venki050524.workers.dev/' },
      { label: 'GitHub App Releases', url: 'https://github.com/kebintong/Presentia/releases/latest' },
    ],
    cover: {
      variant: 'grid',
      ratio: '16/10',
      image: {
        src: './images/presentia-cover.png',
        alt: 'Presentia Virtual Classroom Attendance Portal',
      },
    },
    features: [
      { name: 'Facial recognition identity verification', status: 'implemented' },
      { name: '20-second active liveness detection', status: 'implemented' },
      { name: 'Real-time presence monitoring', status: 'implemented' },
      { name: 'Automated attendance records & export', status: 'implemented' },
      { name: 'Class join codes & student onboarding portal', status: 'implemented' },
    ],
    caseStudy: {
      problem: [
        'In online remote learning, verifying student attendance is time-consuming for instructors and vulnerable to proxy roll-calls or camera-off absenteeism.',
        'Manual roll calls disrupt lecture flow, consume valuable class minutes, and fail to confirm genuine student presence during the entire session.',
      ],
      approach: [
        'Presentia combines a lightweight web registration portal with an instructor-facing desktop application. Students enter a session join code (e.g. K7M-Q2P) and undergo a 20-second liveness check with eye-blink and head-turn prompts.',
        'The educator desktop app verifies identity against the enrolled student roster and continuously logs attendance into structured records without intrusive monitoring.',
      ],
      role: 'Project Manager — managed task allocation, sprint milestones, documentation, and coordination across team members while guiding AI-augmented development workflows with Claude and ChatGPT.',
      decisions: [
        {
          title: 'Privacy-conscious liveness check',
          text: 'Implemented quick 20-second face checks verifying live presence without storing invasive biometric data after sessions conclude.',
        },
        {
          title: 'Class join codes for zero-friction entry',
          text: 'Eliminated complex account creation by utilizing temporary session join codes shared directly by instructors.',
        },
        {
          title: 'AI-assisted development with Claude & ChatGPT',
          text: 'Leveraged generative AI workflows for rapid code scaffolding, documentation, and coordination alongside Git version control.',
        },
      ],
      challenges: [
        'Ensuring smooth webcam capture and responsive feedback across diverse student hardware and fluctuating lighting conditions.',
      ],
      prompts: {},
    },
    gallery: [
      {
        caption: 'Presentia student join portal with class code verification',
        ratio: '16/9',
        image: {
          src: './images/presentia-cover.png',
          alt: 'Presentia Student Join Portal Interface',
        },
      },
      {
        caption: 'How it works: 4-step student onboarding & 20-second face check process',
        ratio: '16/9',
        image: {
          src: './images/presentia-steps.png',
          alt: 'Presentia 4-step onboarding flow',
        },
      },
    ],
  },

  {
    slug: 'easycert',
    number: '02',
    name: 'EasyCert',
    category: 'Web Application / Full-Stack Development',
    identifier: 'WEB APP / FULL-STACK',
    badge: 'Live Portal',
    summary:
      'An online barangay certificate platform concept focused on simplifying certificate applications, appointment scheduling, and improving the digital experience for residents and local administrators.',
    status: 'Live Project',
    role: 'Project Manager & Software Developer',
    stack: ['Git', 'ChatGPT', 'Claude'],
    year: '2026',
    links: [{ label: 'Live Website', url: 'https://easy-cert.vercel.app/' }],
    cover: {
      variant: 'form',
      ratio: '16/10',
      image: {
        src: './images/easycert-cover.png',
        alt: 'EasyCert Barangay Certificate Portal',
      },
    },
    features: [
      { name: 'Online Certificate Request Forms', status: 'implemented' },
      { name: 'Real-time Request Tracking (EC-YYYY-XXXXX)', status: 'implemented' },
      { name: 'Morning / Afternoon Pickup Scheduling', status: 'implemented' },
      { name: 'Print & Download PDF Verification', status: 'implemented' },
      { name: 'Administrative Review Workflow (Django Backend)', status: 'implemented' },
    ],
    caseStudy: {
      problem: [
        'Acquiring barangay clearances and residency certificates traditionally requires physical visits, prolonged queueing, manual paperwork, and multiple trips to barangay halls with no visibility into approval progress.',
        'Local administrators handle repetitive manual form entries and paper filings, causing delays and lost records.',
      ],
      approach: [
        'EasyCert digitizes the municipal certificate request pipeline into an accessible 3-step online flow (Choose Certificate, Fill Out Form, Pick Up Certificate) with preferred pickup time slots and instant tracking codes.',
        'Residents track approval status in real time using their tracking number, while administrators manage submissions through structured verification endpoints.',
      ],
      role: 'Project Manager & Software Developer — planned architecture, designed responsive user journeys, and engineered full-stack form submission and tracking query integration with AI-assisted workflows.',
      decisions: [
        {
          title: 'Streamlined 3-step resident experience',
          text: 'Reduced paperwork friction to 3 clear steps with real-time field validation and schedule selection.',
        },
        {
          title: 'Transparent tracking number system',
          text: 'Issued unique tracking identifiers with live status indicators (Under Review, Ready for Pickup) to eliminate resident uncertainty.',
        },
        {
          title: 'AI-accelerated development with ChatGPT & Claude',
          text: 'Utilized generative AI tooling for rapid UI structuring, backend endpoint logic, and unit testing coordinated through Git.',
        },
      ],
      challenges: [
        'Balancing accessible UI design for residents of all technical backgrounds with robust data validation and appointment capacity management.',
      ],
      prompts: {},
    },
    gallery: [
      {
        caption: 'EasyCert homepage with fast 3-step certificate application workflow',
        ratio: '16/9',
        image: {
          src: './images/easycert-cover.png',
          alt: 'EasyCert Resident Portal Homepage',
        },
      },
      {
        caption: 'Available barangay certificates grid (Cedula, Clearance, Residency, Indigency, Permits)',
        ratio: '16/9',
        image: {
          src: './images/easycert-certificates.png',
          alt: 'EasyCert Available Certificates Grid',
        },
      },
    ],
  },

  {
    slug: 'bato-bato-pick',
    number: '03',
    name: 'Bato-Bato Pick',
    category: 'Web Game / Interactive Arcade',
    identifier: 'GAME / ARCADE',
    badge: 'Arcade Game',
    summary:
      'An interactive Filipino-inspired Rock-Paper-Scissors arcade web game featuring custom sound design, retro neon aesthetics, dynamic CPU AI difficulty, and win-streak multipliers.',
    status: 'Published Game',
    role: 'Game Designer & Frontend Developer',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API', 'Git'],
    year: '2024',
    links: [{ label: 'GitHub Repository', url: 'https://github.com/ken-kaiser/Bato-Bato-Pick' }],
    cover: {
      variant: 'grid',
      ratio: '16/10',
      image: {
        src: './images/bato-bato-pick-cover.png',
        alt: 'Bato-Bato Pick Filipino Arcade Game Arena',
      },
    },
    features: [
      { name: 'Filipino rhythmic chant audio ("Bato-Bato-Pick!")', status: 'implemented' },
      { name: 'Interactive hand gesture animations (Rock, Paper, Scissors)', status: 'implemented' },
      { name: 'Adaptive CPU opponent AI and difficulty scaling', status: 'implemented' },
      { name: 'Consecutive win-streak counter & high-score tracking', status: 'implemented' },
      { name: 'Retro arcade audio toggle & Web Audio synthesizers', status: 'implemented' },
    ],
    caseStudy: {
      problem: [
        'Classic party and playground games like Filipino Rock-Paper-Scissors (Bato-Bato-Pick) often lose their cultural charm, rhythmic anticipation, and kinetic excitement when ported to flat, uninspired browser mini-games.',
        'Simple casual web games frequently suffer from unresponsive tactile feedback, repetitive visual loops, and lack of replay motivation.',
      ],
      approach: [
        'Designed and engineered an arcade-style web game celebrating the Filipino street game with rhythmic anticipation, custom sound effects, vibrant neon-gold styling, and instant tactile feedback.',
        'Implemented state-driven game mechanics tracking score tallies, best win streaks, dynamic rounds, and an unpredictable CPU opponent.',
      ],
      role: 'Game Designer & Frontend Developer — coded core game loop, hand gesture visual animation timing, Web Audio triggers, responsive layout, and Git version control.',
      decisions: [
        {
          title: 'Rhythmic anticipation timing',
          text: 'Synchronized visual hand shakes with the classic 3-beat cadence before revealing choices to capture authentic playground tension.',
        },
        {
          title: 'Zero-dependency pure ES6 architecture',
          text: 'Built the game with clean vanilla JavaScript, standard CSS keyframes, and Web Audio API without bulky game engines, ensuring instant sub-second load times.',
        },
        {
          title: 'Persistent session state & score tracking',
          text: 'Used local storage to preserve personal high scores and consecutive win records across browser sessions.',
        },
      ],
      challenges: [
        'Fine-tuning animation timing and sound synchronization across different browser frame rates to maintain satisfying arcade responsiveness.',
      ],
      prompts: {},
    },
    gallery: [
      {
        caption: 'Bato-Bato Pick retro arcade game title screen and combat arena',
        ratio: '16/9',
        image: {
          src: './images/bato-bato-pick-cover.png',
          alt: 'Bato-Bato Pick Arcade Arena Interface',
        },
      },
      {
        caption: 'In-game battle round showdown with CPU gesture selection and score counter',
        ratio: '16/9',
        image: {
          src: './images/bato-bato-pick-preview.png',
          alt: 'Bato-Bato Pick In-Game Battle Interface',
        },
      },
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
