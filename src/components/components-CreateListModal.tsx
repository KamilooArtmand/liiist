import React, { useEffect, useState } from 'react';
import { ListGroup, ListItem, ListType } from '../types/types-index';
import { Plus, X } from 'lucide-react';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newList: Omit<ListGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: ListGroup | null;
  onUpdate?: (updated: ListGroup) => void;
}

const EMOJI_OPTIONS = [
  '📋', '🌍', '🎬', '📚', '🏙️', '🗣️', '⚡', '🎯', '🛒', '🧭',
  '💼', '💡', '🚀', '🎨', '🎧', '✈️', '🪴', '☕', '🔥', '✨'
];

function slugHandle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug ? `@${slug}` : '@list';
}

function parseCatalogLines(raw: string): Array<{ title: string; subtitle?: string }> {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(/\s+[—–•|]\s+|\s+-\s+/);
      const title = (parts[0] || line).trim();
      const subtitle = parts.slice(1).join(' — ').trim() || undefined;
      return { title, subtitle };
    });
}

function linesFromList(list?: ListGroup | null): string {
  if (!list?.items?.length) return '';
  return list.items
    .map(item => (item.notes ? `${item.title} — ${item.notes}` : item.title))
    .join('\n');
}

export const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
  onUpdate
}) => {
  const [title, setTitle] = useState('');
  const [handle, setHandle] = useState('@');
  const [handleTouched, setHandleTouched] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [itemsText, setItemsText] = useState('');
  const [type, setType] = useState<ListType>('ranked');
  const [icon, setIcon] = useState('📋');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialData?.title || '');
    setHandle(initialData?.handle || (initialData?.title ? slugHandle(initialData.title) : '@'));
    setHandleTouched(Boolean(initialData?.handle));
    setSubtitle(initialData?.subtitle || initialData?.description || '');
    setItemsText(linesFromList(initialData));
    setType(initialData?.type || 'ranked');
    setIcon(initialData?.icon || '📋');
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const parsedRows = parseCatalogLines(itemsText);

  const buildItems = (): ListItem[] =>
    parsedRows.map((row, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      title: row.title,
      notes: row.subtitle,
      completed: false,
      priority: idx < 3 ? 'p1' : idx < 8 ? 'p2' : 'p3',
      tags: [],
      rank: idx + 1,
      createdAt: new Date().toISOString()
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const nextHandle = (handle.trim() || slugHandle(title)).replace(/^@+/, '@');
    const nextSubtitle = subtitle.trim();
    const items = buildItems();

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        title: title.trim(),
        description: nextSubtitle,
        subtitle: nextSubtitle,
        handle: nextHandle.startsWith('@') ? nextHandle : `@${nextHandle}`,
        type,
        color: initialData.color || 'amber',
        icon,
        items: items.length ? items : initialData.items,
        sortOrder: type === 'ranked' ? 'rank' : initialData.sortOrder,
        updatedAt: new Date().toISOString()
      });
    } else {
      onCreate({
        title: title.trim(),
        description: nextSubtitle,
        subtitle: nextSubtitle,
        handle: nextHandle.startsWith('@') ? nextHandle : `@${nextHandle}`,
        origin: 'user',
        type,
        color: 'amber',
        icon,
        items,
        sortOrder: type === 'ranked' ? 'rank' : 'manual'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-950 rounded-[20px] border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-center text-sm">
              {icon}
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-neutral-950 dark:text-white tracking-tight leading-tight">
                {initialData ? 'Edit list' : 'Create a list'}
              </h2>
              <span className="font-mono text-[9px] text-neutral-400 block mt-0.5">
                Same column format as landing catalogs
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
              List name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Cities of New York State"
              value={title}
              onChange={e => {
                const next = e.target.value;
                setTitle(next);
                if (!handleTouched) setHandle(slugHandle(next));
              }}
              className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-[13px] font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Handle
              </label>
              <input
                type="text"
                placeholder="@ny-cities"
                value={handle}
                onChange={e => {
                  setHandleTouched(true);
                  setHandle(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                placeholder="Incorporated Municipalities"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-[12px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Items — one per line
              </label>
              <span className="font-mono text-[10px] text-neutral-400 tabular-nums">
                {parsedRows.length} cataloged
              </span>
            </div>
            <textarea
              rows={10}
              placeholder={'New York City — 8,258,035\nBuffalo — 276,807\nYonkers — 211,569'}
              value={itemsText}
              onChange={e => setItemsText(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono text-[11px] leading-relaxed resize-y min-h-[180px]"
            />
            <p className="mt-1.5 text-[10px] font-mono text-neutral-400">
              Optional secondary text after — or | (capital, year, population)
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {EMOJI_OPTIONS.map(em => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setIcon(em)}
                  className={`w-8 h-8 flex items-center justify-center text-base rounded-xl transition ${
                    icon === em
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-[11px] font-mono font-medium text-white dark:text-black bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 rounded-full transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{initialData ? 'Save list' : 'Create list'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
