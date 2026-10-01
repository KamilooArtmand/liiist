import React from 'react';
import { ListGroup } from '../types/types-index';
import { COLOR_MAP } from '../utils/utils-helpers';
import {
  Plus,
  Search,
  CheckSquare,
  Trophy,
  ShoppingCart,
  Compass,
  FileText,
  Star,
  Layers,
  Moon,
  Sun,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface SidebarProps {
  lists: ListGroup[];
  selectedListId: string;
  onSelectList: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lists,
  selectedListId,
  onSelectList,
  onOpenCreateModal,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode
}) => {
  // Aggregate stats
  const totalTasks = lists.reduce((sum, l) => sum + l.items.length, 0);
  const totalCompleted = lists.reduce((sum, l) => sum + l.items.filter(i => i.completed).length, 0);

  const favorites = lists.filter(l => l.favorite);
  const otherLists = lists.filter(l => !l.favorite);

  const getListIcon = (type: ListGroup['type']) => {
    switch (type) {
      case 'todo':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
      case 'ranked':
        return <Trophy className="w-4 h-4 text-violet-500" />;
      case 'shopping':
        return <ShoppingCart className="w-4 h-4 text-emerald-500" />;
      case 'bucket':
        return <Compass className="w-4 h-4 text-cyan-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  const renderListButton = (list: ListGroup) => {
    const isSelected = selectedListId === list.id;
    const pendingCount = list.items.filter(i => !i.completed).length;
    const colorStyle = COLOR_MAP[list.color] || COLOR_MAP.amber;

    return (
      <button
        key={list.id}
        type="button"
        onClick={() => onSelectList(list.id)}
        className={`w-full group px-3 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 text-sm font-medium transition ${
          isSelected
            ? `${colorStyle.light} border  font-semibold`
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base shrink-0">{list.icon}</span>
          <span className="truncate">{list.title}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {pendingCount > 0 ? (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition ${
                isSelected
                  ? 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 group-hover:bg-stone-200 dark:group-hover:bg-stone-700'
              }`}
            >
              {pendingCount}
            </span>
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 opacity-60" />
          )}
        </div>
      </button>
    );
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 h-full bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl ">
            L
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-stone-100">
              Liiist
            </h1>
            <p className="text-[11px] text-stone-400 font-medium">Curate & Accomplish</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Search Trigger */}
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-xs font-medium flex items-center justify-between  transition"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" /> Search all items...
          </span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Lists Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {/* Pinned / Favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="px-3 mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Starred Lists</span>
            </div>
            <div className="space-y-1">{favorites.map(renderListButton)}</div>
          </div>
        )}

        {/* All Lists */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              <span>My Lists</span>
            </div>
            <span>{lists.length}</span>
          </div>
          <div className="space-y-1">
            {otherLists.length > 0 ? (
              otherLists.map(renderListButton)
            ) : favorites.length === 0 ? (
              <p className="px-3 py-4 text-xs text-stone-400 italic">No lists yet. Create one!</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Actions & Stats */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 space-y-3">
        {/* Overall Completion Mini Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Overall Progress</span>
            <span className="font-bold text-stone-700 dark:text-stone-300">
              {totalCompleted}/{totalTasks} ({totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{
                width: `${totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%`
              }}
            />
          </div>
        </div>

        {/* New List Button */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-2  cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New List
        </button>
      </div>
    </aside>
  );
};
