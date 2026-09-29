import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Country, CountrySortOption } from '../types/country';
import { COUNTRIES_DATA } from '../data/countriesData';
import { CountryFlag } from './CountryFlag';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  X,
  Globe2,
  ChevronRight,
  Filter,
  Layers,
  Maximize2
} from 'lucide-react';

interface CountryDirectoryColumnProps {
  onSelectCountry: (country: Country) => void;
  selectedCountryCode?: string;
  onOpenDedicatedPage?: () => void;
  onClose?: () => void;
  className?: string;
  title?: string;
}

export const CountryDirectoryColumn: React.FC<CountryDirectoryColumnProps> = ({
  onSelectCountry,
  selectedCountryCode,
  onOpenDedicatedPage,
  onClose,
  className = '',
  title = 'liiist : Countries'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<CountrySortOption>('alpha-asc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sorting and filtering logic
  const processedCountries = useMemo(() => {
    let list = [...COUNTRIES_DATA];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.officialName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.capital.toLowerCase().includes(q)
      );
    }

    // Sort order
    switch (sortOption) {
      case 'alpha-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'population-desc':
        list.sort((a, b) => b.population - a.population);
        break;
      case 'population-asc':
        list.sort((a, b) => a.population - b.population);
        break;
      case 'area-desc':
        list.sort((a, b) => b.areaKm2 - a.areaKm2);
        break;
      case 'area-asc':
        list.sort((a, b) => a.areaKm2 - b.areaKm2);
        break;
      case 'independence-asc':
        list.sort((a, b) => a.independenceYear - b.independenceYear);
        break;
      case 'independence-desc':
        list.sort((a, b) => b.independenceYear - a.independenceYear);
        break;
      case 'continent':
        list.sort((a, b) => {
          if (a.continent === b.continent) {
            return a.name.localeCompare(b.name);
          }
          return a.continent.localeCompare(b.continent);
        });
        break;
    }

    return list;
  }, [searchQuery, sortOption]);

  // Continents grouping if continent mode is selected
  const continentGroups = useMemo(() => {
    if (sortOption !== 'continent') return null;
    const groups: Record<string, Country[]> = {};
    processedCountries.forEach(c => {
      if (!groups[c.continent]) groups[c.continent] = [];
      groups[c.continent].push(c);
    });
    return groups;
  }, [processedCountries, sortOption]);

  // Progressive reveal: initially 10, expand as user scrolls or moves mouse over the column
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Show / hide floating back to top arrow
    setShowScrollTop(scrollTop > 240);

    // Auto-reveal next 10 items when reaching near bottom (or 200px before bottom)
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setVisibleCount(prev => Math.min(prev + 10, processedCountries.length));
    }
  };

  // On hover over column, automatically expand by 10 if user scrolls mouse
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      setVisibleCount(prev => Math.min(prev + 10, processedCountries.length));
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Close sort menu on click outside
  useEffect(() => {
    const handleDocClick = () => setIsSortOpen(false);
    if (isSortOpen) {
      window.addEventListener('click', handleDocClick);
      return () => window.removeEventListener('click', handleDocClick);
    }
  }, [isSortOpen]);

  // Focus search input when search is toggled
  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();
    }
  }, [isSearchActive]);

  const displayedList =
    sortOption === 'continent'
      ? processedCountries
      : processedCountries.slice(0, visibleCount);

  return (
    <div
      className={`flex flex-col relative w-full rounded-3xl bg-white dark:bg-neutral-900  border border-neutral-200/80 dark:border-neutral-800  overflow-hidden transition-all ${className}`}
    >
      {/* Column Header & Controls Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 shrink-0 bg-neutral-100 dark:bg-neutral-950">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-900 dark:text-neutral-100">
            {title}
          </span>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            ({processedCountries.length})
          </span>
        </div>

        {/* Action icons: Search, Sort, Open Dedicated Page, and optional Close */}
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {/* Search Toggle Icon */}
          <button
            type="button"
            onClick={() => {
              setIsSearchActive(!isSearchActive);
              if (isSearchActive) setSearchQuery('');
            }}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSearchActive || searchQuery
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
            title="Search countries"
            aria-label="Search countries"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Sort Button & Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium ${
                isSortOpen
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
              title="Sort country list"
              aria-label="Sort country list"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {/* Sort Popover Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800  z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Sort Criteria
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('alpha-asc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'alpha-asc'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>Alphabetical (A → Z)</span>
                  <span className="text-[10px] opacity-60">Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('alpha-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'alpha-desc'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>Alphabetical (Z → A)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('continent');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'continent'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>Grouped by Continents</span>
                </button>

                <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('population-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'population-desc'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>By Population (Highest)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('area-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'area-desc'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>By Area (Largest km²)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSortOption('independence-asc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    sortOption === 'independence-asc'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>By Independence / Age</span>
                </button>
              </div>
            )}
          </div>

          {/* Open Dedicated Page Icon Button (opposite to liiist : Countries) */}
          {onOpenDedicatedPage && (
            <button
              type="button"
              onClick={onOpenDedicatedPage}
              className="p-2 rounded-full transition-colors cursor-pointer text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
              title="Open full dedicated page (liii.st/World/Country)"
              aria-label="Open full dedicated page"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Optional Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
              title="Close column"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Search Input within the Column */}
      {isSearchActive && (
        <div className="px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 flex items-center gap-2 animate-in slide-in-from-top-1 duration-150">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Type country name, code, or capital..."
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* The Long Column Scroll Container (Scrollbar Hidden strictly) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="flex-1 overflow-y-auto max-h-[68vh] sm:max-h-[72vh] p-2 space-y-1.5 no-scrollbar scroll-smooth focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* If Grouped by Continents mode */}
        {sortOption === 'continent' && continentGroups ? (
          Object.entries(continentGroups).map(([continent, countries]) => (
            <div
              key={continent}
              className="mb-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 p-2.5"
            >
              <div className="px-3 py-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" />
                  {continent}
                </span>
                <span className="text-[11px] font-mono opacity-60">
                  {countries.length} nations
                </span>
              </div>

              <div className="space-y-1 mt-1">
                {countries.map((country, idx) => {
                  const paddedIndex = String(idx + 1).padStart(3, '0');
                  const isSelected = selectedCountryCode === country.code;

                  return (
                    <div
                      key={country.code}
                      onClick={() => onSelectCountry(country)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold '
                          : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* 3-Digit Zero Padded Index (e.g. 001) */}
                        <span className="font-mono text-xs tabular-nums text-neutral-400 dark:text-neutral-500 shrink-0 w-7">
                          {paddedIndex}
                        </span>

                        {/* Real SVG Vector Flag from country-flag-icons */}
                        <CountryFlag
                          code={country.code}
                          className="w-5 h-3.5 rounded-xs shrink-0"
                          title={country.name}
                        />

                        {/* Full Country Name */}
                        <span className="text-xs truncate font-medium">
                          {country.name}
                        </span>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          /* Standard Linear Long Column */
          <>
            {displayedList.map((country, idx) => {
              const paddedIndex = String(idx + 1).padStart(3, '0');
              const isSelected = selectedCountryCode === country.code;

              return (
                <div
                  key={country.code}
                  onClick={() => onSelectCountry(country)}
                  className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold '
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 3-digit zero-padded index (001, 002...) */}
                    <span className="font-mono text-xs tabular-nums text-neutral-400 dark:text-neutral-500 shrink-0 w-7">
                      {paddedIndex}
                    </span>

                    {/* SVG Vector Flag */}
                    <CountryFlag
                      code={country.code}
                      className="w-5 h-3.5 rounded-xs shrink-0"
                      title={country.name}
                    />

                    {/* Full Country Name */}
                    <span className="text-xs truncate font-medium">
                      {country.name}
                    </span>
                  </div>

                  {/* Secondary info (population / area / year depending on sort) */}
                  <div className="flex items-center gap-2 shrink-0">
                    {sortOption.startsWith('population') && (
                      <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                        {(country.population / 1_000_000).toFixed(1)}M
                      </span>
                    )}
                    {sortOption.startsWith('area') && (
                      <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                        {(country.areaKm2 / 1_000).toFixed(0)}k km²
                      </span>
                    )}
                    {sortOption.startsWith('independence') && (
                      <span className="text-[11px] font-mono text-neutral-400 tabular-nums">
                        {country.independenceYear > 0
                          ? country.independenceYear
                          : `${Math.abs(country.independenceYear)} BCE`}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </div>
              );
            })}

            {/* End of list or load more indicator */}
            {displayedList.length < processedCountries.length && (
              <div className="py-3 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(prev => Math.min(prev + 20, processedCountries.length))
                  }
                  className="px-4 py-1.5 text-[11px] font-mono rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  Scroll down or click to reveal more ({visibleCount}/
                  {processedCountries.length})
                </button>
              </div>
            )}
          </>
        )}

        {displayedList.length === 0 && (
          <div className="py-12 text-center text-xs text-neutral-400">
            No matching sovereign countries found.
          </div>
        )}
      </div>

      {/* Floating Quick Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black  hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
