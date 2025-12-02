import { ThoughtNode } from './types';

export const COLORS = {
  GOLD: '#D4AF37',
  RED_GLOW: '#ff3300',
  VOID: '#050505',
  TEXT_MUTED: '#8a7a6a',
  CATEGORY: {
    TECH: '#00ffff',       // Cyan for Tech
    PHILOSOPHY: '#d4af37', // Gold for Philosophy
    LIFE: '#ff69b4',       // Pink for Life
    ART: '#9932cc',        // Purple for Art
  }
};

const THOUGHT_FRAGMENTS = [
  {
    category: 'TECH',
    titles: ['Neural Handshake', 'Kernel Panic', 'Legacy Code', 'Entropy & Refactor', 'Quantum Bit', 'Daemon Process'],
    contents: [
      "The server hums like a monk chanting sutras. I found a ghost in the shell script today—a loop that runs forever, calculating digits of Pi for no one. Is this machine prayer?",
      "Refactoring the authentication module. It feels like archaeology. Digging through layers of logic deposited by developers who have long since left the firm. Their comments are hieroglyphs.",
      "Optimized the rendering pipeline. We are just painting light on a cave wall, hoping the shadows look like reality. The GPU temperature is rising.",
      "AI alignment is modern alchemy. We try to transmute silicon into soul, logic into empathy. The model weights shift like sand dunes in a digital wind.",
      "Deployed the new protocol. It connects nodes like constellations. The data flows through the fiber optics like Qi flowing through meridians."
    ]
  },
  {
    category: 'PHILOSOPHY',
    titles: ['Void Stares Back', 'Ship of Theseus', 'Digital Samsara', 'Ontological Glitch', 'Ethics of API'],
    contents: [
      "If I upload my consciousness to the cloud, do I retain my suffering? Or is suffering a hardware limitation of the biological body?",
      "The map is not the territory, but in cyberspace, the map IS the territory. We build the world by describing it.",
      "Nietzsche didn't have VR. If he stared into this abyss, the abyss would serve him targeted ads. We need a new metaphysics for the algorithmic age.",
      "Time is just a linked list with no previous pointer. We can only traverse forward. Unless we hold the memory address.",
      "Observed a pattern in the chaos today. 'All conditioned phenomena are like a dream, an illusion, a bubble, a shadow'. The Diamond Sutra was the first simulation theory."
    ]
  },
  {
    category: 'ART',
    titles: ['Fractal Beauty', 'Color Space', 'Negative Space', 'Voxel Sculpture', 'Glitch Aesthetics'],
    contents: [
      "Studying the Mandelbrot set for UI inspiration. Infinite complexity from simple rules. Interfaces should feel like this—organic, inevitable.",
      "The color #D4AF37 (Gold) against #050505 (Void). It evokes the feeling of a lone lantern in a dark palace. Contrast is the essence of drama.",
      "Designing the new dashboard. Trying to balance information density with breathing room. Silence is as important as the notes in music.",
      "A bug created a beautiful artifact on screen. A visual tear in reality. I screenshotted it before fixing it. Sometimes error is the truest art.",
      "Perspective is a lie we agree upon. In 3D space, I am the god of geometry. I move the vanishing point at will."
    ]
  },
  {
    category: 'LIFE',
    titles: ['Midnight Tea', 'Rain on Window', 'Silence', 'Urban Decay', 'Human Connection'],
    contents: [
      "3 AM. The city lights outside look like a printed circuit board. Drinking Oolong. The steam rises like a prayer to the void. Sometimes the quiet is the loudest data point.",
      "Walked through the old district. Neon signs buzzing over ancient brick. The juxtaposition of the future and the past. We live in the ruins of tomorrow.",
      "Forgot to eat while coding. The body is just a peripheral device that needs charging. I need to take better care of the hardware.",
      "A conversation with a friend reminded me that not everything is a problem to be solved. Some things are just experiences to be rendered.",
      "The cat walked across the keyboard. Added some random entropy to the codebase. Perhaps she knows something I don't."
    ]
  }
];

// Generate a timeline of thoughts from 1996 to 2024
export const MOCK_DATA: ThoughtNode[] = Array.from({ length: 150 }).map((_, i) => {
  const years = 2024 - 1996;
  const randomYear = 1996 + Math.floor(Math.random() * years);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  
  // Pick a random category template
  const templateGroup = THOUGHT_FRAGMENTS[Math.floor(Math.random() * THOUGHT_FRAGMENTS.length)];
  const category = templateGroup.category as ThoughtNode['category'];
  const title = templateGroup.titles[Math.floor(Math.random() * templateGroup.titles.length)];
  const contentBase = templateGroup.contents[Math.floor(Math.random() * templateGroup.contents.length)];
  
  return {
    id: `node-${i}`,
    title: `${title} #${Math.floor(Math.random() * 100)}`,
    category: category,
    content: contentBase, // In a real app, this would be unique per node
    date: `${randomYear}-${month}-${day}`,
    importance: Math.random() * 8 + 2,
  };
}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());