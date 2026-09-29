import { ListGroup } from '../types';

export const INITIAL_LISTS: ListGroup[] = [
  {
    id: 'list-1',
    title: 'Daily Sprint & Focus',
    description: 'High-impact tasks, engineering tickets, and daily goals',
    type: 'todo',
    color: 'amber',
    icon: '⚡',
    favorite: true,
    sortOrder: 'priority',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-101',
        title: 'Review pull request & approve migration pipeline',
        completed: false,
        priority: 'p1',
        dueDate: new Date().toISOString().split('T')[0],
        tags: ['Engineering', 'Code Review'],
        notes: 'Check Docker container constraints and test local build output.',
        subtasks: [
          { id: 'sub-1', title: 'Verify package dependencies', completed: true },
          { id: 'sub-2', title: 'Run linter and test suite', completed: false },
          { id: 'sub-3', title: 'Leave inline architectural feedback', completed: false }
        ],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'item-102',
        title: 'Design high-fidelity UI states for Liiist app',
        completed: true,
        priority: 'p2',
        dueDate: new Date().toISOString().split('T')[0],
        tags: ['Design', 'UI/UX'],
        notes: 'Ensure clean typography, warm accents, and responsive layout across desktop and mobile.',
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        completedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'item-103',
        title: 'Schedule team retrospective & coffee sync',
        completed: false,
        priority: 'p3',
        tags: ['Team', 'Sync'],
        notes: 'Book a 30-min slot for Friday morning with team leads.',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'item-104',
        title: 'Hydrate (2L water) & take a 15-minute sunshine walk',
        completed: true,
        priority: 'p4',
        tags: ['Health', 'Habit'],
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        completedAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'list-2',
    title: 'Top Sci-Fi Masterpieces',
    description: 'Personal all-time ranked cinema favorites with ratings & critique notes',
    type: 'ranked',
    color: 'violet',
    icon: '🎬',
    favorite: true,
    sortOrder: 'rank',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-201',
        title: 'Blade Runner 2049 (2017)',
        completed: true,
        priority: 'p1',
        rank: 1,
        score: 9.8,
        tags: ['Cinema', 'Cyberpunk'],
        notes: 'Directed by Denis Villeneuve. Cinematography by Roger Deakins is peak craft. Haunting philosophical exploration of what makes us human.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'item-202',
        title: 'Interstellar (2014)',
        completed: true,
        priority: 'p1',
        rank: 2,
        score: 9.6,
        tags: ['Cinema', 'Space'],
        notes: 'Christopher Nolan directing, Hans Zimmer legendary pipe organ score. Emotional core grounded in time dilation and love.',
        createdAt: new Date(Date.now() - 3600000 * 23).toISOString()
      },
      {
        id: 'item-203',
        title: 'The Matrix (1999)',
        completed: true,
        priority: 'p2',
        rank: 3,
        score: 9.5,
        tags: ['Cinema', 'Action'],
        notes: 'The Wachowskis redefined action cinema forever. Bullet time, philosophical allegory, iconic pacing.',
        createdAt: new Date(Date.now() - 3600000 * 22).toISOString()
      },
      {
        id: 'item-204',
        title: 'Arrival (2016)',
        completed: true,
        priority: 'p2',
        rank: 4,
        score: 9.4,
        tags: ['Cinema', 'Linguistics'],
        notes: 'Ted Chiang adaptation exploring the Sapir-Whorf hypothesis and non-linear perception of grief and joy.',
        createdAt: new Date(Date.now() - 3600000 * 21).toISOString()
      },
      {
        id: 'item-205',
        title: '2001: A Space Odyssey (1968)',
        completed: false,
        priority: 'p3',
        rank: 5,
        score: 9.3,
        tags: ['Cinema', 'Classic'],
        notes: 'Stanley Kubrick milestone. Planned for re-watch in 70mm theater.',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  },
  {
    id: 'list-3',
    title: 'Weekend Farmer’s Market',
    description: 'Fresh ingredients, bakery specials, and artisan pantry staples',
    type: 'shopping',
    color: 'emerald',
    icon: '🥑',
    favorite: false,
    sortOrder: 'alphabetical',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-301',
        title: 'Artisan Sourdough Batard',
        completed: false,
        priority: 'p2',
        category: 'Bakery',
        quantity: '1 loaf (fresh baked)',
        tags: ['Fresh', 'Bakery'],
        notes: 'Get from the crusty corner sourdough stall before 11 AM.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-302',
        title: 'Ripe Hass Avocados',
        completed: true,
        priority: 'p2',
        category: 'Produce',
        quantity: '4 medium',
        tags: ['Produce', 'Organic'],
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      {
        id: 'item-303',
        title: 'Heirloom Vine Tomatoes',
        completed: false,
        priority: 'p2',
        category: 'Produce',
        quantity: '1 kg',
        tags: ['Produce'],
        notes: 'Look for deep crimson and striped varieties for caprese salad.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-304',
        title: 'Fresh Basil & Mint Bundle',
        completed: false,
        priority: 'p3',
        category: 'Produce',
        quantity: '2 bunches',
        tags: ['Herbs'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-305',
        title: 'Cold-Pressed Extra Virgin Olive Oil',
        completed: false,
        priority: 'p1',
        category: 'Pantry',
        quantity: '500ml glass bottle',
        tags: ['Pantry'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-306',
        title: 'Oat Milk Barista Edition',
        completed: true,
        priority: 'p3',
        category: 'Dairy & Alternatives',
        quantity: '2 cartons',
        tags: ['Beverage'],
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'list-4',
    title: 'Life Bucket List & Expeditions',
    description: 'Lifelong adventures, summits, creative aspirations and milestones',
    type: 'bucket',
    color: 'cyan',
    icon: '🧭',
    favorite: true,
    sortOrder: 'manual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-401',
        title: 'Witness Aurora Borealis from a glass igloo in Tromsø',
        completed: false,
        priority: 'p1',
        dueDate: '2027-12-21',
        tags: ['Travel', 'Nordic', 'Nature'],
        notes: 'Target winter solstice. Pack thermal base layers and camera tripod.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-402',
        title: 'Hike the Tour du Mont Blanc (170km alpine loop)',
        completed: false,
        priority: 'p2',
        dueDate: '2026-08-15',
        tags: ['Adventure', 'Trek'],
        notes: 'Book mountain refuges 6 months in advance.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'item-403',
        title: 'Build and ship an open-source project used by 10,000+ developers',
        completed: true,
        priority: 'p2',
        tags: ['Milestone', 'Code'],
        notes: 'Reached milestone with great community adoption and contributors.',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      {
        id: 'item-404',
        title: 'Master espresso extraction & latte art (rosetta pour)',
        completed: false,
        priority: 'p3',
        tags: ['Craft', 'Coffee'],
        notes: 'Dial in 18g in, 36g out in 28 seconds consistently.',
        createdAt: new Date().toISOString()
      }
    ]
  }
];
