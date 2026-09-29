import React, { useState, useMemo } from 'react';
import { ListGroup, ListItem } from '../types';
import { PRIORITY_CONFIG } from '../utils/helpers';
import { Search, X, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface GlobalSearchModalProps {
  lists: ListGroup[];
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (listId: string, item: ListItem) => void;
  onSelectList: (listId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  lists,
  isOpen,
  onClose,
  onSelectItem,
  onSelectList
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches: Array<{ list: ListGroup; item: ListItem }> = [];
    lists.forEach(list => {
      list.items.forEach(item => {
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        const matchesTag = item.tags.some(t => t.toLowerCase().includes(q));
        const matchesCategory = item.category?.toLowerCase().includes(q);

        if (matchesTitle || matchesNotes || matchesTag || matchesCategory) {
          matches.push({ list, item });
        }
      });
    });

    return matches;
  }, [lists, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3 border-b border-stone-100 dark:border-stone-800 gap-3">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across all tasks, notes, tags, lists..."
            className="flex-1 text-base bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-500 rounded border border-stone-200 dark:border-stone-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-stone-100 dark:divide-stone-800">
          {!query.trim() ? (
            <div className="py-12 text-center text-stone-400 dark:text-stone-500 text-sm">
              Type to quickly search items, notes, or tags across all lists.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-stone-400 dark:text-stone-500 text-sm">
              No matching items found for "{query}".
            </div>
          ) : (
            searchResults.map(({ list, item }) => (
              <div
                key={`${list.id}-${item.id}`}
                onClick={() => {
                  onSelectItem(list.id, item);
                  onClose();
                }}
                className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 rounded-xl cursor-pointer transition flex items-center justify-between group gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 text-stone-400">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        item.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-stone-400 flex items-center gap-1">
                        <span>{list.icon}</span> {list.title}
                      </span>
                      {item.priority && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            PRIORITY_CONFIG[item.priority]?.badge
                          }`}
                        >
                          {PRIORITY_CONFIG[item.priority]?.label}
                        </span>
                      )}
                      {item.tags?.length > 0 && (
                        <span className="text-[10px] text-stone-400">
                          #{item.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition text-stone-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-950/40 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-400 flex items-center justify-between">
          <span>Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</span>
          <span>Click any item to view or edit</span>
        </div>
      </div>
    </div>
  );
};
