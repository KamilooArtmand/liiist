'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Command } from 'cmdk';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { layoutSpring, microSpring } from './animations';

interface SearchResult {
  id: string;
  slug: string;
  type: string;
  title: string;
}

export const CommandBar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle command bar on ⌘+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure the layout animation completes before focusing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Debounce API Call
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Semantic search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      {/* 1. Closed Pill State (Floating Trigger) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            layoutId="command-bar-wrapper"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={layoutSpring}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 shadow-none border-none cursor-pointer overflow-hidden"
          >
            <motion.div layoutId="command-bar-icon">
              <Search className="w-4 h-4 text-white dark:text-black" />
            </motion.div>
            <motion.span layoutId="command-bar-text" className="text-sm font-bold uppercase tracking-widest">
              Search Cosmos (⌘K)
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Expanded Search Overlay (Shared Layout Transition) */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            
            {/* Flat overlay backdrop (per Bible, NO backdrop-blur) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={microSpring}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/95 dark:bg-white/95"
            />

            <motion.div
              layoutId="command-bar-wrapper"
              transition={layoutSpring}
              className="relative w-full max-w-2xl bg-white dark:bg-[#050505] rounded-none border border-neutral-200 dark:border-neutral-900 overflow-hidden shadow-none"
            >
              <Command
                label="Global Command Menu"
                shouldFilter={false}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                }}
                className="w-full"
              >
                <div className="flex items-center border-b border-neutral-100 dark:border-neutral-900 px-4">
                  <motion.div layoutId="command-bar-icon" className="shrink-0">
                    <Search className="w-5 h-5 text-neutral-400" />
                  </motion.div>
                  
                  <Command.Input
                    ref={inputRef}
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search the Cosmos..."
                    className="w-full bg-transparent p-4 text-lg outline-none text-black dark:text-white placeholder:text-neutral-500 font-serif"
                  />
                  
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="shrink-0"
                    >
                      <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                    </motion.div>
                  )}
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  {!loading && results.length === 0 && query && (
                    <Command.Empty className="py-12 text-center text-sm font-mono text-neutral-500 uppercase tracking-widest">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={layoutSpring}
                      >
                        No entities found in this dimension.
                      </motion.span>
                    </Command.Empty>
                  )}

                  {results.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ ...microSpring, delay: i * 0.03 }}
                    >
                      <Command.Item
                        value={item.id}
                        onSelect={() => {
                          window.location.href = `/${item.type}s/${item.slug}`;
                        }}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors text-black dark:text-white group border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold uppercase tracking-tight">{item.title}</span>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mt-1">
                            {item.type}
                          </span>
                        </div>
                      </Command.Item>
                    </motion.div>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
