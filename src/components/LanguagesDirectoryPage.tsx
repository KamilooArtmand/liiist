import React, { useMemo, useState } from 'react';
import { Search, Globe2, Languages as LanguagesIcon, Library, Sparkles } from 'lucide-react';
import { WORLD_LANGUAGES } from '../data/worldLanguagesData';
import { WorldLanguage } from '../types/worldLanguage';

interface LanguagesDirectoryPageProps {
  onSelectLanguage: (language: WorldLanguage) => void;
  onBackToLanding?: () => void;
}

export const LanguagesDirectoryPage: React.FC<LanguagesDirectoryPageProps> = ({
  onSelectLanguage,
  onBackToLanding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLanguages = useMemo(() => {
    return WORLD_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.family.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Search & Header */}
      <section className="px-6 py-4 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition shrink-0"
              title="Return"
            >
              <Globe2 className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </button>
          )}

          <div className="flex-1 max-w-2xl relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search world languages, families, or native names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-100 dark:bg-stone-900 border-none rounded-xl text-sm font-medium text-stone-900 dark:text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shrink-0">
            <LanguagesIcon className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300">
              {filteredLanguages.length} Languages
            </span>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onSelectLanguage(lang)}
              className="group text-left p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all duration-200 flex flex-col gap-3 h-full cursor-pointer relative overflow-hidden"
            >
              {/* Native Script Watermark */}
              <div className="absolute -right-4 -top-6 text-[80px] font-black text-neutral-50 dark:text-neutral-800/30 opacity-50 select-none pointer-events-none transform -rotate-12 group-hover:scale-110 transition-transform duration-500">
                {lang.nativeName.charAt(0)}
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {lang.name}
                  </h3>
                  <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 font-serif mt-1">
                    {lang.nativeName}
                  </p>
                </div>
                <div className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors shrink-0">
                  <Library className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-auto space-y-3 relative z-10 pt-4">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {lang.description}
                </p>
                
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <Sparkles className="w-3 h-3" />
                    {lang.family}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {lang.speakers}M Speakers
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {filteredLanguages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <LanguagesIcon className="w-12 h-12 text-stone-200 dark:text-stone-800" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">No languages found</h3>
            <p className="text-sm text-stone-500">Try searching for another term or family.</p>
          </div>
        )}
      </div>
    </div>
  );
};
