'use client';

import React, { useState } from 'react';
import { Clock, Tag, ExternalLink, Network, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { layoutSpring, staggerContainer, staggerItem } from './animations';

interface BentoGridProps {
  entityName: string;
  entityType: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ entityName, entityType }) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);

  // Helper to handle expansion
  const toggleExpand = (id: string) => {
    setExpandedBlock(expandedBlock === id ? null : id);
  };

  return (
    <>
      {/* 
        Bento Grid Layout 
        Mobile: 1 column
        Tablet: 4 columns
        Desktop: 12 columns
      */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
          
          {/* 1. Header / Cover (Spans 8 columns on large screens) */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-cover"
            onClick={() => toggleExpand('cover')}
            className="col-span-1 md:col-span-4 lg:col-span-8 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-8 lg:p-12 flex flex-col justify-end aspect-square lg:aspect-[2/1] border border-neutral-200 dark:border-neutral-900 cursor-pointer"
          >
            <motion.div layoutId="bento-cover-tag" className="mb-4">
              <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase font-bold tracking-widest rounded-full">
                {entityType}
              </span>
            </motion.div>
            <motion.h1 layoutId="bento-cover-title" className="text-5xl lg:text-7xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]">
              {entityName}
            </motion.h1>
          </motion.div>

          {/* 2. Metadata Table (Spans 4 columns) */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-metadata"
            className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900 flex flex-col gap-6"
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

          {/* 3. History Timeline (Spans 6 columns) */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-history"
            className="col-span-1 md:col-span-2 lg:col-span-6 bg-white dark:bg-black rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900"
          >
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
            </div>
          </motion.div>

          {/* 4. Related Nodes (Spans 6 columns) */}
          <motion.div 
            variants={staggerItem}
            layoutId="bento-nodes"
            className="col-span-1 md:col-span-4 lg:col-span-6 bg-neutral-100 dark:bg-[#0a0a0a] rounded-2xl p-6 lg:p-8 border border-neutral-200 dark:border-neutral-900"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Semantic Nodes</h3>
              <Network className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-wrap gap-2">
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
            {/* Flat dark overlay per Bible constraints */}
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
              className="relative w-full max-w-5xl h-full max-h-[80vh] bg-neutral-100 dark:bg-[#0a0a0a] rounded-none border border-neutral-200 dark:border-neutral-900 p-12 flex flex-col justify-end shadow-none"
            >
              <button 
                onClick={() => setExpandedBlock(null)}
                className="absolute top-8 right-8 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div layoutId="bento-cover-tag" className="mb-4">
                <span className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-xs uppercase font-bold tracking-widest rounded-full">
                  {entityType}
                </span>
              </motion.div>
              <motion.h1 layoutId="bento-cover-title" className="text-7xl lg:text-9xl font-black text-black dark:text-white tracking-tighter uppercase leading-[0.9]">
                {entityName}
              </motion.h1>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
