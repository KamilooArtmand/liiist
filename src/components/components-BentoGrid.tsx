'use client';

import React, { useState } from 'react';
import { Clock, Tag, Network, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { layoutSpring, staggerContainer, staggerItem } from './components-animations';

interface BentoGridProps {
  entityName: string;
  entityType: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ entityName, entityType }) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBlock(expandedBlock === id ? null : id);
  };

  return (
    <>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        {/* Responsive Matrix: grid-cols mapping degrades programmatically */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
          
          {/* 1. Header / Cover (Container Query Aware) */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-cover"
            onClick={() => toggleExpand('cover')}
            className="@container col-span-1 md:col-span-4 lg:col-span-8 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-8 lg:p-12 flex flex-col justify-end aspect-square lg:aspect-[2/1] border border-neutral-200 dark:border-neutral-900 cursor-pointer gap-4"
          >
            {/* Removed margins, relying on flex gap-4 of the parent wrapper */}
            <motion.div layoutId="bento-cover-tag" className="self-start">
              <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase font-bold tracking-widest rounded-full">
                {entityType}
              </span>
            </motion.div>
            <motion.h1 
              layoutId="bento-cover-title" 
              // Using fluid typography variables instead of discrete breakpoints
              style={{ fontSize: 'var(--text-fluid-h1)' }}
              className="font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]"
            >
              {entityName}
            </motion.h1>
          </motion.div>

          {/* 2. Metadata Table */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-metadata"
            className="@container col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900 flex flex-col gap-6"
          >
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
            </div>
          </motion.div>

          {/* 3. History Timeline */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-history"
            className="@container col-span-1 md:col-span-2 lg:col-span-6 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900 flex flex-col gap-8"
          >
             <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Time-Machine History</h3>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            {/* Replaced absolute positioning offsets with flex layout gaps */}
            <div className="flex flex-col gap-6 border-l border-neutral-200 dark:border-neutral-900 ml-2 pl-6">
              <div className="relative flex flex-col gap-1">
                <div className="absolute w-2 h-2 bg-black dark:bg-white rounded-full -left-[29px] top-1.5" />
                <span className="text-[10px] font-mono font-bold text-neutral-400">SEP 2026</span>
                <p className="text-sm text-neutral-900 dark:text-neutral-100 font-serif">Major global update released.</p>
              </div>
            </div>
          </motion.div>

          {/* 4. Related Nodes */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-nodes"
            className="@container col-span-1 md:col-span-4 lg:col-span-6 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900 flex flex-col gap-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Semantic Nodes</h3>
              <Network className="w-4 h-4 text-neutral-400" />
            </div>
            
            {/* Responsive to container size, not screen size */}
            <div className="flex flex-wrap gap-2 @sm:gap-4">
              {['Software', 'Infrastructure', 'Global'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Expanded State Modal (Shared Layout) */}
      <AnimatePresence>
        {expandedBlock === 'cover' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedBlock(null)}
              className="absolute inset-0 bg-black/95 dark:bg-white/95"
            />
            
            <motion.div 
              layoutId="bento-cover"
              transition={layoutSpring}
              className="@container relative w-full max-w-5xl h-full max-h-[80vh] bg-neutral-100 dark:bg-[#0a0a0a] rounded-none border border-neutral-200 dark:border-neutral-900 p-12 flex flex-col justify-end gap-6 shadow-none"
            >
              <button 
                onClick={() => setExpandedBlock(null)}
                className="absolute top-8 right-8 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div layoutId="bento-cover-tag" className="self-start">
                <span className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs uppercase font-bold tracking-widest rounded-full">
                  {entityType}
                </span>
              </motion.div>
              <motion.h1 
                layoutId="bento-cover-title" 
                style={{ fontSize: 'calc(var(--text-fluid-h1) * 1.5)' }}
                className="font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]"
              >
                {entityName}
              </motion.h1>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
