import React from 'react';
import { Clock, Tag, ExternalLink, Network } from 'lucide-react';

interface BentoGridProps {
  entityName: string;
  entityType: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ entityName, entityType }) => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
      
      {/* 
        Bento Grid Layout 
        Mobile: 1 column
        Tablet: 4 columns
        Desktop: 12 columns
      */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
        
        {/* 1. Header / Cover (Spans 8 columns on large screens) */}
        <div className="col-span-1 md:col-span-4 lg:col-span-8 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-8 lg:p-12 flex flex-col justify-end aspect-square lg:aspect-[2/1] border border-neutral-200 dark:border-neutral-900">
          <div className="mb-4">
            <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase font-bold tracking-widest rounded-full">
              {entityType}
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]">
            {entityName}
          </h1>
        </div>

        {/* 2. Metadata Table (Spans 4 columns) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Metadata</h3>
            <Tag className="w-4 h-4 text-neutral-400" />
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-serif text-neutral-500">Released</span>
              <span className="text-sm font-mono font-bold text-black dark:text-white">2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-serif text-neutral-500">Category</span>
              <span className="text-sm font-mono font-bold text-black dark:text-white">Technology</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-serif text-neutral-500">Status</span>
              <span className="text-sm font-mono font-bold text-black dark:text-white">Active</span>
            </div>
          </div>

          <button className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-xl flex justify-center items-center gap-2">
            View Source <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. History Timeline (Spans 6 columns) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Time-Machine History</h3>
            <Clock className="w-4 h-4 text-neutral-400" />
          </div>
          
          <div className="flex flex-col gap-6 relative border-l border-neutral-200 dark:border-neutral-900 ml-2 pl-6">
            <div className="relative">
              <div className="absolute w-2 h-2 bg-black dark:bg-white rounded-full -left-[29px] top-1.5" />
              <span className="text-[10px] font-mono font-bold text-neutral-400 block mb-1">SEP 2026</span>
              <p className="text-sm text-neutral-900 dark:text-neutral-100 font-serif">Major global update released.</p>
            </div>
            <div className="relative">
              <div className="absolute w-2 h-2 bg-neutral-300 dark:bg-neutral-700 rounded-full -left-[29px] top-1.5" />
              <span className="text-[10px] font-mono font-bold text-neutral-400 block mb-1">JAN 2025</span>
              <p className="text-sm text-neutral-500 font-serif">Initial entity registered in Liiist taxonomy.</p>
            </div>
          </div>
        </div>

        {/* 4. Related Nodes (Spans 6 columns) */}
        <div className="col-span-1 md:col-span-4 lg:col-span-6 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Semantic Nodes</h3>
            <Network className="w-4 h-4 text-neutral-400" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['Software', 'Infrastructure', 'Global', 'Taxonomy', 'Open Data'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300 hover:border-black dark:hover:border-white transition-colors cursor-pointer select-none">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
