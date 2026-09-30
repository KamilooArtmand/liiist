import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  TrendingUp, 
  Heart, 
  Star, 
  Eye, 
  Filter,
  Film,
  Cpu,
  Globe2,
  Trophy,
  History,
  LineChart,
  ChevronRight
} from 'lucide-react';

type SortOption = 'newest' | 'views' | 'likes' | 'editor';

interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  colorClass: string;
  size: 'small' | 'wide' | 'tall' | 'large';
  type: 'video' | 'timeline' | 'article';
  views: number;
  likes: number;
  isEditorChoice: boolean;
  date: string;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: 'movies-100',
    title: 'Top 100 Movies of History',
    subtitle: 'From 1900 to 2026: A visual journey through cinema',
    category: 'Culture & Art',
    icon: <Film className="w-6 h-6" />,
    colorClass: 'from-rose-500/10',
    size: 'large',
    type: 'video',
    views: 1250000,
    likes: 45000,
    isEditorChoice: true,
    date: '2026-09-28',
  },
  {
    id: 'ai-evolution',
    title: 'The Evolution of AI',
    subtitle: '1950 - 2026: From Turing to AGI',
    category: 'Technology',
    icon: <Cpu className="w-5 h-5" />,
    colorClass: 'from-indigo-500/10',
    size: 'tall',
    type: 'timeline',
    views: 890000,
    likes: 32000,
    isEditorChoice: true,
    date: '2026-09-29',
  },
  {
    id: 'ww2-timeline',
    title: 'World War II Timeline',
    subtitle: 'Day by day breakdown of the global conflict',
    category: 'History',
    icon: <History className="w-5 h-5" />,
    colorClass: 'from-orange-500/10',
    size: 'wide',
    type: 'timeline',
    views: 450000,
    likes: 12000,
    isEditorChoice: false,
    date: '2026-09-20',
  },
  {
    id: 'global-economy',
    title: 'Global Economy 2026',
    subtitle: 'Market shifts, crypto, and emerging powers',
    category: 'Economy',
    icon: <LineChart className="w-5 h-5" />,
    colorClass: 'from-emerald-500/10',
    size: 'small',
    type: 'article',
    views: 210000,
    likes: 5400,
    isEditorChoice: false,
    date: '2026-09-30',
  },
  {
    id: 'olympic-records',
    title: 'The Olympic Records',
    subtitle: 'Unbreakable human achievements in sports',
    category: 'Sports',
    icon: <Trophy className="w-5 h-5" />,
    colorClass: 'from-amber-500/10',
    size: 'small',
    type: 'video',
    views: 670000,
    likes: 18000,
    isEditorChoice: true,
    date: '2026-08-15',
  },
  {
    id: 'deep-space',
    title: 'Deep Space Discoveries',
    subtitle: 'James Webb & beyond: Mapping the cosmos',
    category: 'Science',
    icon: <Globe2 className="w-5 h-5" />,
    colorClass: 'from-purple-500/10',
    size: 'wide',
    type: 'video',
    views: 1100000,
    likes: 55000,
    isEditorChoice: true,
    date: '2026-09-25',
  }
];

interface ExploreFeedPageProps {
  onOpenMoviesTimeline: () => void;
}

export const ExploreFeedPage: React.FC<ExploreFeedPageProps> = ({ onOpenMoviesTimeline }) => {
  const [sortBy, setSortBy] = useState<SortOption>('editor');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const sortedItems = [...FEED_ITEMS].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'views': return b.views - a.views;
      case 'likes': return b.likes - a.likes;
      case 'editor': return (b.isEditorChoice ? 1 : 0) - (a.isEditorChoice ? 1 : 0);
      default: return 0;
    }
  });

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ── Header & Sorting ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-950 dark:text-white tracking-tight">
            Explore
          </h1>
          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 mt-2">
            Trending timelines, topics, and editorial picks
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Sort by: {sortBy}
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                {[
                  { id: 'editor', label: "Editor's Choice", icon: <Star className="w-3.5 h-3.5" /> },
                  { id: 'newest', label: "Newest First", icon: <Clock className="w-3.5 h-3.5" /> },
                  { id: 'views', label: "Most Viewed", icon: <Eye className="w-3.5 h-3.5" /> },
                  { id: 'likes', label: "Most Liked", icon: <Heart className="w-3.5 h-3.5" /> }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortBy(opt.id as SortOption); setIsSortOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      sortBy === opt.id 
                        ? 'bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white' 
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[280px] gap-4 sm:gap-6">
        {sortedItems.map(item => {
          // Determine spanning based on size
          let spanClasses = '';
          switch(item.size) {
            case 'large': spanClasses = 'md:col-span-2 md:row-span-2'; break;
            case 'wide': spanClasses = 'md:col-span-2 md:row-span-1'; break;
            case 'tall': spanClasses = 'md:col-span-1 md:row-span-2'; break;
            case 'small': spanClasses = 'md:col-span-1 md:row-span-1'; break;
          }

          return (
            <button
              key={item.id}
              className={`group relative text-left bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[24px] overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 flex flex-col cursor-pointer ${spanClasses}`}
            >
              {/* Soft Watercolor Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.colorClass} to-transparent opacity-50 dark:opacity-20 pointer-events-none transition-opacity group-hover:opacity-100 dark:group-hover:opacity-40`} />

              {/* Card Content Layout */}
              <div className="relative z-10 flex flex-col h-full p-6">
                
                {/* Top: Category & Editor Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-black/50 border border-neutral-200/50 dark:border-neutral-800/50 text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 backdrop-blur-md">
                    {item.category}
                  </span>
                  
                  {item.isEditorChoice && (
                    <span title="Editor's Choice" className="text-amber-500 shrink-0 bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                {/* Middle: Title & Subtitle */}
                <div className="flex-1 flex flex-col justify-center">
                  {item.size === 'large' && (
                    <div className="mb-6 transform group-hover:scale-105 transition-transform duration-500 origin-left">
                      <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                        <Play className="w-8 h-8 ml-1 fill-current" />
                      </div>
                    </div>
                  )}

                  <h3 className={`font-black text-neutral-950 dark:text-white tracking-tight leading-none mb-3 ${
                    item.size === 'large' ? 'text-4xl lg:text-5xl' : 
                    item.size === 'wide' ? 'text-2xl lg:text-3xl' : 
                    'text-xl lg:text-2xl'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`font-serif text-neutral-600 dark:text-neutral-400 leading-snug ${
                    item.size === 'large' ? 'text-lg lg:text-xl max-w-md' : 'text-sm'
                  }`}>
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom: Stats & Type */}
                <div className="mt-6 pt-4 border-t border-neutral-950/5 dark:border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {formatNumber(item.views)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      {formatNumber(item.likes)}
                    </span>
                  </div>
                  
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    {item.type === 'video' ? <Play className="w-3.5 h-3.5 ml-0.5 fill-current" /> :
                     item.type === 'timeline' ? <TrendingUp className="w-3.5 h-3.5" /> :
                     <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                </div>

              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
