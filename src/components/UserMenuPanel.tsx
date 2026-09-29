import React from 'react';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import {
  User,
  Settings,
  Bookmark,
  FolderKanban,
  LogOut,
  Moon,
  Sun,
  X,
  ChevronRight,
  Activity,
  Bot,
} from 'lucide-react';

export type UserMenuSection = 'menu' | 'profile' | 'settings' | 'bookmarks' | 'contentManager';

interface UserMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateSection: (section: UserMenuSection) => void;
  onOpenKernel: () => void;
  onOpenSupport: () => void;
  onLogout: () => void;
}

/* ── reusable menu row ── */
function MenuRow({
  icon,
  label,
  sub,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl
        text-neutral-800 dark:text-neutral-200
        hover:bg-neutral-100 dark:hover:bg-neutral-900
        transition-colors duration-100 cursor-pointer group"
    >
      <span className="flex items-center gap-3 min-w-0">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-none
          bg-neutral-100 dark:bg-neutral-900
          text-neutral-500 dark:text-neutral-400
          group-hover:bg-neutral-950 group-hover:text-white
          dark:group-hover:bg-white dark:group-hover:text-neutral-950
          transition-colors duration-100">
          {icon}
        </span>
        <span className="text-left min-w-0">
          <span className="block text-[12.5px] font-semibold leading-tight truncate">{label}</span>
          {sub && <span className="block text-[10.5px] text-neutral-400 dark:text-neutral-500 font-normal leading-tight mt-[1px] truncate">{sub}</span>}
        </span>
      </span>
      {badge
        ? <span className="text-[9.5px] font-mono text-neutral-400 shrink-0 ml-2">{badge}</span>
        : <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0 ml-2" />
      }
    </button>
  );
}

export const UserMenuPanel: React.FC<UserMenuPanelProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
  isDarkMode,
  onToggleDarkMode,
  onNavigateSection,
  onOpenKernel,
  onOpenSupport,
  onLogout,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang];

  return (
    <>
      {/* Invisible backdrop — no blur, no dim */}
      <div onClick={onClose} className="fixed inset-0 z-40" />

      {/* Panel — flat, solid surface, border only */}
      <div className="fixed top-[52px] right-4 rtl:right-auto rtl:left-4 z-50
        w-80 rounded-2xl overflow-hidden
        bg-white dark:bg-neutral-950
        border border-neutral-200 dark:border-neutral-800
        flex flex-col
        animate-in fade-in slide-in-from-top-2 duration-150">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3.5
          border-b border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-neutral-950 dark:bg-white
              text-white dark:text-neutral-950
              flex items-center justify-center font-bold text-sm flex-none select-none">
              K
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-neutral-950 dark:text-white truncate leading-tight">
                Kamiloo Artmand
              </p>
              <p className="text-[10.5px] text-neutral-400 dark:text-neutral-500 font-mono truncate leading-tight mt-[1px]">
                kamilooartmand@gmail.com
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-none
              text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-colors duration-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Nav items ── */}
        <div className="p-2 space-y-0.5">
          <MenuRow
            icon={<User className="w-3.5 h-3.5" />}
            label={currentLang === 'fa' ? 'پروفایل' : 'Profile'}
            sub="Account overview & curation metrics"
            onClick={() => { onNavigateSection('profile'); onClose(); }}
          />
          <MenuRow
            icon={<FolderKanban className="w-3.5 h-3.5" />}
            label={currentLang === 'fa' ? 'مدیریت محتوا' : 'Content Manager'}
            sub="Lists, categories & taxonomies"
            onClick={() => { onNavigateSection('contentManager'); onClose(); }}
          />
          <MenuRow
            icon={<Bookmark className="w-3.5 h-3.5" />}
            label={currentLang === 'fa' ? 'بوکمارک‌ها' : 'Bookmarks'}
            sub="Saved lists & pinned pages"
            onClick={() => { onNavigateSection('bookmarks'); onClose(); }}
          />
          <MenuRow
            icon={<Settings className="w-3.5 h-3.5" />}
            label={currentLang === 'fa' ? 'تنظیمات' : 'Settings'}
            sub="Language, display & AI preferences"
            onClick={() => { onNavigateSection('settings'); onClose(); }}
          />
        </div>

        {/* divider */}
        <div className="mx-4 h-px bg-neutral-100 dark:bg-neutral-900" />

        {/* ── System shortcuts ── */}
        <div className="p-2 space-y-0.5">
          <MenuRow
            icon={<Activity className="w-3.5 h-3.5" />}
            label={t.autonomousAI}
            badge="Telemetry"
            onClick={() => { onOpenKernel(); onClose(); }}
          />
          <MenuRow
            icon={<Bot className="w-3.5 h-3.5" />}
            label={t.aiSupportConcierge}
            badge="24/7 AI"
            onClick={() => { onOpenSupport(); onClose(); }}
          />
        </div>

        {/* divider */}
        <div className="mx-4 h-px bg-neutral-100 dark:bg-neutral-900" />

        {/* ── Footer ── */}
        <div className="p-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
              text-neutral-500 dark:text-neutral-400
              hover:text-neutral-900 dark:hover:text-white
              hover:bg-neutral-100 dark:hover:bg-neutral-900
              transition-colors duration-100 text-[11.5px] font-medium cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
              text-neutral-500 dark:text-neutral-400
              hover:text-red-600 dark:hover:text-red-400
              hover:bg-red-50 dark:hover:bg-red-950/40
              transition-colors duration-100 text-[11.5px] font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{currentLang === 'fa' ? 'خروج' : 'Log out'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
