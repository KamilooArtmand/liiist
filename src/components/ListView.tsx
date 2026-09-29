import React, { useState, useMemo } from 'react';
import { ListGroup, ListItem, Priority, FilterStatus, ViewMode } from '../types';
import { PRIORITY_CONFIG, formatDueDate } from '../utils/helpers';
import {
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpDown,
  Share2,
  Edit3,
  Trash2,
  Star,
  ChevronUp,
  ChevronDown,
  Clock,
  CheckSquare,
  Check,
  LayoutList,
  Kanban,
  Eye
} from 'lucide-react';
import { BoardView } from './BoardView';
import { FocusView } from './FocusView';

interface ListViewProps {
  list: ListGroup;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onUpdateList: (updated: ListGroup) => void;
  onDeleteList: (listId: string) => void;
  onEditListMeta: (list: ListGroup) => void;
  onExportList: (list: ListGroup) => void;
  onSelectItem: (item: ListItem) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  list,
  viewMode,
  onChangeViewMode,
  onUpdateList,
  onDeleteList,
  onEditListMeta,
  onExportList,
  onSelectItem
}) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('p3');
  const [quickCategory, setQuickCategory] = useState('');
  const [quickScore, setQuickScore] = useState<number | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<ListGroup['sortOrder']>(list.sortOrder || 'manual');

  // Computed stats
  const totalItems = list.items.length;
  const completedItems = list.items.filter(i => i.completed).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Toggle single item completion
  const handleToggleComplete = (itemId: string) => {
    const updatedItems = list.items.map(item => {
      if (item.id === itemId) {
        const nextCompleted = !item.completed;
        return {
          ...item,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
      }
      return item;
    });

    onUpdateList({
      ...list,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  // Quick Add Item
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newItem: ListItem = {
      id: `item-${Date.now()}`,
      title: quickTitle.trim(),
      completed: false,
      priority: quickPriority,
      tags: [],
      category: list.type === 'shopping' ? quickCategory.trim() || 'General' : undefined,
      rank: list.type === 'ranked' ? list.items.length + 1 : undefined,
      score: list.type === 'ranked' ? (quickScore ?? 9.0) : undefined,
      createdAt: new Date().toISOString()
    };

    onUpdateList({
      ...list,
      items: [newItem, ...list.items],
      updatedAt: new Date().toISOString()
    });

    setQuickTitle('');
    setQuickScore(undefined);
  };

  // Reorder up/down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.items.length) return;

    const newItems = [...list.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    if (list.type === 'ranked') {
      newItems.forEach((item, idx) => {
        item.rank = idx + 1;
      });
    }

    onUpdateList({
      ...list,
      items: newItems,
      updatedAt: new Date().toISOString()
    });
  };

  // Clear completed items
  const handleClearCompleted = () => {
    if (confirm('Remove all completed items from this list?')) {
      onUpdateList({
        ...list,
        items: list.items.filter(i => !i.completed),
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Mark all items complete or incomplete
  const handleToggleAll = (setAllTo: boolean) => {
    onUpdateList({
      ...list,
      items: list.items.map(i => ({
        ...i,
        completed: setAllTo,
        completedAt: setAllTo ? new Date().toISOString() : undefined
      })),
      updatedAt: new Date().toISOString()
    });
  };

  // Filtered & Sorted items
  const processedItems = useMemo(() => {
    let result = [...list.items];

    if (filterStatus === 'active') {
      result = result.filter(i => !i.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter(i => i.completed);
    }

    if (sortOrder === 'rank') {
      result.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
    } else if (sortOrder === 'priority') {
      const pWeights: Record<Priority, number> = { p1: 1, p2: 2, p3: 3, p4: 4 };
      result.sort((a, b) => pWeights[a.priority] - pWeights[b.priority]);
    } else if (sortOrder === 'dueDate') {
      result.sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
    } else if (sortOrder === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [list.items, filterStatus, sortOrder]);

  const shoppingGroups = useMemo(() => {
    if (list.type !== 'shopping') return null;
    const groups: Record<string, ListItem[]> = {};
    processedItems.forEach(item => {
      const cat = item.category?.trim() || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [processedItems, list.type]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Top Banner Glass Card */}
      <div className="p-6 md:p-8 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs">
                {list.icon}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-white tracking-tight">
                  {list.title}
                </h1>
                {list.description && (
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                    {list.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {/* View Switcher */}
              <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                <button
                  type="button"
                  onClick={() => onChangeViewMode('list')}
                  className={`p-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                  title="List View"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeViewMode('board')}
                  className={`p-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    viewMode === 'board'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                  title="Board View"
                >
                  <Kanban className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChangeViewMode('focus')}
                  className={`p-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    viewMode === 'focus'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                  title="Focus Mode"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Export */}
              <button
                type="button"
                onClick={() => onExportList(list)}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Export or Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Edit Details */}
              <button
                type="button"
                onClick={() => onEditListMeta(list)}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Edit List Details"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {/* Delete List */}
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete list "${list.title}"?`)) {
                    onDeleteList(list.id);
                  }
                }}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                title="Delete List"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="flex-1 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden border border-stone-200 dark:border-stone-700">
                <div
                  className="h-full bg-black dark:bg-white transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-stone-500 whitespace-nowrap">
                {completedItems}/{totalItems} ({progressPercent}%)
              </span>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-2 text-xs">
              {completedItems < totalItems && (
                <button
                  type="button"
                  onClick={() => handleToggleAll(true)}
                  className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline"
                >
                  Mark all done
                </button>
              )}
              {completedItems > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <button
                    type="button"
                    onClick={handleClearCompleted}
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 underline"
                  >
                    Clear completed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {viewMode === 'board' ? (
          <BoardView
            list={list}
            onToggleComplete={handleToggleComplete}
            onSelectItem={onSelectItem}
            onQuickAddItem={(title, priority) => {
              const newItem: ListItem = {
                id: `item-${Date.now()}`,
                title,
                completed: false,
                priority: priority || 'p3',
                tags: [],
                createdAt: new Date().toISOString()
              };
              onUpdateList({ ...list, items: [newItem, ...list.items] });
            }}
          />
        ) : viewMode === 'focus' ? (
          <FocusView
            list={list}
            onToggleComplete={handleToggleComplete}
            onSelectItem={onSelectItem}
          />
        ) : (
          /* Standard List View */
          <>
            {/* Quick Add Bar */}
            <form
              onSubmit={handleQuickAdd}
              className="bg-white dark:bg-stone-900 rounded-full px-4 py-2 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <div className="flex items-center gap-2 flex-1 pl-1">
                <Plus className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  placeholder="Add a new item... (Press Enter)"
                  className="w-full text-xs sm:text-sm font-medium bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                {list.type === 'shopping' && (
                  <input
                    type="text"
                    value={quickCategory}
                    onChange={e => setQuickCategory(e.target.value)}
                    placeholder="Category"
                    className="w-20 px-2 py-1 text-xs rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                  />
                )}

                {list.type === 'ranked' && (
                  <div className="flex items-center gap-1 bg-stone-50 dark:bg-stone-800 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                    <Star className="w-3.5 h-3.5 text-stone-500 fill-current" />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={quickScore ?? ''}
                      onChange={e => setQuickScore(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="Score"
                      className="w-10 text-xs bg-transparent text-stone-800 dark:text-stone-200 focus:outline-none font-mono"
                    />
                  </div>
                )}

                <select
                  value={quickPriority}
                  onChange={e => setQuickPriority(e.target.value as Priority)}
                  className="text-xs px-2 py-1 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium focus:outline-none"
                >
                  <option value="p1">P1 Urgent</option>
                  <option value="p2">P2 High</option>
                  <option value="p3">P3 Medium</option>
                  <option value="p4">P4 Low</option>
                </select>

                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black disabled:opacity-40 text-xs font-bold transition shrink-0 shadow-xs cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>

            {/* Filter and Sort bar */}
            <div className="flex items-center justify-between gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-full">
                {(['all', 'active', 'completed'] as FilterStatus[]).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full font-bold capitalize transition cursor-pointer ${
                      filterStatus === status
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                        : 'hover:text-stone-900 dark:hover:text-stone-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as any)}
                  className="bg-transparent border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1 text-stone-700 dark:text-stone-300 focus:outline-none"
                >
                  <option value="manual">Manual Order</option>
                  <option value="priority">Priority First</option>
                  <option value="dueDate">Due Date</option>
                  <option value="alphabetical">Alphabetical</option>
                  {list.type === 'ranked' && <option value="rank">Ranking (#1 to #N)</option>}
                </select>
              </div>
            </div>

            {/* Items List */}
            {processedItems.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 p-8">
                <p className="text-sm font-semibold text-stone-500">
                  {filterStatus === 'all'
                    ? 'No items in this list yet.'
                    : `No ${filterStatus} items found.`}
                </p>
              </div>
            ) : list.type === 'shopping' && shoppingGroups ? (
              <div className="space-y-6">
                {Object.entries(shoppingGroups).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        {groupTitle} ({items.filter(i => i.completed).length}/{items.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map(item => renderItemRow(item))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {processedItems.map((item, index) => renderItemRow(item, index))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  function renderItemRow(item: ListItem, index: number = 0) {
    const isRanked = list.type === 'ranked';
    const rankNum = item.rank ?? index + 1;
    const dateBadge = formatDueDate(item.dueDate);
    const subtasks = item.subtasks || [];
    const doneSubtasks = subtasks.filter(s => s.completed).length;

    const isPodium1 = isRanked && rankNum === 1;

    return (
      <div
        key={item.id}
        onClick={() => onSelectItem(item)}
        className={`group px-4 py-3.5 rounded-2xl border transition flex items-center justify-between gap-3.5 cursor-pointer ${
          item.completed
            ? 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/50 opacity-60'
            : isPodium1
            ? 'bg-stone-100/90 dark:bg-stone-900/90 border-stone-400 dark:border-stone-600 shadow-xs'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-black dark:hover:border-white shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="flex flex-col opacity-0 group-hover:opacity-100 transition shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => handleMove(index, 'up')}
              disabled={index === 0}
              className="text-stone-400 hover:text-black dark:hover:text-white disabled:opacity-20 p-0.5"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleMove(index, 'down')}
              disabled={index === list.items.length - 1}
              className="text-stone-400 hover:text-black dark:hover:text-white disabled:opacity-20 p-0.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {isRanked && (
            <div
              className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 font-mono ${
                isPodium1
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              #{rankNum}
            </div>
          )}

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleToggleComplete(item.id);
            }}
            className="text-stone-400 hover:text-black dark:hover:text-white shrink-0 transition"
          >
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-stone-950 dark:text-white" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium tracking-tight truncate ${
                  item.completed
                    ? 'line-through text-stone-400 dark:text-stone-500'
                    : 'text-stone-950 dark:text-white'
                }`}
              >
                {item.title}
              </span>
              {item.quantity && (
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                  {item.quantity}
                </span>
              )}
            </div>

            {item.notes && (
              <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5 max-w-lg">
                {item.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {item.score !== undefined && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              {item.score}
            </span>
          )}

          {item.priority && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                PRIORITY_CONFIG[item.priority]?.badge
              }`}
            >
              {PRIORITY_CONFIG[item.priority]?.label}
            </span>
          )}

          {dateBadge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
              {dateBadge.text}
            </span>
          )}

          {subtasks.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
              {doneSubtasks}/{subtasks.length}
            </span>
          )}
        </div>
      </div>
    );
  }
};
