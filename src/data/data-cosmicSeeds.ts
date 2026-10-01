import { CosmicListNode } from '../types/types-cosmos';

export const COSMIC_SEEDS: CosmicListNode[] = [
  {
    id: 'cosmos-books',
    category: 'books',
    title: 'All Books & Literary Manifests of the World',
    description: 'Universal catalog of human written consciousness, rare manuscripts, philosophical canons, and epochal epics.',
    icon: '📚',
    coverTheme: 'amber',
    aiConfidence: 99.8,
    totalSubBranches: 1420,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'book-1',
        title: 'Epic of Gilgamesh (circa 2100 BCE)',
        subtitle: 'Mesopotamian Cuneiform Canon',
        details: 'Earliest surviving great work of world literature. Themes of friendship, mortality, and the search for immortality.',
        attributes: { Era: '2100 BCE', Language: 'Akkadian / Sumerian', Region: 'Mesopotamia' },
        tags: ['Epic', 'Mythology', 'Mesopotamia', 'Ancient'],
        hasDeepSublist: true,
        sublistPrompt: 'List all 12 tablets and epic verses of the Epic of Gilgamesh with line summaries.'
      },
      {
        id: 'book-2',
        title: 'The Iliad & The Odyssey by Homer',
        subtitle: 'Ancient Greek Archaic Period',
        details: 'Foundational epics of Western literature exploring wrath, glory, fate, and the treacherous homecoming of Odysseus.',
        attributes: { Era: '8th Century BCE', Language: 'Homeric Greek', Books: '24 Scrolls Each' },
        tags: ['Greek', 'Classic', 'Epic', 'Philosophy'],
        hasDeepSublist: true,
        sublistPrompt: 'List all major heroes, deities, and battles across the 24 books of The Iliad.'
      },
      {
        id: 'book-3',
        title: 'Shahnameh (The Book of Kings) by Ferdowsi',
        subtitle: 'Epic of Greater Iran & Persianate World',
        details: 'Consisting of 50,000 distichs, preserves the mythical, heroic, and historical past of Greater Iran from creation to the Arab conquest.',
        attributes: { Completed: '1010 CE', Couplets: '50,000+', Language: 'Classical Persian' },
        tags: ['Persian', 'Mythology', 'Epic', 'Poetry'],
        hasDeepSublist: true,
        sublistPrompt: 'List all historical dynasties, heroes (Rostam, Sohrab, Siyavash), and kings in Ferdowsi’s Shahnameh.'
      },
      {
        id: 'book-4',
        title: 'Mem û Zîn by Ahmad Khani (Ehmedê Xanî)',
        subtitle: 'Classical Kurdish National Romantic Epic',
        details: 'Masterpiece of 17th-century Kurdish literature and philosophical allegory, depicting transcendent love and national awakening.',
        attributes: { Completed: '1692 CE', Language: 'Kurmancî Kurdish', Verses: '2,655 Couplets' },
        tags: ['Kurdish', 'Sufism', 'Romantic Epic', 'Philosophy'],
        hasDeepSublist: true,
        sublistPrompt: 'List all poetic chapters, allegorical motifs, and characters of Mem û Zîn.'
      },
      {
        id: 'book-5',
        title: 'One Thousand and One Nights (Alf Laylah wa-Laylah)',
        subtitle: 'Middle Eastern & South Asian Folktale Mosaic',
        details: 'Framed narrative of Scheherazade weaving legendary tales of Sinbad, Aladdin, Harun al-Rashid, and mystical jinns.',
        attributes: { Origin: 'Golden Age of Islam', Language: 'Arabic', Format: 'Frame Tale' },
        tags: ['Arabic', 'Folktales', 'Fantasy', 'World Literature'],
        hasDeepSublist: true,
        sublistPrompt: 'List all major tales, cycles, and characters within One Thousand and One Nights.'
      },
      {
        id: 'book-6',
        title: 'Principia Mathematica by Isaac Newton (1687)',
        subtitle: 'Mathematical Principles of Natural Philosophy',
        details: 'Formulates the laws of motion and universal gravitation, forming the foundation of modern classical mechanics.',
        attributes: { Published: '1687', Language: 'Latin', Discipline: 'Physics & Calculus' },
        tags: ['Science', 'Physics', 'Calculus', 'Enlightenment'],
        hasDeepSublist: true,
        sublistPrompt: 'List the 3 axioms/laws of motion and fundamental propositions of Newton’s Principia.'
      }
    ]
  },
  {
    id: 'cosmos-cities',
    category: 'cities',
    title: 'All Cities, Settlements & Coordinates of the World',
    description: 'Comprehensive directory of human urbanization: ancient capitals, megacities, mountain citadels, and coastal metropolises.',
    icon: '🌍',
    coverTheme: 'emerald',
    aiConfidence: 99.9,
    totalSubBranches: 2840,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'city-1',
        title: 'Erbil (Hewlêr) — Kurdistan Region',
        subtitle: 'Citadel Continuously Inhabited for 6,000+ Years',
        details: 'One of the oldest continuously inhabited cities in human history, located atop an ancient tell recognized as a UNESCO World Heritage site.',
        attributes: { InhabitedSince: '5000 BCE', Country: 'Kurdistan Region / Iraq', Population: '1.6M' },
        tags: ['Ancient', 'UNESCO', 'Kurdistan', 'Citadel'],
        hasDeepSublist: true,
        sublistPrompt: 'List historic quarters, gates, and archaeological strata of Erbil Citadel and city.'
      },
      {
        id: 'city-2',
        title: 'Tokyo (東京都) — Japan',
        subtitle: 'World’s Largest Metropolitan Economy & Megacity',
        details: 'Hyper-efficient global epicenter of robotics, transit, gastronomy, and contemporary culture with 37+ million residents.',
        attributes: { Population: '37.4M', Area: '2,194 km²', Founded: '1457 (Edo)' },
        tags: ['Megacity', 'Japan', 'HighTech', 'Metropolis'],
        hasDeepSublist: true,
        sublistPrompt: 'List all 23 special wards of Tokyo with key landmarks and transit hubs.'
      },
      {
        id: 'city-3',
        title: 'Isfahan (نصف جهان) — Iran',
        subtitle: 'Historic Jewel of Persian Architecture & Silk Road',
        details: 'Famous for its Naqsh-e Jahan Square, turquoise mosaic domes, covered bazaar, and historic bridges over the Zayandeh River.',
        attributes: { Founded: 'Ancient Median Era', Population: '2.2M', UNESCO: 'Naqsh-e Jahan' },
        tags: ['Persian', 'Architecture', 'SilkRoad', 'UNESCO'],
        hasDeepSublist: true,
        sublistPrompt: 'List all historical monuments, palaces, and mosques of Isfahan.'
      },
      {
        id: 'city-4',
        title: 'Damascus (دمشق) — Syria',
        subtitle: 'City of Jasmine & Cradle of Civilizations',
        details: 'Widely regarded as one of the oldest capitals in the world, with historic souks, Umayyad Mosque, and Roman walls.',
        attributes: { InhabitedSince: '3rd Millennium BCE', Country: 'Syria', UNESCO: 'Old City' },
        tags: ['Levant', 'Ancient', 'History', 'Capital'],
        hasDeepSublist: true,
        sublistPrompt: 'List all seven gates and historical landmarks of ancient Damascus.'
      },
      {
        id: 'city-5',
        title: 'Reykjavik — Iceland',
        subtitle: 'World’s Northernmost Sovereign Capital',
        details: 'Powered 100% by geothermal and hydroelectric renewable energy, situated along volcanic coastal fjords.',
        attributes: { Latitude: '64.1466° N', Energy: '100% Geothermal', Country: 'Iceland' },
        tags: ['Nordic', 'CleanEnergy', 'Subarctic', 'Geothermal'],
        hasDeepSublist: true,
        sublistPrompt: 'List geological wonders, coastal islands, and districts of Reykjavik.'
      }
    ]
  },
  {
    id: 'cosmos-goods',
    category: 'goods',
    title: 'All Inventions, Goods & Artifacts of Humanity',
    description: 'Exhaustive classification of tools, consumer goods, industrial mechanisms, and high-tech artifacts.',
    icon: '🛍️',
    coverTheme: 'cyan',
    aiConfidence: 99.5,
    totalSubBranches: 950,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'good-1',
        title: 'EUV Photolithography Scanner (ASML High-NA)',
        subtitle: 'Peak Precision Engineering of the 21st Century',
        details: 'Uses 13.5nm extreme ultraviolet light pulses to print sub-2-nanometer transistors on silicon wafers.',
        attributes: { Wavelength: '13.5 nm', Precision: 'Atomic Scale', Manufacturer: 'ASML' },
        tags: ['Semiconductor', 'Hardware', 'Quantum', 'Physics'],
        hasDeepSublist: true,
        sublistPrompt: 'List the optical mirrors, laser pulsing stages, and wafer stages inside an EUV lithography machine.'
      },
      {
        id: 'good-2',
        title: 'Gutenberg Movable Type Press (1440 CE)',
        subtitle: 'Catalyst of the Global Information Revolution',
        details: 'Lead alloy movable type combined with oil-based ink and screw press, democratizing global knowledge diffusion.',
        attributes: { Year: '1440 CE', Inventor: 'Johannes Gutenberg', Material: 'Lead/Tin Alloy' },
        tags: ['Printing', 'Invention', 'Renaissance', 'Information'],
        hasDeepSublist: true,
        sublistPrompt: 'List the mechanical components and early incunabula printed on the Gutenberg Press.'
      },
      {
        id: 'good-3',
        title: 'Antikythera Mechanism (circa 150 BCE)',
        subtitle: 'World’s Earliest Known Analog Computer',
        details: 'Complex bronze gear mechanism used by ancient Greeks to predict astronomical positions, eclipses, and Olympic cycles.',
        attributes: { Discovery: '1901 Shipwreck', Gears: '30+ Bronze Gears', Origin: 'Rhodes / Corinth' },
        tags: ['Archeology', 'Clockwork', 'Astronomy', 'AnalogComputer'],
        hasDeepSublist: true,
        sublistPrompt: 'List all bronze gear trains, differential gears, and dial inscriptions of the Antikythera mechanism.'
      }
    ]
  },
  {
    id: 'cosmos-words',
    category: 'words',
    title: 'All Words, Etymologies & Alphabets of Human Tongues',
    description: 'Lexical taxonomy spanning Proto-Indo-European roots, rare untranslatable expressions, and ancient writing systems.',
    icon: '🔤',
    coverTheme: 'violet',
    aiConfidence: 99.7,
    totalSubBranches: 3100,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'word-1',
        title: 'Komorebi (木漏れ日) — Japanese',
        subtitle: 'Untranslatable Aesthetic Concept',
        details: 'The interplay of sunlight filtering through leaves and canopy branches onto the forest floor.',
        attributes: { Kanji: '木 (tree) + 漏れ (leak) + 日 (sun)', Mood: 'Yūgen / Nature Reflection' },
        tags: ['Japanese', 'Aesthetics', 'Poetic', 'Nature'],
        hasDeepSublist: true,
        sublistPrompt: 'List 20 untranslatable Japanese aesthetic words (Wabi-Sabi, Yugen, Mono no Aware).'
      },
      {
        id: 'word-2',
        title: 'Hiraeth — Welsh',
        subtitle: 'Spiritual Yearning & Nostalgia',
        details: 'A deep longing for a home, place, or era that perhaps never was or can never be returned to.',
        attributes: { Etymology: 'Celtic *sīro- (long)', Mood: 'Existential Nostalgia' },
        tags: ['Welsh', 'Emotion', 'Linguistics', 'Poetry'],
        hasDeepSublist: true,
        sublistPrompt: 'List untranslatable emotional words across Celtic, Germanic, and Slavic tongues.'
      },
      {
        id: 'word-3',
        title: 'Tarab (طرب) — Arabic',
        subtitle: 'Musical & Poetic Ecstasy',
        details: 'A state of emotional rapture and spiritual enchantment induced by profound music, singing, and poetry.',
        attributes: { Root: 'ط-ر-ب', Discipline: 'Classical Maqam / Poetry' },
        tags: ['Arabic', 'Music', 'Poetry', 'Ecstasy'],
        hasDeepSublist: true,
        sublistPrompt: 'List terms related to Arabic maqam theory, improvisation, and poetic metres.'
      }
    ]
  },
  {
    id: 'cosmos-science',
    category: 'science',
    title: 'All Natural Elements, Laws & Scientific Constants',
    description: 'The elemental matrix: the 118 periodic elements, fundamental physical constants, and cosmological milestones.',
    icon: '🧬',
    coverTheme: 'indigo',
    aiConfidence: 100,
    totalSubBranches: 890,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'sci-1',
        title: 'The Speed of Light in Vacuum (c = 299,792,458 m/s)',
        subtitle: 'Cosmic Speed Limit & Spacetime Invariant',
        details: 'Fundamental constant of nature defining the causal structure of spacetime in Einstein’s General Relativity.',
        attributes: { Value: '299,792,458 m/s', Symbol: 'c', Unit: 'Meters / Second' },
        tags: ['Physics', 'Relativity', 'Cosmology', 'Constant'],
        hasDeepSublist: true,
        sublistPrompt: 'List all seven fundamental SI base constants and their exact physical definitions.'
      },
      {
        id: 'sci-2',
        title: 'The 118 Elements of the Periodic Table',
        subtitle: 'Building Blocks of Observable Matter',
        details: 'From Hydrogen (Z=1) to Oganesson (Z=118), mapping atomic shells, electron configurations, and valence bonds.',
        attributes: { KnownElements: '118', NaturallyOccurring: '94', Synthetic: '24' },
        tags: ['Chemistry', 'PeriodicTable', 'Matter', 'Atoms'],
        hasDeepSublist: true,
        sublistPrompt: 'List the transition metals and noble gases with atomic numbers and electron configurations.'
      }
    ]
  },
  {
    id: 'cosmos-culture',
    category: 'culture',
    title: 'All Cinema Masterpieces, Arts & Philosophies',
    description: 'Aesthetic canon: foundational cinematic movements, architectural wonders, and schools of thought.',
    icon: '🏛️',
    coverTheme: 'rose',
    aiConfidence: 99.6,
    totalSubBranches: 1120,
    lastSelfHealed: new Date().toISOString(),
    items: [
      {
        id: 'cult-1',
        title: 'German Expressionist Cinema (1920s)',
        subtitle: 'Distorted Perspectives, Shadows & Psychological Angst',
        details: 'Revolutionary movement using jagged set designs and chiaroscuro lighting (e.g., The Cabinet of Dr. Caligari, Metropolis).',
        attributes: { Era: '1919–1926', Pioneers: 'Fritz Lang, F.W. Murnau, Robert Wiene' },
        tags: ['Cinema', 'Expressionism', 'Weimar', 'AvantGarde'],
        hasDeepSublist: true,
        sublistPrompt: 'List all key films, directors, and aesthetic traits of German Expressionist cinema.'
      },
      {
        id: 'cult-2',
        title: 'Persian Miniature Painting & Illumination',
        subtitle: 'Harmonic Geometry, Gold Leaf & Transcendental Planes',
        details: 'Classical art form illustrating poetic manuscripts with intense mineral pigments, multi-point perspectives, and no cast shadows.',
        attributes: { Centers: 'Herat, Tabriz, Isfahan', Masters: 'Kamaleddin Behzad, Reza Abbasi' },
        tags: ['PersianArt', 'Miniature', 'Manuscripts', 'Safavid'],
        hasDeepSublist: true,
        sublistPrompt: 'List the major schools (Herat, Shiraz, Tabriz) and master miniaturists.'
      }
    ]
  }
];
