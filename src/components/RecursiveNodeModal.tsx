import React, { useState, useEffect } from 'react';
import { CosmicItem } from '../types/cosmos';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import {
  X,
  GitBranch,
  Sparkles,
  Plus,
  CheckCircle2
} from 'lucide-react';

interface RecursiveNodeModalProps {
  item: CosmicItem | null;
  parentListTitle: string;
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onSaveToPersonalList?: (subListTitle: string, items: CosmicItem[]) => void;
}

export const RecursiveNodeModal: React.FC<RecursiveNodeModalProps> = ({
  item,
  parentListTitle,
  isOpen,
  onClose,
  lang,
  onSaveToPersonalList
}) => {
  const [subList, setSubList] = useState<{
    subListTitle: string;
    subListDescription: string;
    items: CosmicItem[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isOpen && item) {
      expandNode(item);
    } else {
      setSubList(null);
      setSaved(false);
    }
  }, [isOpen, item]);

  const expandNode = async (targetItem: CosmicItem) => {
    try {
      setLoading(true);
      const res = await fetch('/api/directory/expand-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeTitle: targetItem.title,
          sublistPrompt: targetItem.sublistPrompt,
          language: lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSubList(data);
      }
    } catch (e) {
      console.error('Error expanding node:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center border border-stone-200 dark:border-stone-700">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                {parentListTitle} / Sub-Branch
              </span>
              <h2 className="text-base font-extrabold text-stone-950 dark:text-white">
                {item.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center animate-spin">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {t.synthesizing}
              </h3>
              <p className="text-xs text-stone-400 max-w-sm">
                Recursively synthesizing taxonomies and sub-elements for "{item.title}"...
              </p>
            </div>
          ) : subList ? (
            <>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <h3 className="text-xs font-bold text-stone-900 dark:text-white">
                  {subList.subListTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {subList.subListDescription}
                </p>
              </div>

              <div className="space-y-2.5">
                {subList.items.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 hover:border-black dark:hover:border-white transition flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                          {sub.title}
                        </h4>
                        {sub.subtitle && (
                          <p className="text-[11px] text-stone-500 font-medium">
                            {sub.subtitle}
                          </p>
                        )}
                        {sub.details && (
                          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                            {sub.details}
                          </p>
                        )}
                        {sub.tags && sub.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {sub.tags.map((tg, i) => (
                              <span
                                key={i}
                                className="text-[9px] px-2 py-0.5 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-mono"
                              >
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-stone-400">
              Unable to expand sub-list.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <span className="text-xs text-stone-400 font-mono">
            {subList ? `${subList.items.length} sub-branches` : ''}
          </span>

          <div className="flex items-center gap-2">
            {subList && onSaveToPersonalList && (
              <button
                type="button"
                onClick={() => {
                  onSaveToPersonalList(subList.subListTitle, subList.items);
                  setSaved(true);
                }}
                disabled={saved}
                className="px-4 py-2 text-xs font-bold rounded-full bg-black text-white dark:bg-white dark:text-black transition flex items-center gap-1.5 shadow-xs disabled:opacity-40 cursor-pointer hover:opacity-90"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Save as Workspace List
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
