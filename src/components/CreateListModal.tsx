import React, { useState } from 'react';
import { ListGroup, ListType } from '../types';
import { COLOR_MAP } from '../utils/helpers';
import { X, Check, CheckSquare, Trophy, ShoppingCart, Compass, FileText } from 'lucide-react';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newList: Omit<ListGroup, 'id' | 'items' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: ListGroup | null;
  onUpdate?: (updated: ListGroup) => void;
}

const EMOJI_OPTIONS = [
  '⚡', '📋', '🎯', '🎬', '🍿', '🥑', '🛒', '🏔️', '🧭', '📚',
  '💼', '💡', '🚀', '🎨', '🎧', '✈️', '🪴', '☕', '🔥', '✨'
];

const COLORS: Array<'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'cyan' | 'orange'> = [
  'amber', 'emerald', 'indigo', 'rose', 'violet', 'cyan', 'orange'
];

const LIST_TYPES: Array<{ type: ListType; label: string; icon: React.ReactNode; desc: string }> = [
  {
    type: 'todo',
    label: 'To-Do & Tasks',
    icon: <CheckSquare className="w-5 h-5 text-amber-500" />,
    desc: 'Due dates, priorities, subtasks, and completion checks'
  },
  {
    type: 'ranked',
    label: 'Ranked Top-N',
    icon: <Trophy className="w-5 h-5 text-violet-500" />,
    desc: 'Numbered hierarchy (#1, #2, #3), ratings & reviews'
  },
  {
    type: 'shopping',
    label: 'Shopping & Grocery',
    icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
    desc: 'Categorized by aisle, with quantity counters'
  },
  {
    type: 'bucket',
    label: 'Bucket List & Goals',
    icon: <Compass className="w-5 h-5 text-cyan-500" />,
    desc: 'Life milestones, adventures, and future goals'
  },
  {
    type: 'notes',
    label: 'Quick Checklist',
    icon: <FileText className="w-5 h-5 text-indigo-500" />,
    desc: 'Minimal notes & straightforward items'
  }
];

export const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
  onUpdate
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<ListType>(initialData?.type || 'todo');
  const [color, setColor] = useState<'amber' | 'emerald' | 'indigo' | 'rose' | 'violet' | 'cyan' | 'orange'>(
    initialData?.color || 'amber'
  );
  const [icon, setIcon] = useState(initialData?.icon || '⚡');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        title: title.trim(),
        description: description.trim(),
        type,
        color,
        icon,
        updatedAt: new Date().toISOString()
      });
    } else {
      onCreate({
        title: title.trim(),
        description: description.trim(),
        type,
        color,
        icon,
        sortOrder: type === 'ranked' ? 'rank' : 'manual'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {initialData ? 'Edit List Details' : 'Create New List'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* List Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              List Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Weekend Road Trip, Books to Read, Weekly Groceries..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              placeholder="Brief note or subtitle about this list..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition text-sm"
            />
          </div>

          {/* List Type / Archetype */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              List Archetype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIST_TYPES.map(item => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setType(item.type)}
                  className={`text-left p-3 rounded-xl border text-sm transition flex flex-col gap-1 ${
                    type === item.type
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-stone-400 dark:text-stone-400 leading-snug">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-800 max-h-28 overflow-y-auto">
              {EMOJI_OPTIONS.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg transition ${
                    icon === em
                      ? 'bg-white dark:bg-stone-700 shadow-sm ring-2 ring-amber-500'
                      : 'hover:bg-white/80 dark:hover:bg-stone-700/60'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Accent */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full ${COLOR_MAP[c].bg} flex items-center justify-center transition transform hover:scale-110 ${
                    color === c ? 'ring-3 ring-offset-2 ring-amber-500 dark:ring-offset-stone-900 scale-110' : ''
                  }`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-xs transition"
            >
              {initialData ? 'Save Changes' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
