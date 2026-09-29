import React from 'react';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { Settings, X, Globe, Moon, Sun, Cpu, Check, Sliders } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectLang,
  isDarkMode,
  onToggleDarkMode
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black  animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-stone-950  border border-stone-200 dark:border-stone-800  overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
              {lang === 'fa' ? 'تنظیمات سامانه (Settings)' : 'System Settings'}
            </h2>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Language & Direction (زبان و جهت‌گیری)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(LANGUAGES) as SupportedLanguage[]).map(langKey => {
                const info = LANGUAGES[langKey];
                const isSelected = lang === langKey;

                return (
                  <button
                    key={langKey}
                    type="button"
                    onClick={() => onSelectLang(langKey)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black '
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>{info.flag}</span>
                      <span>{info.nativeName}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display & Appearance */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" />
              <span>Monochrome Theme (پوسته مونوکروم)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isDarkMode) onToggleDarkMode();
                }}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  !isDarkMode
                    ? 'border-black bg-black text-white '
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light Glass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isDarkMode) onToggleDarkMode();
                }}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isDarkMode
                    ? 'border-white bg-white text-black '
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark Obsidian</span>
              </button>
            </div>
          </div>

          {/* Autonomous AI Invariants */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Autonomous Protocol</span>
            </label>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">
                    Zero-Human Self-Healing
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Automatic repair of indexing pointers & cache balancing
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/50 dark:border-stone-800">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white block">
                    Autonomous Concierge 24/7
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Fully automated customer support without human operators
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 font-bold">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
