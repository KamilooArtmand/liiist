import React from 'react';
import { ListGroup, ListItem, Priority } from '../types';
import { PRIORITY_CONFIG, formatDueDate } from '../utils/helpers';
import { CheckCircle2, Circle, Clock, CheckSquare, Plus } from 'lucide-react';

interface BoardViewProps {
  list: ListGroup;
  onToggleComplete: (itemId: string) => void;
  onSelectItem: (item: ListItem) => void;
  onQuickAddItem: (title: string, priority?: Priority) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  list,
  onToggleComplete,
  onSelectItem,
  onQuickAddItem
}) => {
  const pendingItems = list.items.filter(i => !i.completed);
  const completedItems = list.items.filter(i => i.completed);

  // Group pending into High Priority / Ready
  const highPriority = pendingItems.filter(i => i.priority === 'p1' || i.priority === 'p2');
  const normalPriority = pendingItems.filter(i => i.priority !== 'p1' && i.priority !== 'p2');

  const renderCard = (item: ListItem) => {
    const dateBadge = formatDueDate(item.dueDate);
    const subtasks = item.subtasks || [];
    const doneSubtasks = subtasks.filter(s => s.completed).length;

    return (
      <div
        key={item.id}
        onClick={() => onSelectItem(item)}
        className="group p-3.5 bg-white dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700/80 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition cursor-pointer flex flex-col gap-2"
      >
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleComplete(item.id);
            }}
            className="text-stone-400 hover:text-amber-500 mt-0.5 shrink-0 transition"
          >
            {item.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Circle className="w-4 h-4 hover:text-amber-500" />
            )}
          </button>
          <span
            className={`text-sm font-medium leading-snug line-clamp-2 ${
              item.completed
                ? 'line-through text-stone-400 dark:text-stone-500'
                : 'text-stone-800 dark:text-stone-100'
            }`}
          >
            {item.title}
          </span>
        </div>

        {item.notes && (
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 pl-6">
            {item.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-6">
          {item.priority && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                PRIORITY_CONFIG[item.priority].badge
              }`}
            >
              {PRIORITY_CONFIG[item.priority].label}
            </span>
          )}

          {dateBadge && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                dateBadge.isOverdue
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              {dateBadge.text}
            </span>
          )}

          {subtasks.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 font-medium flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {doneSubtasks}/{subtasks.length}
            </span>
          )}

          {item.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
              {item.category}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Column 1: Urgent & High Priority */}
      <div className="flex flex-col bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Priority & Urgent
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 shadow-xs">
            {highPriority.length}
          </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
          {highPriority.map(renderCard)}
          {highPriority.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500 italic border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              No urgent items pending.
            </div>
          )}
        </div>
      </div>

      {/* Column 2: In Queue / Active Tasks */}
      <div className="flex flex-col bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              In Queue
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 shadow-xs">
            {normalPriority.length}
          </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
          {normalPriority.map(renderCard)}
          {normalPriority.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500 italic border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              Queue is clear!
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Completed */}
      <div className="flex flex-col bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Completed
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 shadow-xs">
            {completedItems.length}
          </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[65vh]">
          {completedItems.map(renderCard)}
          {completedItems.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400 dark:text-stone-500 italic border border-dashed border-stone-200 dark:border-stone-800 rounded-xl">
              No completed items yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
