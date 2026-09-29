import React, { useState } from 'react';
import { ListGroup } from '../types';
import { CosmicListNode } from '../types/cosmos';
import { SupportedLanguage } from '../i18n/translations';
import { BookmarkedPage } from '../types/bookmark';
import { Bookmark, X, Search, Star, ExternalLink, Trash2, Globe2, Layers, MapPin } from 'lucide-react';

interface BookmarkManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  personalLists: ListGroup[];
  cosmicLists: CosmicListNode[];
  bookmarkedPages?: BookmarkedPage[];
  onSelectPersonalList: (id: string) => void;
  onSelectCosmicList: (id: string) => void;
  onSelectBookmarkedPage?: (page: BookmarkedPage) => void;
  onRemoveBookmark?: (id: string) => void;
}

export const BookmarkManagerModal: React.FC<BookmarkManagerModalProps> = ({
  isOpen,
  onClose,
  lang,
  personalLists,
  cosmicLists,
  bookmarkedPages = [],
  onSelectPersonalList,
  onSelectCosmicList,
  onSelectBookmarkedPage,
  onRemoveBookmark
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  // Personal favorites
  const starredPersonal = personalLists.filter(l => l.favorite);
  // Pinned cosmic seeds
  const starredCosmic = cosmicLists.slice(0, 4);

  // Filter bookmarked pages
  const filteredPages = bookmarkedPages.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.handle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black  animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-neutral-900  border border-neutral-200 dark:border-neutral-800  overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-4 h-4 text-neutral-800 dark:text-neutral-200 fill-current" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
              {lang === 'fa' ? 'نشان‌شده‌ها و بوکمارک‌ها' : lang === 'ckb' ? 'پەڕە نیشانکراوەکان' : lang === 'ar' ? 'الإشارات المرجعية' : 'Bookmarks & Favorites'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Real Bookmarked Pages (Countries, States, Directories) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2 font-mono">
                <Bookmark className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 fill-current" />
                <span>Bookmarked Pages & Nodes ({bookmarkedPages.length})</span>
              </h3>
            </div>

            {bookmarkedPages.length > 0 ? (
              <div className="space-y-2">
                {filteredPages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => {
                      onSelectBookmarkedPage?.(page);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white border border-neutral-200/60 dark:border-neutral-700/60 shrink-0">
                        {page.type === 'country' ? (
                          <Globe2 className="w-4 h-4" />
                        ) : page.type === 'state' ? (
                          <Layers className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                            {page.title}
                          </h4>
                          <span className="font-mono text-[10px] text-neutral-400">
                            {page.handle}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono truncate block">
                          {page.canonicalPath}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onRemoveBookmark && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(page.id);
                          }}
                          className="p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center">
                <Bookmark className="w-6 h-6 text-neutral-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-neutral-500 font-mono">
                  No bookmarked pages yet. Click the bookmark icon in any country or state header bar to pin it here!
                </p>
              </div>
            )}
          </div>

          {/* Starred Cosmic / Universal Nodes */}
          <div className="space-y-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2 font-mono">
              <Star className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
              <span>Universal Directory Pointers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {starredCosmic.map(cl => (
                <div
                  key={cl.id}
                  onClick={() => {
                    onSelectCosmicList(cl.id);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition cursor-pointer flex items-center gap-3 group"
                >
                  <span className="text-xl shrink-0">{cl.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {cl.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {cl.items.length} nodes indexed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold hover:opacity-90 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
