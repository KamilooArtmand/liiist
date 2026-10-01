import React from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { User, Activity, Bot, Moon, Sun } from 'lucide-react';

interface HeaderNavProps {
  currentLang: SupportedLanguage;
  onOpenUserMenu: () => void;
  onOpenKernel: () => void;
  onOpenSupport: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onGoHome: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentLang,
  onOpenUserMenu,
  onOpenKernel,
  onOpenSupport,
  isDarkMode,
  onToggleDarkMode,
  onGoHome
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <header className="sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5  bg-white dark:bg-stone-950 border-b border-stone-200/60 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Monogram (Home trigger) */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xl  transition group-hover:scale-105">
            L
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-stone-950 dark:text-white font-mono">
              LIIIST
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              Cosmos OS
            </span>
          </div>
        </div>

        {/* Right Corner: AI Kernel, Support & USER ICON BUTTON */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Autonomous AI Telemetry */}
          <button
            type="button"
            onClick={onOpenKernel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-black dark:hover:border-white transition cursor-pointer"
            title="Autonomous AI Telemetry"
          >
            <Activity className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="hidden md:inline">{t.autonomousAI}</span>
          </button>

          {/* AI Autonomous Support */}
          <button
            type="button"
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-black dark:hover:border-white transition cursor-pointer"
            title="100% Autonomous AI Support"
          >
            <Bot className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span className="hidden md:inline">{t.aiSupportConcierge}</span>
          </button>

          {/* THE USER ICON BUTTON IN THE TOP RIGHT CORNER */}
          <button
            type="button"
            onClick={onOpenUserMenu}
            className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-sm  hover:scale-105 transition cursor-pointer ring-2 ring-stone-200 dark:ring-stone-800"
            title="User Account, Profile, Settings & Content Manager"
            aria-label="User Account Menu"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
