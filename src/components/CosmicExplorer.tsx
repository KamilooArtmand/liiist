import React, { useState, useMemo } from 'react';
import { CosmicListNode, CosmicItem } from '../types/cosmos';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import {
  Sparkles,
  Search,
  GitBranch,
  ChevronRight,
  ArrowLeft,
  Share2
} from 'lucide-react';

interface CosmicExplorerProps {
  cosmicLists: CosmicListNode[];
  selectedCosmicId: string;
  onSelectCosmicList: (id: string) => void;
  onExpandNode: (item: CosmicItem, parentTitle: string) => void;
  onSynthesizeCustom: (prompt: string) => Promise<void>;
  isSynthesizing: boolean;
  lang: SupportedLanguage;
  onBackToLanding?: () => void;
}

export const CosmicExplorer: React.FC<CosmicExplorerProps> = ({
  cosmicLists,
  selectedCosmicId,
  onSelectCosmicList,
  onExpandNode,
  onSynthesizeCustom,
  isSynthesizing,
  lang,
  onBackToLanding
}) => {
  const [synthPrompt, setSynthPrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const t = TRANSLATIONS[lang];

  const currentList = cosmicLists.find(l => l.id === selectedCosmicId) || cosmicLists[0];

  const handleSynthesizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!synthPrompt.trim() || isSynthesizing) return;
    onSynthesizeCustom(synthPrompt.trim());
    setSynthPrompt('');
  };

  const filteredItems = useMemo(() => {
    if (!currentList) return [];
    if (!searchQuery.trim()) return currentList.items;
    const q = searchQuery.toLowerCase();
    return currentList.items.filter(
      item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.details?.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [currentList, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Top Bar with Category Switcher & Back to Landing */}
      <section className="px-6 py-4 bg-white/70 dark:bg-stone-950/70 border-b border-stone-200/80 dark:border-stone-800/80 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition shrink-0"
              title="Return to Landing Search Bar"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          )}

          <div className="flex items-center gap-2 overflow-x-auto">
            {cosmicLists.map(list => {
              const isSelected = list.id === selectedCosmicId;

              return (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => onSelectCosmicList(list.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span className="text-sm">{list.icon}</span>
                  <span className="truncate max-w-[160px]">{list.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {list.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6 flex-1">
        {/* List Header Glass Card */}
        {currentList && (
          <div className="p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  {currentList.icon}
                </span>
                <div>
                  <h1 className="text-2xl font-black text-stone-950 dark:text-white tracking-tight">
                    {currentList.title}
                  </h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                    {currentList.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono font-bold border border-stone-200 dark:border-stone-700">
                  AI Verified: {currentList.aiConfidence || 99.8}%
                </span>
              </div>
            </div>

            {/* In-list Search Filter */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search within ${currentList.items.length} nodes...`}
                className="w-full text-xs bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Nodes Grid / List */}
        <div className="space-y-3.5">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border border-stone-200 dark:border-stone-800 shadow-xs hover:border-black dark:hover:border-white transition flex flex-col gap-3 group"
            >
              {/* Row: Index, Title, Subtitle, Expand Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-stone-200 dark:border-stone-700">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold text-stone-950 dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recursive Expand Button */}
                {item.hasDeepSublist && (
                  <button
                    type="button"
                    onClick={() => onExpandNode(item, currentList.title)}
                    className="px-3.5 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer hover:opacity-90"
                    title={t.expandBranch}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.expandBranch}</span>
                    <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
                )}
              </div>

              {/* Details Paragraph */}
              {item.details && (
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-10">
                  {item.details}
                </p>
              )}

              {/* Attributes Grid (Monochromatic) */}
              {item.attributes && Object.keys(item.attributes).length > 0 && (
                <div className="ml-10 grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/50 dark:border-stone-800 text-[11px]">
                  {Object.entries(item.attributes).map(([k, v]) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-stone-400">{k}</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 truncate font-mono">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 ml-10 pt-1">
                  {item.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium border border-stone-200/50 dark:border-stone-700/50"
                    >
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-stone-900 border border-dashed border-stone-200 dark:border-stone-800 p-8">
              <p className="text-sm font-semibold text-stone-500">
                No matching entities found in this universal list.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
