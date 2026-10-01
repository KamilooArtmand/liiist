import React, { useState } from 'react';
import { ListItem, ListType, Priority, Subtask } from '../types/types-index';
import { PRIORITY_CONFIG, formatDueDate } from '../utils/utils-helpers';
import {
  X,
  Trash2,
  Calendar,
  Tag,
  Plus,
  CheckCircle2,
  Circle,
  Star,
  ExternalLink
} from 'lucide-react';

interface ItemDetailModalProps {
  item: ListItem | null;
  listType: ListType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ListItem) => void;
  onDelete: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  listType,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title);
  const [completed, setCompleted] = useState(item.completed);
  const [priority, setPriority] = useState<Priority>(item.priority || 'p3');
  const [notes, setNotes] = useState(item.notes || '');
  const [dueDate, setDueDate] = useState(item.dueDate || '');
  const [category, setCategory] = useState(item.category || '');
  const [quantity, setQuantity] = useState(item.quantity || '');
  const [rank, setRank] = useState<number | undefined>(item.rank);
  const [score, setScore] = useState<number | undefined>(item.score);
  const [subtasks, setSubtasks] = useState<Subtask[]>(item.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tags, setTags] = useState<string[]>(item.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...item,
      title: title.trim(),
      completed,
      priority,
      notes: notes.trim(),
      dueDate: dueDate || undefined,
      category: category.trim() || undefined,
      quantity: quantity.trim() || undefined,
      rank: rank ? Number(rank) : undefined,
      score: score ? Number(score) : undefined,
      subtasks,
      tags
    });
    onClose();
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false
      }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    setSubtasks(
      subtasks.map(s => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveSubtask = (subId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const dateBadge = formatDueDate(dueDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black  animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-950  rounded-3xl  border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompleted(!completed)}
              className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
              title={completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {completed ? (
                <CheckCircle2 className="w-5 h-5 text-stone-900 dark:text-stone-100" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <span className="text-xs uppercase font-extrabold tracking-wider text-stone-400">
              {listType === 'ranked' ? `Rank #${rank || '-'}` : 'Item Details'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this item permanently?')) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-full text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Item title..."
              className={`w-full text-lg font-bold bg-transparent border-b border-transparent hover:border-stone-300 dark:hover:border-stone-700 focus:border-black dark:focus:border-white focus:outline-none pb-1 text-stone-950 dark:text-white transition ${
                completed ? 'line-through opacity-50' : ''
              }`}
            />
          </div>

          {/* Quick Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Priority
              </label>
              <div className="flex items-center gap-1.5">
                {(['p1', 'p2', 'p3', 'p4'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      priority === p
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black '
                        : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {PRIORITY_CONFIG[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Due Date
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                />
                {dateBadge && (
                  <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 whitespace-nowrap">
                    {dateBadge.text}
                  </span>
                )}
              </div>
            </div>

            {/* Shopping: Category & Quantity */}
            {listType === 'shopping' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Category / Aisle
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Produce, Pantry"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    placeholder="e.g. 2 boxes, 1 kg"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Ranked: Rank & Score */}
            {listType === 'ranked' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Position Rank (#)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rank ?? ''}
                    onChange={e => setRank(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g. 1"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Score / Rating (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={score ?? ''}
                    onChange={e => setScore(e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="e.g. 9.5"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Subtasks ({subtasks.filter(s => s.completed).length}/{subtasks.length})
              </label>
            </div>

            <div className="space-y-2 mb-3">
              {subtasks.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-2 text-xs text-left flex-1 min-w-0"
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-stone-950 dark:text-white shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                    <span className={sub.completed ? 'line-through opacity-50' : ''}>
                      {sub.title}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-stone-400 hover:text-red-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask and press Enter..."
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              >
                + Add
              </button>
            </form>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Notes & Context
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add links, specs, reflections..."
              className="w-full px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs focus:outline-none resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-end gap-3 bg-stone-50 dark:bg-stone-900">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-5 py-2 text-xs font-bold text-white dark:text-black bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 rounded-full  transition cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
