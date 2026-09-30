'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { Search, Loader2 } from 'lucide-react';

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
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    // STRICT PROTOCOL: Flat Design. No backdrop-blur (Liquid Glass rejected).
    // Using a solid, highly opaque flat background instead.
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/95">
      <div className="w-full max-w-2xl bg-white dark:bg-[#050505] rounded-none border border-neutral-200 dark:border-neutral-900 overflow-hidden shadow-none">
        <Command
          label="Global Command Menu"
          shouldFilter={false} // Filtering happens on the server via pgvector
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
          className="w-full"
        >
          <div className="flex items-center border-b border-neutral-100 dark:border-neutral-900 px-4">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              autoFocus
              placeholder="Search the Cosmos (e.g. 'Sci-fi movies about dreams')..."
              className="w-full bg-transparent p-4 text-lg outline-none text-black dark:text-white placeholder:text-neutral-500 font-serif"
            />
            {loading && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin shrink-0" />}
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {!loading && results.length === 0 && query && (
              <Command.Empty className="py-12 text-center text-sm font-mono text-neutral-500 uppercase tracking-widest">
                No entities found in this dimension.
              </Command.Empty>
            )}

            {results.map((item) => (
              <Command.Item
                key={item.id}
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
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
