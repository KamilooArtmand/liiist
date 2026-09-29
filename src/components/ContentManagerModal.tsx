import React, { useState } from 'react';
import { ListGroup } from '../types';
import { SupportedLanguage } from '../i18n/translations';
import {
  FolderKanban,
  X,
  Search,
  Plus,
  Trash2,
  Share2,
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface ContentManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  lists: ListGroup[];
  onSelectList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onCreateNewList: () => void;
  onExportList: (list: ListGroup) => void;
}

export const ContentManagerModal: React.FC<ContentManagerModalProps> = ({
  isOpen,
  onClose,
  lang,
  lists,
  onSelectList,
  onDeleteList,
  onCreateNewList,
  onExportList
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredLists = lists.filter(
    l =>
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
              {lang === 'fa' ? 'مدیریت محتوا (Content Manager)' : 'Content Manager'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-100 dark:bg-stone-800 font-mono font-bold">
              {lists.length} Lists
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Filter lists..."
              className="w-full text-xs bg-transparent focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onCreateNewList();
              onClose();
            }}
            className="px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New List</span>
          </button>
        </div>

        {/* Lists Container */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredLists.map(list => {
            const completedCount = list.items.filter(i => i.completed).length;

            return (
              <div
                key={list.id}
                className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => {
                    onSelectList(list.id);
                    onClose();
                  }}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60">
                    {list.icon}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {list.title}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {list.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-stone-400">
                        {list.items.length} items ({completedCount} done)
                      </span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        {list.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onExportList(list)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
                    title="Export List"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete list "${list.title}"?`)) {
                        onDeleteList(list.id);
                      }
                    }}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
                    title="Delete List"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredLists.length === 0 && (
            <div className="py-16 text-center text-xs text-stone-400">
              No matching lists found in Content Manager.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/60 flex items-center justify-between text-xs text-stone-400">
          <span>{filteredLists.length} lists listed</span>
          <span>Click any list to open in Workspace</span>
        </div>
      </div>
    </div>
  );
};
