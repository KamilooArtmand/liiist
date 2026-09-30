import React, { useState, useRef, useEffect } from 'react';
import { Play, Image as ImageIcon, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { ListGroup, ListItem } from '../types';

interface TimelineViewProps {
  list: ListGroup;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ list }) => {
  const items = [...list.items].sort((a, b) => (a.year || 0) - (b.year || 0));
  const [selectedItem, setSelectedItem] = useState<ListItem | undefined>(items[0]);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-neutral-400 font-mono text-sm">
        No items with dates to display on timeline.
      </div>
    );
  }

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedItem]);

  useEffect(() => {
    if (!selectedItem) return;
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
  }, [selectedItem, items]);

  const handleSelect = (item: ListItem) => {
    if (selectedItem && item.id !== selectedItem.id) {
      setSelectedItem(item);
    }
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const idx = items.findIndex(m => m.id === selectedItem.id);
    if (idx < items.length - 1) handleSelect(items[idx + 1]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const idx = items.findIndex(m => m.id === selectedItem.id);
    if (idx > 0) handleSelect(items[idx - 1]);
  };

  if (!selectedItem) return null;

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-140px)] bg-white dark:bg-[#000000] selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden font-sans border-t border-neutral-200 dark:border-neutral-900">
      
      {/* ── TOP EDITORIAL CANVAS ── */}
      <div className="flex-1 w-full relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Animated Layer */}
        <div 
          key={animationKey}
          className="absolute inset-0 flex flex-col md:flex-row w-full h-full animate-in fade-in slide-in-from-right-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* LEFT/CENTER: Typography & Image */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-900">
            
            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[10rem] md:text-[14rem] lg:text-[20rem] font-black leading-none tracking-tighter text-neutral-100 dark:text-neutral-900/50 absolute -top-12 -left-4 md:-top-24 md:-left-8 pointer-events-none select-none">
                {selectedItem.year}
              </span>
              
              <div className="mt-16 md:mt-32 max-w-4xl relative z-10">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black dark:text-white uppercase tracking-tighter leading-[0.85] break-words">
                  {selectedItem.title}
                </h1>
                <p className="mt-8 text-xl md:text-3xl font-serif text-neutral-600 dark:text-neutral-400">
                  <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400 dark:text-neutral-600 mr-4">Directed By</span>
                  <span className="text-black dark:text-white">{selectedItem.director}</span>
                </p>
              </div>
            </div>

            {/* Poster / Actions Block */}
            <div className="mt-12 flex items-end justify-between relative z-10">
              <div className="flex items-center gap-4">
                <button title="Play" className="flex items-center justify-center w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-95 transition-transform duration-300 cursor-pointer">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </button>
                <button title="Gallery" className="flex items-center justify-center w-14 h-14 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 text-black dark:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 cursor-pointer">
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="hidden md:block w-32 h-48 bg-neutral-200 dark:bg-neutral-800 grayscale contrast-125 relative overflow-hidden shrink-0 border border-neutral-300 dark:border-neutral-700">
                {/* Monochromatic Placeholder for Poster */}
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <div className="text-[8px] font-mono font-bold uppercase text-neutral-500">{selectedItem.countryCode || 'US'} / {selectedItem.runtime}</div>
                  <div className="text-2xl font-black text-neutral-400 tracking-tighter opacity-50">{selectedItem.year}</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Strict Grid Data (The Encyclopedia) */}
          <div className="w-full md:w-[400px] lg:w-[480px] shrink-0 flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a]">
            
            {/* Meta Row */}
            <div className="flex border-b border-neutral-200 dark:border-neutral-900">
              <div className="flex-1 p-6 border-r border-neutral-200 dark:border-neutral-900 flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-1">IMDb</span>
                <span className="text-2xl font-mono font-black text-black dark:text-white flex items-center gap-2">
                  {selectedItem.score || '-'} <Star className="w-4 h-4 text-black dark:text-white fill-current" />
                </span>
              </div>
              <div className="flex-1 p-6 border-r border-neutral-200 dark:border-neutral-900 flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-1">Runtime</span>
                <span className="text-xl font-mono font-bold text-black dark:text-white">
                  {selectedItem.runtime || 'N/A'}
                </span>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-1">Country</span>
                <span className="text-xl font-mono font-bold text-black dark:text-white uppercase">
                  {selectedItem.countryCode || '--'}
                </span>
              </div>
            </div>

            {/* Synopsis Row */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-900 flex-1 overflow-y-auto no-scrollbar">
              <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">Synopsis</span>
              <p className="text-base leading-relaxed text-neutral-800 dark:text-neutral-300 font-serif">
                {selectedItem.notes || 'No description available.'}
              </p>
            </div>

            {/* Cast & Tags Row */}
            <div className="p-6 flex flex-col gap-6">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">Cast</span>
                <div className="flex flex-col gap-1.5">
                  {(selectedItem.cast || []).map(actor => (
                    <span key={actor} className="text-sm font-semibold text-black dark:text-white uppercase tracking-tight">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">Genres</span>
                <div className="flex flex-wrap gap-2">
                  {(selectedItem.genre || []).map(g => (
                    <span key={g} className="px-2 py-1 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-widest text-black dark:text-white">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Navigation Overlays */}
        <button 
          onClick={handlePrev}
          disabled={selectedItem.id === items[0].id}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 hidden md:flex items-center justify-center bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white disabled:opacity-0 transition-all duration-300 cursor-pointer z-20 hover:scale-110 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={handleNext}
          disabled={selectedItem.id === items[items.length - 1].id}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 hidden md:flex items-center justify-center bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white disabled:opacity-0 transition-all duration-300 cursor-pointer z-20 hover:scale-110 rounded-full"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>

      {/* ── BOTTOM TIMELINE (The Precision Ruler) ── */}
      <div className="h-[140px] md:h-[180px] shrink-0 w-full border-t border-neutral-200 dark:border-neutral-900 bg-white dark:bg-[#000000] relative overflow-hidden">
        
        {/* Playhead Center Marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black dark:bg-white z-30 pointer-events-none -translate-x-1/2" />
        
        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto no-scrollbar scroll-smooth flex items-center px-[50vw]"
        >
          {items.map((item, index) => {
            const isSelected = item.id === selectedItem.id;

            return (
              <button
                key={item.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                onClick={() => handleSelect(item)}
                className={`relative w-[100px] h-full shrink-0 flex flex-col justify-end items-center cursor-pointer transition-opacity duration-500 pb-8 border-b-2 group ${
                  isSelected ? 'border-black dark:border-white z-20' : 'border-neutral-200 dark:border-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 opacity-40 hover:opacity-100 z-10'
                }`}
              >
                {/* Vertical Ruler Tick */}
                <div className={`absolute bottom-0 w-[1px] transition-all duration-500 ${
                  isSelected ? 'h-8 bg-black dark:bg-white' : 'h-4 bg-neutral-300 dark:bg-neutral-800 group-hover:bg-neutral-500'
                }`} />

                {/* Info block (Animated Y offset) */}
                <div className={`flex flex-col items-center justify-end text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isSelected ? '-translate-y-6 scale-110' : '-translate-y-2'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 w-[90px] truncate transition-colors duration-500 ${
                    isSelected ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-600'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`text-sm font-mono font-black tracking-tighter transition-colors duration-500 ${
                    isSelected ? 'text-black dark:text-white' : 'text-neutral-400 dark:text-neutral-700'
                  }`}>
                    {item.year}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Edge Gradients for scrolling context (Strictly matching background) */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#000000] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#000000] to-transparent pointer-events-none z-20" />
      </div>

    </div>
  );
};
