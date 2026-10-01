'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Loader2 } from 'lucide-react';

export interface ListItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  cover_url?: string;
}

interface InfiniteVirtualizedListProps {
  initialItems: ListItem[];
  totalCount: number;
  fetchNextPage: (offset: number, limit: number) => Promise<ListItem[]>;
}

export const InfiniteVirtualizedList: React.FC<InfiniteVirtualizedListProps> = ({
  initialItems,
  totalCount,
  fetchNextPage,
}) => {
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [isFetching, setIsFetching] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const hasNextPage = items.length < totalCount;

  // Tanstack Virtualizer for 60fps high-performance scrolling
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height in px
    overscan: 10, // Render extra items outside viewport to prevent flickering
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const loadMore = useCallback(async () => {
    if (isFetching || !hasNextPage) return;
    setIsFetching(true);
    try {
      const newItems = await fetchNextPage(items.length, 50);
      setItems((prev) => [...prev, ...newItems]);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasNextPage, items.length, fetchNextPage]);

  // Infinite scroll trigger
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      lastItem &&
      lastItem.index >= items.length - 1 &&
      hasNextPage &&
      !isFetching
    ) {
      loadMore();
    }
  }, [virtualItems, hasNextPage, isFetching, items.length, loadMore]);

  return (
    <div
      ref={parentRef}
      className="w-full h-screen overflow-auto bg-white dark:bg-black custom-scrollbar relative"
    >
      {/* Background central line connecting the geometric identity 'i' */}
      <div className="absolute left-[39px] sm:left-[71px] top-0 bottom-0 w-[1px] bg-neutral-200 dark:bg-neutral-900 pointer-events-none" />

      <div
        className="relative w-full max-w-4xl mx-auto"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index > items.length - 1;
          const item = items[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              className="absolute top-0 left-0 w-full px-4 sm:px-12 flex items-center gap-6 sm:gap-12 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className="w-full flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                </div>
              ) : (
                <>
                  {/* Identity: The 'o' (Geometric Primitive Cover) */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-neutral-100 dark:bg-neutral-900 shrink-0 border border-neutral-200 dark:border-neutral-800 overflow-hidden relative z-10 flex items-center justify-center">
                    {item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xs font-mono text-neutral-400">
                        {item.title.substring(0, 1)}
                      </span>
                    )}
                  </div>

                  {/* Identity: The '|' (Minimalist Line and Typography) */}
                  <div className="flex-1 min-w-0 border-l-[3px] border-black dark:border-white pl-4 sm:pl-6 py-2">
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tighter truncate">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm font-serif text-neutral-500 dark:text-neutral-400 truncate mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
