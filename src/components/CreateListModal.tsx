import React, { useState } from 'react';
import { ListGroup, ListType } from '../types';
import { X, CheckSquare, Trophy, ShoppingCart, Compass, FileText } from 'lucide-react';

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

const LIST_TYPES: Array<{ type: ListType; label: string; icon: React.ReactNode; desc: string }> = [
  {
    type: 'todo',
    label: 'To-Do & Tasks',
    icon: <CheckSquare className="w-4 h-4" />,
    desc: 'Due dates, priorities, subtasks, and completion checks'
  },
  {
    type: 'ranked',
    label: 'Ranked Top-N',
    icon: <Trophy className="w-4 h-4" />,
    desc: 'Numbered hierarchy (#1, #2, #3), ratings & reviews'
  },
  {
    type: 'shopping',
    label: 'Shopping & Grocery',
    icon: <ShoppingCart className="w-4 h-4" />,
    desc: 'Categorized by aisle, with quantity counters'
  },
  {
    type: 'bucket',
    label: 'Bucket List & Goals',
    icon: <Compass className="w-4 h-4" />,
    desc: 'Life milestones, adventures, and future goals'
  },
  {
    type: 'notes',
    label: 'Quick Checklist',
    icon: <FileText className="w-4 h-4" />,
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
        color: 'amber',
        icon,
        updatedAt: new Date().toISOString()
      });
    } else {
      onCreate({
        title: title.trim(),
        description: description.trim(),
        type,
        color: 'amber',
        icon,
        sortOrder: type === 'ranked' ? 'rank' : 'manual'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-base font-extrabold text-stone-950 dark:text-white">
              {initialData ? 'Edit List Details' : 'Create New List'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* List Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              List Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Books to Read, Weekly Groceries..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition text-sm font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              placeholder="Brief note about this list..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition text-sm"
            />
          </div>

          {/* List Type / Archetype */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              List Archetype
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LIST_TYPES.map(item => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setType(item.type)}
                  className={`text-left p-3 rounded-2xl border text-sm transition flex flex-col gap-1 cursor-pointer ${
                    type === item.type
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-300 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[11px] opacity-70 leading-snug">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Choose Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 max-h-24 overflow-y-auto">
              {EMOJI_OPTIONS.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-8 h-8 flex items-center justify-center text-base rounded-xl transition ${
                    icon === em
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'hover:bg-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-xs font-bold text-white dark:text-black bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 rounded-full shadow-xs transition cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
