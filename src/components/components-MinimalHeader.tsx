import React, { useState, useRef, useEffect } from 'react';
import { User, Search, Plus, List, LayoutGrid, Eye } from 'lucide-react';
import { Country } from '../types/types-country';
import { ALL_COUNTRIES } from '../data/data-countriesData';
import { ALL_50_US_STATES } from '../data/data-usStatesData';
import { CapsuleBreadcrumb, BreadcrumbSegment } from './components-CapsuleBreadcrumb';

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
  onCreateList?: () => void;
  onOpenSearch?: () => void;
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
  onChangeViewMode,
  onCreateList,
  onOpenSearch
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
        className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950 dark:text-white lowercase select-none cursor-pointer hover:opacity-80 transition-opacity shrink-0 flex items-center"
        aria-label="liiist home"
      >
        <span>l</span>
        <span className="tracking-[-0.05em]">iii</span>
        <span>st</span>
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

        {onCreateList && (
          <button
            type="button"
            onClick={onCreateList}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shrink-0 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            title="Create a list"
            aria-label="Create a list"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onOpenSearch) {
              onOpenSearch();
            } else {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
            }
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 shrink-0 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
          title="Search Cosmos (⌘K)"
          aria-label="Search Cosmos"
        >
          <Search className="w-4 h-4" />
        </button>
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

