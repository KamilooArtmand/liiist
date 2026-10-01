import React from 'react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/i18n-translations';
import { X, User, Mail, Shield, Award, Database, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  totalListsCount: number;
  totalItemsCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  totalListsCount,
  totalItemsCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black  animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-stone-950  border border-stone-200 dark:border-stone-800  overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
              {lang === 'fa' ? 'پروفایل کاربری' : 'User Profile'}
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
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Identity Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
            <div className="w-16 h-16 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-2xl  shrink-0">
              K
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-stone-950 dark:text-white truncate">
                Kamiloo Artmand
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono truncate">
                kamilooartmand@gmail.com
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                  Cosmos Curator
                </span>
                <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Personal Lists
              </span>
              <div className="text-2xl font-black text-stone-950 dark:text-white mt-1 font-mono">
                {totalListsCount}
              </div>
              <span className="text-[10px] text-stone-500">Active Workspaces</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Indexed Items
              </span>
              <div className="text-2xl font-black text-stone-950 dark:text-white mt-1 font-mono">
                {totalItemsCount}
              </div>
              <span className="text-[10px] text-stone-500">Entities in Catalog</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                AI Autonomy Level
              </span>
              <div className="text-sm font-black text-stone-950 dark:text-white mt-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 100% Autonomous
              </div>
              <span className="text-[10px] text-stone-500">Zero-Human Ops</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Design System
              </span>
              <div className="text-sm font-black text-stone-950 dark:text-white mt-1.5">
                Monochrome Tokens
              </div>
              <span className="text-[10px] text-stone-500">White • Gray • Black</span>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-400">Role</span>
              <span className="font-semibold">Super Administrator / Owner</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-stone-400">Storage Backend</span>
              <span className="font-semibold font-mono">Autonomous Local & Server Sync</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-stone-400">Member Since</span>
              <span className="font-semibold">2026-09-29</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-stone-800 flex justify-end bg-stone-50 dark:bg-stone-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold transition hover:opacity-90 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
