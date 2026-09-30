import React, { useState, useRef, useEffect } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ListGroup, ListItem } from '../types';

import { CountryFlag } from './CountryFlag';

interface TimelineViewProps {
  list: ListGroup;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ list }) => {
  if (!list.items || list.items.length === 0) return <div className="flex items-center justify-center h-full">No items in this list to display on timeline.</div>;
  const items = list.items.sort((a, b) => (a.year || 0) - (b.year || 0));
  const [selectedItem, setSelectedItem] = useState<ListItem | undefined>(items[0]);

  if (!selectedItem) return null;
  const [animationKey, setAnimationKey] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Trigger re-animation when movie changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedItem]);

  // Center the selected movie in the timeline
  useEffect(() => {
    const selectedIndex = items.findIndex(m => m.id === selectedItem.id);
    const itemEl = itemRefs.current[selectedIndex];
    const containerEl = scrollContainerRef.current;

    if (itemEl && containerEl) {
      const containerWidth = containerEl.clientWidth;
      const itemLeft = itemEl.offsetLeft;
      const itemWidth = itemEl.clientWidth;
      
      const scrollPos = itemLeft - (containerWidth / 2) + (itemWidth / 2);
      
      containerEl.scrollTo({
        left: scrollPos,
        behavior: 'smooth'
      });
    }
  }, [selectedItem]);

  const handleSelect = (item: ListItem) => {
    if (item.id !== selectedItem.id) {
      setSelectedItem(item);
    }
  };

  const handleNext = () => {
    const idx = items.findIndex(m => m.id === selectedItem.id);
    if (idx < items.length - 1) handleSelect(items[idx + 1]);
  };

  const handlePrev = () => {
    const idx = items.findIndex(m => m.id === selectedItem.id);
    if (idx > 0) handleSelect(items[idx - 1]);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-140px)] overflow-hidden bg-white dark:bg-neutral-950 animate-in fade-in duration-500">
      
      {/* ── Top Navigation ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-900 shrink-0">
        
        <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
          {list.title} Timeline
        </div>
      </div>

      {/* ── Hero / Detail Area (Cinematic Presentation) ── */}
      <div className="flex-1 w-full bg-neutral-50 dark:bg-neutral-900/30 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Background Accent (Soft flat color based on movie cover) */}
        <div className={`absolute inset-0 opacity-5 dark:opacity-[0.03] ${selectedItem.coverColor} transition-colors duration-1000`} />

        <div 
          key={animationKey}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-700 fill-mode-both"
        >
          {/* Left: Movie Cover/Poster Placeholder */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <div className={`w-full aspect-[2/3] ${selectedItem.coverColor} rounded-sm border border-black/10 dark:border-white/10 flex items-center justify-center relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
              </div>
              <span className="text-white/20 font-black text-6xl rotate-[-45deg] select-none">
                {selectedItem.year}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-sm text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer">
                <Play className="w-3.5 h-3.5 fill-current" /> Trailer
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white rounded-sm text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
                <ImageIcon className="w-3.5 h-3.5" /> Gallery
              </button>
            </div>
          </div>

          {/* Right: Movie Details */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
            
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm">
                {selectedItem.year}
              </span>
              <CountryFlag code={(selectedItem.countryCode || 'US')} className="w-5 h-3.5 rounded-sm" />
              <div className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
                <Star className="w-3 h-3 fill-current" />
                {(selectedItem.score || 0)}
              </div>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
                {selectedItem.runtime}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 dark:text-white tracking-tighter leading-none mb-2">
              {selectedItem.title}
            </h1>
            <p className="text-lg sm:text-xl font-serif italic text-neutral-500 dark:text-neutral-400 mb-8">
              Directed by <span className="text-neutral-900 dark:text-neutral-200 not-italic font-medium">{selectedItem.director}</span>
            </p>

            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Synopsis</h3>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 font-medium">
                  {selectedItem.notes}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Main Cast</h3>
                  <div className="flex flex-col gap-1">
                    {(selectedItem.cast || []).map(actor => (
                      <span key={actor} className="text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedItem.genre || []).map(g => (
                      <span key={g} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Large Navigation Arrows (Desktop) */}
        <button 
          onClick={handlePrev}
          disabled={selectedItem.id === items[0].id}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-950 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          disabled={selectedItem.id === items[items.length - 1].id}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 hidden md:flex items-center justify-center rounded-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-950 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* ── Timeline Track (Bottom) ── */}
      <div className="h-[260px] shrink-0 w-full border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 relative">
        
        {/* The Continuous Horizontal Line */}
        <div className="absolute left-0 right-0 h-px top-1/2 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800" />
        
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center px-[50vw]"
        >
          {items.map((item, index) => {
            const isSelected = item.id === selectedItem.id;
            const isEven = index % 2 === 0;

            return (
              <button
                key={item.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => handleSelect(item)}
                className={`relative w-[140px] h-[200px] shrink-0 flex flex-col justify-center items-center group cursor-pointer transition-all duration-500 ${
                  isSelected ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-70 scale-95 hover:scale-100'
                }`}
              >
                {isEven ? (
                  <>
                    {/* Item Top: Cover */}
                    <div className="h-[80px] flex flex-col items-center justify-end pb-3">
                      <div className={`w-[50px] h-[75px] ${item.coverColor} rounded-sm border ${isSelected ? 'border-neutral-950 dark:border-white shadow-lg' : 'border-black/10 dark:border-white/10'} transition-all`} />
                    </div>
                    {/* The Dot on the Line */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-[40px]">
                      <div className="w-px h-[10px] bg-neutral-300 dark:bg-neutral-700 absolute top-0" />
                      <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 z-10 ${
                        isSelected 
                          ? 'bg-neutral-950 border-neutral-950 dark:bg-white dark:border-white' 
                          : 'bg-white border-neutral-400 dark:bg-neutral-950 dark:border-neutral-600'
                      }`} />
                    </div>
                    {/* Item Bottom: Year & Info */}
                    <div className="h-[80px] flex flex-col items-center justify-start pt-2 px-2 text-center">
                      <span className={`text-[11px] font-mono font-bold tracking-widest ${isSelected ? 'text-neutral-950 dark:text-white' : 'text-neutral-500'}`}>
                        {item.year}
                      </span>
                      <span className="text-[9px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mt-1 truncate w-full">
                        {item.title}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Item Top: Year & Info */}
                    <div className="h-[80px] flex flex-col items-center justify-end pb-2 px-2 text-center">
                      <span className="text-[9px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1 truncate w-full">
                        {item.title}
                      </span>
                      <span className={`text-[11px] font-mono font-bold tracking-widest ${isSelected ? 'text-neutral-950 dark:text-white' : 'text-neutral-500'}`}>
                        {item.year}
                      </span>
                    </div>
                    {/* The Dot on the Line */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-[40px]">
                      <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 z-10 ${
                        isSelected 
                          ? 'bg-neutral-950 border-neutral-950 dark:bg-white dark:border-white' 
                          : 'bg-white border-neutral-400 dark:bg-neutral-950 dark:border-neutral-600'
                      }`} />
                      <div className="w-px h-[10px] bg-neutral-300 dark:bg-neutral-700 absolute bottom-0" />
                    </div>
                    {/* Item Bottom: Cover */}
                    <div className="h-[80px] flex flex-col items-center justify-start pt-3">
                      <div className={`w-[50px] h-[75px] ${item.coverColor} rounded-sm border ${isSelected ? 'border-neutral-950 dark:border-white shadow-lg' : 'border-black/10 dark:border-white/10'} transition-all`} />
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Edge Gradients for scrolling indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-neutral-950 pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-neutral-950 pointer-events-none z-20" />
      </div>

    </div>
  );
};
