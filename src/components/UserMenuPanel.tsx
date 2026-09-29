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
  Globe,
  X,
  ChevronRight,
  Shield,
  Activity,
  Bot
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
  onLogout
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over Card / Panel in Top Corner */}
      <div className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-50 w-84 sm:w-96 rounded-3xl bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-3 duration-200">
        {/* User Card Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between bg-stone-50/60 dark:bg-stone-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              K
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-stone-950 dark:text-white truncate">
                Kamiloo Artmand
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono truncate">
                kamilooartmand@gmail.com
              </p>
              <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                Cosmos Curator • AI OS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[60vh]">
          {/* Profile */}
          <button
            type="button"
            onClick={() => {
              onNavigateSection('profile');
              onClose();
            }}
            className="w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs font-semibold group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="block font-bold">
                  {currentLang === 'fa' ? 'صفحه پروفایل' : 'Profile'}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Account overview & curation metrics
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 rtl:rotate-180" />
          </button>

          {/* Content Manager */}
          <button
            type="button"
            onClick={() => {
              onNavigateSection('contentManager');
              onClose();
            }}
            className="w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs font-semibold group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="block font-bold">
                  {currentLang === 'fa' ? 'مدیریت محتوا (Content Manager)' : 'Content Manager'}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Manage lists, categories & taxonomies
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 rtl:rotate-180" />
          </button>

          {/* Bookmark Manager */}
          <button
            type="button"
            onClick={() => {
              onNavigateSection('bookmarks');
              onClose();
            }}
            className="w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs font-semibold group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                <Bookmark className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="block font-bold">
                  {currentLang === 'fa' ? 'مدیریت بوکمارک‌ها (Bookmarks)' : 'Bookmark Manager'}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Saved universal lists & pinned favorites
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 rtl:rotate-180" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              onNavigateSection('settings');
              onClose();
            }}
            className="w-full px-3.5 py-3 rounded-2xl flex items-center justify-between text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 transition text-xs font-semibold group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <span className="block font-bold">
                  {currentLang === 'fa' ? 'تنظیمات (Settings)' : 'Settings'}
                </span>
                <span className="text-[10px] text-stone-400 font-normal">
                  Language, display & AI preferences
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 rtl:rotate-180" />
          </button>

          <div className="pt-2 pb-1">
            <div className="h-px bg-stone-100 dark:bg-stone-800" />
          </div>

          {/* AI Kernel Diagnostics Shortcut */}
          <button
            type="button"
            onClick={() => {
              onOpenKernel();
              onClose();
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <span className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-stone-400" />
              <span>{t.autonomousAI}</span>
            </span>
            <span className="text-[10px] font-mono text-stone-400">Telemetry</span>
          </button>

          {/* AI Autonomous Concierge Support Shortcut */}
          <button
            type="button"
            onClick={() => {
              onOpenSupport();
              onClose();
            }}
            className="w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition"
          >
            <span className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-stone-400" />
              <span>{t.aiSupportConcierge}</span>
            </span>
            <span className="text-[10px] font-mono text-stone-400">24/7 AI</span>
          </button>
        </div>

        {/* Footer Actions: Logout */}
        <div className="p-3 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-between">
          {/* Theme Quick Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition text-xs font-medium flex items-center gap-1.5"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-[11px]">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>

          {/* Logout Action */}
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-2 rounded-xl text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{currentLang === 'fa' ? 'خروج از حساب' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
