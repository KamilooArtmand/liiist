import React, { useState } from 'react';
import { StateInfo } from '../types/hierarchy';
import { ALL_50_US_STATES } from '../data/usStatesData';
import { CapsuleBreadcrumb, BreadcrumbSegment } from './CapsuleBreadcrumb';
import { WikipediaIndexPanel } from './WikipediaIndexPanel';
import { USStateFlag } from './USStateFlag';
import { US_STATE_COVERS } from '../data/usStateCovers';
import {
  Building2,
  Users,
  Maximize2,
  Calendar,
  Coins,
  ChevronRight,
  Search,
  ArrowUpDown,
  Filter,
  Layers,
  MapPin,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface StatesDirectoryPageProps {
  countryName?: string;
  onSelectState: (state: StateInfo) => void;
  onBackToCountry: () => void;
  onBackToWorldOverview: () => void;
  onGoHome: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const StatesDirectoryPage: React.FC<StatesDirectoryPageProps> = ({
  countryName = 'United States',
  onSelectState,
  onBackToCountry,
  onBackToWorldOverview,
  onGoHome,
  isBookmarked,
  onToggleBookmark
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'population' | 'area' | 'admission'>('alpha');

  const filteredStates = ALL_50_US_STATES.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.capital.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name);
    if (sortBy === 'population') return b.population - a.population;
    if (sortBy === 'area') return b.areaKm2 - a.areaKm2;
    if (sortBy === 'admission') return a.admissionYear - b.admissionYear;
    return 0;
  });

  // 3-Tone Hierarchical Breadcrumbs:
  // Ancestors (Medium) -> Current States Directory (Bold High-contrast) -> Subdivisions: County / City / Town / Village (Faded)
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: 'liii.st', onClick: onGoHome, hierarchyTone: 'ancestor' },
    { label: 'World', onClick: onBackToWorldOverview, hierarchyTone: 'ancestor' },
    { label: 'Country', onClick: onBackToCountry, hierarchyTone: 'ancestor' },
    { label: countryName, onClick: onBackToCountry, hierarchyTone: 'ancestor' },
    { label: 'States', isCurrent: true, hierarchyTone: 'current' },
    { label: 'County', hierarchyTone: 'subdivision' },
    { label: 'City', hierarchyTone: 'subdivision' },
    { label: 'Town', hierarchyTone: 'subdivision' },
    { label: 'Village', hierarchyTone: 'subdivision' }
  ];

  const currentPath = `liii.st/World/Country/${encodeURIComponent(countryName)}/States/County/City/Village`;

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Main Container with Wikipedia Index on Left (LTR) and Content on Right */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left side Wikipedia Index Panel with Collapse Toggle */}
        <WikipediaIndexPanel
          entityType="state"
          className="hidden lg:block"
        />

        {/* Main Content Area: Directory Header & States Grid */}
        <div className="flex-1 w-full space-y-6">
          {/* Header Card */}
          <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Universal Subdivisions • Level 3 Node
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white mt-1">
                  States of the United States
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                  50 Sovereign Federated States • Official State Flags • Representative Covers • Municipalities
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200/60 dark:border-neutral-700/60">
                  {filteredStates.length} / 50 States
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter states by name, code or capital..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/70 dark:bg-neutral-950/70 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Sort pills */}
              <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setSortBy('alpha')}
                  className={`px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 ${
                    sortBy === 'alpha'
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-transparent'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Alphabetical
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('population')}
                  className={`px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 ${
                    sortBy === 'population'
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-transparent'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Population
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('area')}
                  className={`px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 ${
                    sortBy === 'area'
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-transparent'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Area
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('admission')}
                  className={`px-3 py-1.5 rounded-full border transition cursor-pointer shrink-0 ${
                    sortBy === 'admission'
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-black border-transparent'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Admitted
                </button>
              </div>
            </div>
          </div>

          {/* States Bento Grid Cards with Cover Photo & Official Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStates.map((state) => {
              const cover = state.coverUrl || US_STATE_COVERS[state.code];
              return (
                <div
                  key={state.code}
                  onClick={() => onSelectState(state)}
                  className="liquid-glass-card rounded-3xl overflow-hidden bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  {/* State Card Mini Cover Photo Header with Flag */}
                  <div className="relative w-full h-32 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    {cover && (
                      <img
                        src={cover}
                        alt={`Scenic cover of ${state.name}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Top row: Flag & Code */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <USStateFlag
                        code={state.code}
                        name={state.name}
                        className="w-12 h-7.5 rounded-md shadow-md border border-white/40"
                      />
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                        {state.code} • {state.admissionYear}
                      </span>
                    </div>

                    {/* Bottom row over cover: State name */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-sm truncate">
                        {state.name}
                      </h3>
                      <p className="text-[10px] text-white/80 font-mono truncate">
                        "{state.nickname}"
                      </p>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-4 space-y-3">
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                        <span>Capital:</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {state.capital}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                        <span>Population:</span>
                        <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                          {state.population.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                        <span>State GDP:</span>
                        <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                          ${state.gdpBillion}B
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors border-t border-neutral-200/50 dark:border-neutral-800/50">
                      <span className="text-[11px]">
                        {state.cities.length} Cataloged Cities
                      </span>
                      <div className="flex items-center gap-1">
                        <span>Explore</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
