import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CosmicListNode, CosmicItem } from '../types/cosmos';
import { ListGroup } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import {
  Search,
  Sparkles,
  ArrowRight,
  GitBranch,
  X,
  Globe,
  BookOpen,
  MapPin,
  Package,
  Layers,
  CheckCircle2,
  CornerDownLeft
} from 'lucide-react';

interface CapsuleLandingSearchProps {
  cosmicLists: CosmicListNode[];
  personalLists: ListGroup[];
  onOpenCosmicList: (listId: string) => void;
  onOpenPersonalList: (listId: string) => void;
  onExpandNode: (item: CosmicItem, parentTitle: string) => void;
  onSynthesize: (prompt: string) => Promise<void>;
  isSynthesizing: boolean;
  lang: SupportedLanguage;
}

export const CapsuleLandingSearch: React.FC<CapsuleLandingSearchProps> = ({
  cosmicLists,
  personalLists,
  onOpenCosmicList,
  onOpenPersonalList,
  onExpandNode,
  onSynthesize,
  isSynthesizing,
  lang
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang];

  // Hotkey ⌘K / / to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isSynthesizing) return;
    onSynthesize(query.trim());
  };

  // Search results across cosmic lists and items
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches: Array<{
      type: 'cosmic_list' | 'cosmic_item' | 'personal_list';
      title: string;
      subtitle?: string;
      icon?: string;
      id: string;
      itemObj?: CosmicItem;
      parentTitle?: string;
    }> = [];

    // Match Cosmic Lists
    cosmicLists.forEach(cl => {
      if (cl.title.toLowerCase().includes(q) || cl.description.toLowerCase().includes(q)) {
        matches.push({
          type: 'cosmic_list',
          title: cl.title,
          subtitle: `${cl.items.length} nodes cataloged`,
          icon: cl.icon,
          id: cl.id
        });
      }

      // Match Cosmic Items
      cl.items.forEach(item => {
        if (
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.details?.toLowerCase().includes(q) ||
          item.tags.some(tag => tag.toLowerCase().includes(q))
        ) {
          matches.push({
            type: 'cosmic_item',
            title: item.title,
            subtitle: item.subtitle || `${cl.icon} ${cl.title}`,
            id: item.id,
            itemObj: item,
            parentTitle: cl.title
          });
        }
      });
    });

    // Match Personal Lists
    personalLists.forEach(pl => {
      if (pl.title.toLowerCase().includes(q)) {
        matches.push({
          type: 'personal_list',
          title: pl.title,
          subtitle: `Personal Workspace (${pl.items.length} items)`,
          icon: pl.icon,
          id: pl.id
        });
      }
    });

    return matches.slice(0, 10);
  }, [query, cosmicLists, personalLists]);

  const QUICK_SEEDS = [
    { label: t.allBooksTitle, id: 'cosmos-books', icon: '📚' },
    { label: t.allCitiesTitle, id: 'cosmos-cities', icon: '🌍' },
    { label: t.allGoodsTitle, id: 'cosmos-goods', icon: '🛍️' },
    { label: t.allWordsTitle, id: 'cosmos-words', icon: '🔤' },
    { label: t.allScienceTitle, id: 'cosmos-science', icon: '🧬' },
    { label: t.allCultureTitle, id: 'cosmos-culture', icon: '🏛️' }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[82vh] px-4 sm:px-6 relative">
      {/* Background Soft Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-160 h-96 sm:h-160 rounded-full bg-stone-300/30 dark:bg-stone-800/20 blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-6">
        {/* Minimalist Monogram Header */}
        <div className="space-y-2 select-none">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-widest text-stone-950 dark:text-white font-mono uppercase">
            L I I I S T
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
            The Universal Directory of Everything • 100% Autonomous AI
          </p>
        </div>

        {/* The Capsule Search Bar — Central Masterpiece */}
        <div className="w-full relative">
          <form
            onSubmit={handleSubmit}
            className={`w-full capsule-bar px-5 py-3.5 sm:py-4.5 bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 flex items-center gap-3.5 transition-all duration-300 ${
              isFocused ? 'ring-2 ring-black dark:ring-white scale-101' : ''
            }`}
          >
            {/* Search Icon */}
            <Search className="w-5 h-5 text-stone-400 shrink-0" />

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 250)}
              placeholder={t.searchPrompt}
              className="flex-1 bg-transparent text-sm sm:text-base font-medium text-stone-950 dark:text-white placeholder-stone-400 focus:outline-none"
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Submit / Synthesize Button inside the Capsule */}
            <button
              type="submit"
              disabled={isSynthesizing}
              className="p-2 sm:px-4 sm:py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition hover:opacity-90 flex items-center gap-2 shrink-0 shadow-md cursor-pointer disabled:opacity-40"
              title="Search or Synthesize with AI"
            >
              {isSynthesizing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Synthesizing...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {query.trim() ? 'Synthesize' : 'Search'}
                  </span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Category Seeds (Pill / Capsule Bar below search) */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {QUICK_SEEDS.map(seed => (
              <button
                key={seed.id}
                type="button"
                onClick={() => onOpenCosmicList(seed.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-transparent transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{seed.icon}</span>
                <span>{seed.label}</span>
              </button>
            ))}
          </div>

          {/* Live Search & Synthesize Dropdown Drawer */}
          {query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-3 rounded-3xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden z-30 p-2 space-y-1 text-left rtl:text-right animate-in fade-in slide-in-from-top-2 duration-150">
              {/* AI Synthesizer Action Item */}
              <div
                onClick={handleSubmit}
                className="p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black group-hover:bg-stone-800 group-hover:text-white dark:group-hover:bg-stone-200 dark:group-hover:text-black flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      Synthesize "{query}" with Gemini AI
                    </span>
                    <span className="text-[10px] opacity-70">
                      Creates an exhaustive, categorized universal list
                    </span>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>

              {/* Matching Nodes Header */}
              {searchResults.length > 0 && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Catalog Results ({searchResults.length})
                </div>
              )}

              {/* Result Items */}
              {searchResults.map((res, i) => (
                <div
                  key={`${res.id}-${i}`}
                  onClick={() => {
                    if (res.type === 'cosmic_list') {
                      onOpenCosmicList(res.id);
                    } else if (res.type === 'personal_list') {
                      onOpenPersonalList(res.id);
                    } else if (res.type === 'cosmic_item' && res.itemObj && res.parentTitle) {
                      onExpandNode(res.itemObj, res.parentTitle);
                    }
                  }}
                  className="p-3 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800/80 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">{res.icon || '📄'}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {res.title}
                      </h4>
                      {res.subtitle && (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {res.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white rtl:rotate-180 transition shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
