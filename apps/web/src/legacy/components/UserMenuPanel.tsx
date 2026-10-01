import React from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import {
  User,
  Settings,
  Bookmark,
  FolderKanban,
  LogOut,
  Moon,
  Sun,
  Activity,
  Bot,
  ChevronRight,
  LayoutGrid,
  Search,
  KeyRound,
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
  onOpenAuth?: () => void;
  onOpenBento?: () => void;
  onOpenCommand?: () => void;
}

/* ── Tooltip-enhanced icon action button ── */
function ActionButton({
  icon,
  label,
  description,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={description || label}
      className={`group relative flex flex-col items-center justify-center gap-1 w-full p-2.5 rounded-xl transition-all duration-150 cursor-pointer
        ${danger
          ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
          : 'text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900'
        }`}
    >
      <span className="flex items-center justify-center w-5 h-5 transition-transform duration-150 group-hover:scale-110">
        {icon}
      </span>
      <span className={`text-[9px] font-semibold uppercase tracking-wide leading-none
        ${danger ? 'text-neutral-400 group-hover:text-red-500' : 'text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'}`}>
        {label}
      </span>

      {/* Tooltip on hover */}
      {description && (
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          {description}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-950 dark:border-t-white" />
        </span>
      )}
    </button>
  );
}

/* ── Full-width row (for dark/light toggle) ── */
function ToggleRow({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={description}
      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors duration-150 cursor-pointer group"
    >
      <span className="flex items-center gap-2 text-[11px] font-medium">
        <span className="flex items-center justify-center w-4 h-4 group-hover:scale-110 transition-transform">
          {icon}
        </span>
        {label}
      </span>
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export const UserMenuPanel: React.FC<UserMenuPanelProps> = ({
  isOpen,
  onClose,
  currentLang,
  isDarkMode,
  onToggleDarkMode,
  onNavigateSection,
  onOpenKernel,
  onOpenSupport,
  onLogout,
  onOpenAuth,
  onOpenBento,
  onOpenCommand,
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang];
  const isFa = currentLang === 'fa';

  return (
    <>
      {/* Invisible backdrop */}
      <div onClick={onClose} className="fixed inset-0 z-40" />

      {/* Panel — compact, minimal, no shadow */}
      <div className="fixed top-[52px] right-4 rtl:right-auto rtl:left-4 z-50
        w-56 rounded-2xl overflow-hidden
        bg-white dark:bg-neutral-950
        border border-neutral-200 dark:border-neutral-800
        flex flex-col
        animate-in fade-in slide-in-from-top-2 duration-150">

        {/* ── Avatar Header ── */}
        <div className="px-3.5 pt-3.5 pb-3 border-b border-neutral-100 dark:border-neutral-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-950 dark:bg-white
            text-white dark:text-neutral-950
            flex items-center justify-center font-bold text-[13px] flex-none select-none shrink-0">
            K
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-neutral-950 dark:text-white truncate leading-tight">
              Kamiloo Artmand
            </p>
            <p className="text-[9.5px] text-neutral-400 font-mono truncate leading-tight mt-0.5">
              @kamilooartmand
            </p>
          </div>
        </div>

        {/* ── Icon Grid Navigation ── */}
        <div className="p-2 grid grid-cols-4 gap-0.5">
          <ActionButton
            icon={<User className="w-4 h-4" />}
            label={isFa ? 'پروفایل' : 'Profile'}
            description="Account overview & curation metrics"
            onClick={() => { onNavigateSection('profile'); onClose(); }}
          />
          <ActionButton
            icon={<FolderKanban className="w-4 h-4" />}
            label={isFa ? 'محتوا' : 'Lists'}
            description="Manage your lists & taxonomies"
            onClick={() => { onNavigateSection('contentManager'); onClose(); }}
          />
          <ActionButton
            icon={<Bookmark className="w-4 h-4" />}
            label={isFa ? 'ذخیره' : 'Saved'}
            description="Saved lists & pinned pages"
            onClick={() => { onNavigateSection('bookmarks'); onClose(); }}
          />
          <ActionButton
            icon={<Settings className="w-4 h-4" />}
            label={isFa ? 'تنظیم' : 'Config'}
            description="Language, display & AI preferences"
            onClick={() => { onNavigateSection('settings'); onClose(); }}
          />
        </div>

        {/* ── Divider ── */}
        <div className="mx-3 h-px bg-neutral-100 dark:bg-neutral-900" />

        {/* ── High-End Features (Bento, ⌘K, SSO) ── */}
        <div className="p-2 grid grid-cols-3 gap-0.5 border-t border-neutral-100 dark:border-neutral-900">
          <ActionButton
            icon={<Search className="w-4 h-4" />}
            label="⌘K Search"
            description="Global Semantic Command Bar"
            onClick={() => {
              if (onOpenCommand) onOpenCommand();
              else window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              onClose();
            }}
          />
          <ActionButton
            icon={<LayoutGrid className="w-4 h-4" />}
            label="Bento Grid"
            description="High-end Bento Grid Architecture"
            onClick={() => { if (onOpenBento) onOpenBento(); onClose(); }}
          />
          <ActionButton
            icon={<KeyRound className="w-4 h-4" />}
            label="Auth / SSO"
            description="Google, Facebook & QA Admin login"
            onClick={() => { if (onOpenAuth) onOpenAuth(); onClose(); }}
          />
        </div>

        {/* ── System ── */}
        <div className="p-2 grid grid-cols-2 gap-0.5 border-t border-neutral-100 dark:border-neutral-900">
          <ActionButton
            icon={<Activity className="w-4 h-4" />}
            label="Kernel"
            description="Autonomous AI telemetry & logs"
            onClick={() => { onOpenKernel(); onClose(); }}
          />
          <ActionButton
            icon={<Bot className="w-4 h-4" />}
            label="AI Help"
            description="24/7 AI support concierge"
            onClick={() => { onOpenSupport(); onClose(); }}
          />
        </div>

        {/* ── Divider ── */}
        <div className="mx-3 h-px bg-neutral-100 dark:bg-neutral-900" />

        {/* ── Footer: Theme + Logout ── */}
        <div className="p-2 flex gap-0.5">
          <div className="flex-1">
            <ToggleRow
              icon={isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              label={isDarkMode ? 'Light' : 'Dark'}
              description={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={onToggleDarkMode}
            />
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Sign out of your account"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150 text-[11px] font-medium cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-semibold uppercase tracking-wide">{isFa ? 'خروج' : 'Exit'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
