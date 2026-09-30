import React, { useState, useRef, useEffect } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { ListGroup, ListItem } from '../types';
import { CountryFlag } from './CountryFlag';

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

  // Trigger re-animation when item changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedItem]);

  // Smooth scroll to center the selected item, aligning with the "playhead"
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
    <div className="flex flex-col w-full h-[calc(100vh-140px)] overflow-hidden bg-white dark:bg-[#050505] animate-in fade-in duration-1000">
      
      {/* ── Hero / Detail Area (Cinematic Presentation) ── */}
      <div className="flex-1 w-full flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Animated content wrapper */}
        <div 
          key={animationKey}
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 px-4 sm:px-12 lg:px-24 relative z-10 animate-in fade-in zoom-in-[0.97] slide-in-from-bottom-8 duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] fill-mode-both"
        >
          {/* Left: Monochromatic Placeholder & Actions */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 items-center md:items-start">
            <div className={`w-full max-w-[280px] aspect-[2/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center relative overflow-hidden group grayscale`}>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                <Play className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-2xl" />
              </div>
              <span className="text-neutral-300 dark:text-neutral-800 font-black text-8xl rotate-[-90deg] select-none tracking-tighter mix-blend-multiply dark:mix-blend-screen">
                {selectedItem.year}
              </span>
            </div>
            
            {/* Icon-only Actions */}
            <div className="flex items-center gap-4">
              <button title="Play" className="flex items-center justify-center w-14 h-14 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
              <button title="Gallery" className="flex items-center justify-center w-14 h-14 bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 cursor-pointer">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Expansive Details */}
          <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-center">
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-mono font-light tracking-tighter text-neutral-400 dark:text-neutral-600">
                {selectedItem.year}
              </span>
              <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <CountryFlag code={selectedItem.countryCode || 'US'} className="w-6 h-4 rounded-sm grayscale opacity-80" />
              <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="flex items-center gap-1.5 px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded-sm text-[11px] font-bold text-neutral-900 dark:text-neutral-100 uppercase">
                <Star className="w-3.5 h-3.5 fill-current" />
                {selectedItem.score || 0}
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
                {selectedItem.runtime}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-neutral-950 dark:text-white tracking-tighter leading-[0.9] mb-6 uppercase">
              {selectedItem.title}
            </h1>
            
            <p className="text-xl sm:text-2xl font-serif italic text-neutral-400 dark:text-neutral-500 mb-10">
              DIR. <span className="text-neutral-900 dark:text-neutral-100 not-italic font-bold tracking-tight uppercase">{selectedItem.director}</span>
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16">
              <div className="xl:col-span-8">
                <p className="text-lg sm:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
                  {selectedItem.notes}
                </p>
              </div>

              <div className="xl:col-span-4 flex flex-col gap-8">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">Cast</h3>
                  <div className="flex flex-col gap-2">
                    {(selectedItem.cast || []).map(actor => (
                      <span key={actor} className="text-sm font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wide">
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedItem.genre || []).map(g => (
                      <span key={g} className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        #{g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Large Navigation Arrows (Desktop) - Icon Only */}
        <button 
          onClick={handlePrev}
          disabled={selectedItem.id === items[0].id}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden md:flex items-center justify-center rounded-full bg-transparent text-neutral-300 dark:text-neutral-800 hover:text-neutral-950 dark:hover:text-white disabled:opacity-0 transition-colors duration-500 cursor-pointer z-20"
        >
          <ChevronLeft className="w-10 h-10 stroke-[1.5]" />
        </button>
        <button 
          onClick={handleNext}
          disabled={selectedItem.id === items[items.length - 1].id}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden md:flex items-center justify-center rounded-full bg-transparent text-neutral-300 dark:text-neutral-800 hover:text-neutral-950 dark:hover:text-white disabled:opacity-0 transition-colors duration-500 cursor-pointer z-20"
        >
          <ChevronRight className="w-10 h-10 stroke-[1.5]" />
        </button>

      </div>

      {/* ── Time Machine Track (Bottom) ── */}
      <div className="h-[240px] sm:h-[280px] shrink-0 w-full border-t border-neutral-200 dark:border-neutral-900 bg-[#fbfbfb] dark:bg-[#0a0a0a] relative overflow-hidden group">
        
        {/* Central Time Machine Playhead */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-400 dark:bg-neutral-600 z-30 pointer-events-none -translate-x-1/2 transition-colors duration-500 group-hover:bg-neutral-950 dark:group-hover:bg-white" />
        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-950 dark:bg-white rounded-full z-30 pointer-events-none transition-transform duration-500 group-hover:scale-150" />
        
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
                className={`relative w-[160px] h-[200px] shrink-0 flex flex-col justify-center items-center cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  isSelected ? 'opacity-100 scale-100 z-20 mx-4' : 'opacity-30 hover:opacity-60 scale-90 hover:scale-95 z-10'
                }`}
              >
                {isEven ? (
                  <>
                    {/* Item Top: Cover */}
                    <div className="h-[80px] flex flex-col items-center justify-end pb-4">
                      <div className={`w-[40px] h-[60px] bg-neutral-200 dark:bg-neutral-800 grayscale transition-all duration-700 ${isSelected ? 'ring-2 ring-neutral-950 dark:ring-white scale-125' : ''}`} />
                    </div>
                    {/* The Node */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-[40px]">
                      <div className="w-px h-[10px] bg-neutral-300 dark:bg-neutral-700 absolute top-0" />
                      <div className={`w-2 h-2 rounded-full transition-all duration-700 z-10 ${
                        isSelected 
                          ? 'bg-neutral-950 dark:bg-white scale-150 opacity-0' // Hidden behind the playhead when active
                          : 'bg-neutral-400 dark:bg-neutral-600'
                      }`} />
                    </div>
                    {/* Item Bottom: Year & Info */}
                    <div className="h-[80px] flex flex-col items-center justify-start pt-4 px-2 text-center">
                      <span className={`text-sm font-mono font-bold tracking-widest transition-colors duration-700 ${isSelected ? 'text-neutral-950 dark:text-white scale-110' : 'text-neutral-500'}`}>
                        {item.year}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 truncate w-full transition-opacity duration-700 ${isSelected ? 'opacity-100 text-neutral-800 dark:text-neutral-200' : 'opacity-0'}`}>
                        {item.title}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Item Top: Year & Info */}
                    <div className="h-[80px] flex flex-col items-center justify-end pb-4 px-2 text-center">
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 truncate w-full transition-opacity duration-700 ${isSelected ? 'opacity-100 text-neutral-800 dark:text-neutral-200' : 'opacity-0'}`}>
                        {item.title}
                      </span>
                      <span className={`text-sm font-mono font-bold tracking-widest transition-colors duration-700 ${isSelected ? 'text-neutral-950 dark:text-white scale-110' : 'text-neutral-500'}`}>
                        {item.year}
                      </span>
                    </div>
                    {/* The Node */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-[40px]">
                      <div className={`w-2 h-2 rounded-full transition-all duration-700 z-10 ${
                        isSelected 
                          ? 'bg-neutral-950 dark:bg-white scale-150 opacity-0' 
                          : 'bg-neutral-400 dark:bg-neutral-600'
                      }`} />
                      <div className="w-px h-[10px] bg-neutral-300 dark:bg-neutral-700 absolute bottom-0" />
                    </div>
                    {/* Item Bottom: Cover */}
                    <div className="h-[80px] flex flex-col items-center justify-start pt-4">
                      <div className={`w-[40px] h-[60px] bg-neutral-200 dark:bg-neutral-800 grayscale transition-all duration-700 ${isSelected ? 'ring-2 ring-neutral-950 dark:ring-white scale-125' : ''}`} />
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Edge Gradients for fading out the ends */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fbfbfb] dark:from-[#0a0a0a] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fbfbfb] dark:from-[#0a0a0a] to-transparent pointer-events-none z-20" />
      </div>

    </div>
  );
};
