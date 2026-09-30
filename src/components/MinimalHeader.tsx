import React, { useState, useRef, useEffect } from 'react';
import { User, Search, X, Sparkles, Globe2, ChevronRight, Layers } from 'lucide-react';
import { Country } from '../types/country';
import { ALL_COUNTRIES } from '../data/countriesData';
import { ALL_50_US_STATES } from '../data/usStatesData';
import { CapsuleBreadcrumb, BreadcrumbSegment } from './CapsuleBreadcrumb';

interface MinimalHeaderProps {
  onOpenUserMenu: () => void;
  onGoHome: () => void;
  onSelectCountry?: (country: Country) => void;
  onOpenCountryDetail?: (country: Country) => void;
  onOpenWorldCountries?: () => void;
  onOpenWorldOverview?: () => void;
  onOpenCenterColumn?: () => void;
  onOpenStatesDirectory?: () => void;
  // Breadcrumb segments placed between logo and search icon
  breadcrumbSegments?: BreadcrumbSegment[];
  breadcrumbPath?: string;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
    onGoBack?: () => void;
  viewMode?: 'list' | 'board' | 'focus' | 'timeline';
  onChangeViewMode?: (mode: 'list' | 'board' | 'focus' | 'timeline') => void;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  onOpenUserMenu,
  onGoHome,
  onSelectCountry,
  onOpenCountryDetail,
  onOpenWorldCountries,
  onOpenWorldOverview,
  onOpenCenterColumn,
  onOpenStatesDirectory,
  breadcrumbSegments,
  breadcrumbPath,
    isBookmarked,
  onToggleBookmark,
  onGoBack,
  viewMode,
  onChangeViewMode
}) => {
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Direct matches in countries and states
  const matchingCountries: Country[] = query.trim()
    ? ALL_COUNTRIES.filter((c: Country) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.officialName.toLowerCase().includes(query.toLowerCase()) ||
        c.capital.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchingStates = query.trim()
    ? ALL_50_US_STATES.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase()) ||
        s.capital.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  // Focus input automatically when search is opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (matchingCountries.length > 0 && onOpenCountryDetail) {
        onOpenCountryDetail(matchingCountries[0]);
        setIsSearchOpen(false);
      } else if (matchingStates.length > 0 && onOpenStatesDirectory) {
        onOpenStatesDirectory();
        setIsSearchOpen(false);
      } else if (onOpenCenterColumn) {
        onOpenCenterColumn();
        setIsSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-6 z-40 shrink-0 relative">
      {/* Left: Brand logo strictly lowercase "liiist" */}
      <button
        type="button"
        onClick={onGoHome}
        className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white lowercase select-none cursor-pointer hover:opacity-80 transition-opacity shrink-0"
        aria-label="liiist home"
      >
        liiist
      </button>

      {/* Center: Dynamic Rounded Hierarchy Route Capsule Breadcrumb placed directly between Logo and Search Icon */}
      {breadcrumbSegments && breadcrumbSegments.length > 0 ? (
        <div className="flex-1 max-w-2xl mx-auto px-1 hidden md:flex items-center justify-center animate-in fade-in duration-200 min-w-0">
          <CapsuleBreadcrumb
            segments={breadcrumbSegments}
            currentPath={breadcrumbPath}
            onGoBack={onGoBack}
            isBookmarked={isBookmarked}
            onToggleBookmark={onToggleBookmark}
            className="w-full max-w-xl"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

              {/* Right Side: Search Icon + User Icon */}
        <div ref={searchContainerRef} className="flex items-center gap-1 sm:gap-2 relative shrink-0">
          
          {/* View Mode Mini Capsule */}
          {viewMode && onChangeViewMode && (
            <div className="hidden sm:flex items-center gap-1 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-full p-1 mr-2">
              <button 
                onClick={() => onChangeViewMode('list')}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${viewMode === 'list' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onChangeViewMode('board')}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${viewMode === 'board' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onChangeViewMode('timeline')}
                className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${viewMode === 'timeline' ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        {/* Animated Popover Search Bar */}
        {isSearchOpen && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-72 sm:w-96 flex items-center bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-full   ring-4 ring-black/5 dark:ring-white/5 pr-2">
              <div className="pl-3.5 pr-2 text-neutral-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type any country, state, city..."
                className="w-full py-2 bg-transparent text-xs text-neutral-950 dark:text-neutral-50 placeholder-neutral-400 focus:outline-none font-normal"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  title="Clear query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  title="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Live Suggestion Dropdown */}
            <div className="absolute top-full mt-2 right-0 w-72 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Instant Lookup
                </span>
                <span>195 Nations • 50 States</span>
              </div>

              {/* Fast Direct Directories */}
              <div className="py-1 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCenterColumn) onOpenCenterColumn();
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      All Sovereign Countries
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">@countries</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onOpenStatesDirectory) onOpenStatesDirectory();
                    setIsSearchOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      All 50 US States
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">@us-states</span>
                </button>
              </div>

              {/* Matching Countries Results */}
              {matchingCountries.length > 0 && (
                <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 px-2.5 block">
                    Countries
                  </span>
                  {matchingCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        if (onOpenCountryDetail) onOpenCountryDetail(c);
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {c.name}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {c.capital}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching States Results */}
              {matchingStates.length > 0 && (
                <div className="pt-1.5 border-t border-neutral-100 dark:border-neutral-800 space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 px-2.5 block">
                    US States
                  </span>
                  {matchingStates.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => {
                        if (onOpenStatesDirectory) onOpenStatesDirectory();
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left text-xs transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {s.name} ({s.code})
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        Cap: {s.capital}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Icon Button */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shrink-0 ${
            isSearchOpen
              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
          title="Search directories and places"
          aria-label="Toggle search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* User Icon Button */}
        <button
          type="button"
          onClick={onOpenUserMenu}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
          title="Account & Management"
          aria-label="User account menu"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
