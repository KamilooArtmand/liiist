import React, { useState, useRef, useEffect } from 'react';
import { Play, Image as ImageIcon, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { ListGroup, ListItem } from '../types/types-index';

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
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] bg-white dark:bg-[#050505] overflow-hidden font-sans">
      
      {/* ── TOP HERO (Simple, Expansive, Readable) ── */}
      <div className="flex-1 w-full flex flex-col justify-center relative overflow-hidden p-6 md:p-12 lg:p-20">
        
        <div 
          key={animationKey}
          className="w-full h-full flex flex-col md:flex-row gap-12 lg:gap-24 animate-in fade-in slide-in-from-bottom-8 duration-[800ms] ease-out fill-mode-both items-center md:items-start max-w-none"
        >
          {/* Left Column: Poster Placeholder */}
          <div className="shrink-0 w-48 md:w-64 lg:w-80 aspect-[2/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
             <span className="text-6xl lg:text-8xl font-black text-neutral-300 dark:text-neutral-700 tracking-tighter">
                {selectedItem.year}
             </span>
             <span className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">
                {selectedItem.countryCode || 'INT'} / {selectedItem.runtime || 'N/A'}
             </span>
          </div>

          {/* Right Column: Information & Details */}
          <div className="flex-1 flex flex-col max-w-6xl">
            {/* Meta tags */}
            <div className="flex items-center gap-4 mb-6 text-xs font-mono font-bold uppercase tracking-widest text-neutral-500">
              <span>{selectedItem.year}</span>
              <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <div className="flex items-center gap-1">
                 <Star className="w-3.5 h-3.5 fill-current" />
                 {selectedItem.score || '-'}
              </div>
              <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              <span>{selectedItem.runtime}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black dark:text-white tracking-tighter leading-[0.9] uppercase mb-8 break-words">
              {selectedItem.title}
            </h1>

            {/* Director & Synopsis */}
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-12">
              <div className="flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Synopsis</span>
                <p className="text-lg lg:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
                  {selectedItem.notes || 'No description available.'}
                </p>
              </div>
              
              <div className="w-full lg:w-64 shrink-0 flex flex-col gap-8">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Director</span>
                  <p className="text-lg font-bold text-black dark:text-white uppercase tracking-tight">
                    {selectedItem.director || 'Unknown'}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Cast</span>
                                    <div className="flex flex-col gap-1">
                    {(selectedItem.cast || []).map(actor => {
                      const initials = actor.split(' ').map(n => n[0]).join('').substring(0, 2);
                      return (
                        <button key={actor} className="flex items-center gap-3 py-1.5 pr-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors cursor-pointer group text-left">
                          <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-300 dark:border-neutral-700 group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-colors">
                            <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400">{initials}</span>
                          </div>
                          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white uppercase tracking-wide">
                            {actor}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons (Icon Only) */}
            <div className="flex items-center gap-4 mt-auto">
              <button title="Play" className="flex items-center justify-center w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform duration-300 cursor-pointer shadow-none">
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
              <button title="Gallery" className="flex items-center justify-center w-14 h-14 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-black dark:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-300 cursor-pointer shadow-none">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Global Navigation (Icon Only) */}
        <button 
          onClick={handlePrev}
          disabled={selectedItem.id === items[0].id}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden md:flex items-center justify-center bg-transparent text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-0 transition-colors duration-300 cursor-pointer z-20"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={handleNext}
          disabled={selectedItem.id === items[items.length - 1].id}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden md:flex items-center justify-center bg-transparent text-neutral-400 hover:text-black dark:hover:text-white disabled:opacity-0 transition-colors duration-300 cursor-pointer z-20"
        >
          <ArrowRight className="w-8 h-8" />
        </button>

      </div>

      {/* ── BOTTOM TIMELINE (Clean, Spaced Ruler) ── */}
      <div className="h-[200px] shrink-0 w-full border-t border-neutral-200 dark:border-neutral-900 bg-[#fafafa] dark:bg-[#0a0a0a] relative overflow-hidden group">
        
        {/* Playhead Center Marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-300 dark:bg-neutral-700 z-30 pointer-events-none -translate-x-1/2 transition-colors duration-500 group-hover:bg-black dark:group-hover:bg-white" />
        
        {/* The Continuous Horizontal Line */}
        <div className="absolute left-0 right-0 h-px top-[60%] -translate-y-1/2 bg-neutral-200 dark:border-neutral-800" />
        
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
                className={`relative w-[140px] h-full shrink-0 flex flex-col justify-center items-center cursor-pointer transition-all duration-[800ms] ease-out group ${
                  isSelected ? 'z-20 opacity-100 scale-100 mx-4' : 'z-10 opacity-30 hover:opacity-100 scale-95'
                }`}
              >
                {/* Info block Above the line */}
                <div className={`absolute top-[15%] w-full px-2 flex flex-col items-center justify-end text-center transition-all duration-500 ${
                  isSelected ? 'translate-y-0' : 'translate-y-2'
                }`}>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 w-full truncate transition-colors duration-500 ${
                    isSelected ? 'text-black dark:text-white' : 'text-neutral-500'
                  }`}>
                    {item.title}
                  </span>
                  <span className={`text-sm font-mono font-black tracking-tighter transition-colors duration-500 ${
                    isSelected ? 'text-black dark:text-white scale-110' : 'text-neutral-400'
                  }`}>
                    {item.year}
                  </span>
                </div>

                {/* Vertical Ruler Tick on the line */}
                <div className={`absolute top-[60%] -translate-y-1/2 w-[2px] transition-all duration-500 ${
                  isSelected ? 'h-8 bg-black dark:bg-white' : 'h-4 bg-neutral-300 dark:bg-neutral-700 group-hover:bg-neutral-500'
                }`} />
              </button>
            );
          })}
        </div>
        
        {/* Edge Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#fafafa] dark:from-[#0a0a0a] to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#fafafa] dark:from-[#0a0a0a] to-transparent pointer-events-none z-20" />
      </div>

    </div>
  );
};
