'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CommandBar, 
  InstallWidget, 
  BentoGrid, 
  AuthUI, 
  InfiniteVirtualizedList, 
  ProfileTabs, 
  ActivityFeed,
  SettingsGroup,
  SettingsRow,
  DangerZone,
  ThemeToggleRow
} from '@liiist/ui';
import { Search, Moon, Sun, Shield, Smartphone, UserX, CheckCircle, ArrowLeft } from 'lucide-react';
import { MOVIES_100 } from '../data/moviesData';
import { COUNTRIES_DATA } from '../data/countriesData';

type ModernView = 'stream' | 'bento' | 'profile' | 'settings' | 'auth' | 'classic';

interface ModernLiiistExperienceProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenClassicApp: () => void;
}

export const ModernLiiistExperience: React.FC<ModernLiiistExperienceProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenClassicApp
}) => {
  const [activeTab, setActiveTab] = useState<ModernView>('stream');

  // Convert raw movies and countries to virtualized items
  const virtualizedItems = React.useMemo(() => {
    const movieItems = MOVIES_100.map((m, idx) => ({
      id: `movie-${idx}`,
      slug: m.title.toLowerCase().replace(/\s+/g, '-'),
      title: m.title,
      subtitle: `${m.year} • Dir. ${m.director} • IMDb: ${m.imdbScore}`,
      cover_url: undefined
    }));

    const countryItems = COUNTRIES_DATA.map((c) => ({
      id: `country-${c.code}`,
      slug: c.name.toLowerCase().replace(/\s+/g, '-'),
      title: c.name,
      subtitle: `${c.continent} • Capital: ${c.capital} • Pop: ${(c.population / 1_000_000).toFixed(1)}M`,
      cover_url: undefined
    }));

    return [...movieItems, ...countryItems];
  }, []);

  const handleFetchNextPage = async (offset: number, limit: number) => {
    // Simulate instantaneous async chunk pagination
    return virtualizedItems.slice(offset, offset + limit);
  };

  const mockActivities = [
    {
      id: 'act-1',
      type: 'like' as const,
      userHandle: 'kamiloo',
      targetTitle: '2001: A Space Odyssey',
      targetType: 'Cinema',
      timestamp: '2 hours ago'
    },
    {
      id: 'act-2',
      type: 'comment' as const,
      userHandle: 'kamiloo',
      targetTitle: 'Berlin Tech Cafes',
      targetType: 'UGC List',
      content: 'The spatial rhythm and minimalism of this list makes taxonomy a true pleasure.',
      timestamp: 'Yesterday'
    },
    {
      id: 'act-3',
      type: 'like' as const,
      userHandle: 'kamiloo',
      targetTitle: 'Federal Republic of Germany',
      targetType: 'Geography',
      timestamp: '3 days ago'
    }
  ];

  return (
    <div className={`min-h-screen w-full flex flex-col ${isDarkMode ? 'dark bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* ── HIGH-END TOP BAR (Linear / Framer Aesthetic) ── */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-900 bg-white/95 dark:bg-black/95 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Brand Identity: | and o */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setActiveTab('stream')}>
            <span className="w-1.5 h-6 bg-black dark:bg-white rounded-full" />
            <h1 className="text-xl font-black tracking-tighter uppercase font-mono">
              liiist
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-500 uppercase tracking-widest border border-neutral-200 dark:border-neutral-800">
              v2.0 Linear Arch
            </span>
          </div>
        </div>

        {/* Dynamic Mode Switcher (Seamless Tabs) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('stream')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'stream'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Infinite Stream (| & o)
          </button>
          <button
            onClick={() => setActiveTab('bento')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'bento'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Bento Matrix
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Profile (@kamiloo)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Settings (iOS)
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
              activeTab === 'auth'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            SSO / Auth
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick ⌘K Button */}
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all cursor-pointer"
            title="Search the Cosmos (Ctrl+K or ⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-800 rounded font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full border border-neutral-300 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Switch to Classic Prototype */}
          <button
            onClick={onOpenClassicApp}
            className="text-[11px] font-mono underline text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            title="Switch back to the classic capsule prototype"
          >
            Classic View
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex overflow-x-auto gap-2 p-2 border-b border-neutral-200 dark:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-xs font-bold uppercase scrollbar-none">
        {(['stream', 'bento', 'profile', 'settings', 'auth'] as ModernView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'text-neutral-500 bg-neutral-200 dark:bg-neutral-900'
            }`}
          >
            {tab === 'stream' ? 'Infinite Stream' : tab}
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT VIEWPORT ── */}
      <main className="flex-1 flex flex-col w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* 1. INFINITE VIRTUALIZED STREAM (| and o IDENTITY) */}
          {activeTab === 'stream' && (
            <motion.div
              key="stream"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col py-8"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-8 mb-6 w-full">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  High-Performance Virtual Scrolling (60fps @tanstack/react-virtual)
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
                  Infinite Vertical Column
                </h2>
                <p className="text-sm font-serif text-neutral-500 dark:text-neutral-400 mt-2">
                  Rendering rows with pure minimalist line (<span className="font-mono font-bold">|</span>) and geometric primitive cover (<span className="font-mono font-bold">o</span>), adhering to the core Liiist visual identity.
                </p>
              </div>

              <div className="w-full max-w-4xl mx-auto border-t border-b border-neutral-200 dark:border-neutral-900 bg-white dark:bg-black">
                <InfiniteVirtualizedList
                  initialItems={virtualizedItems.slice(0, 30)}
                  totalCount={virtualizedItems.length}
                  fetchNextPage={handleFetchNextPage}
                />
              </div>
            </motion.div>
          )}

          {/* 2. BENTO GRID ARCHITECTURE (CONTAINER QUERIES + FLUID TYPOGRAPHY) */}
          {activeTab === 'bento' && (
            <motion.div
              key="bento"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 flex flex-col gap-6"
            >
              <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  Modular Container Query Architecture (@container)
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
                  Bento Grid Matrix
                </h2>
                <p className="text-sm font-serif text-neutral-500 dark:text-neutral-400 mt-2">
                  Zero margin debt, fluid clamp typography, and Framer Motion spring micro-physics. Click any card to expand.
                </p>
              </div>

              <BentoGrid 
                entityName="Cosmic Taxonomy" 
                entityType="Universal Directory" 
              />
            </motion.div>
          )}

          {/* 3. USER PROFILE ARCHITECTURE (IDENTITY & SOCIAL TAXONOMY) */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[24/7] bg-neutral-200 dark:bg-neutral-900 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="Cover" 
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              {/* Profile Card Header */}
              <div className="max-w-4xl mx-auto px-4 sm:px-8 w-full -mt-12 sm:-mt-16 relative z-10 flex flex-col gap-4">
                <div className="flex items-end justify-between">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-black overflow-hidden bg-neutral-800 shadow-2xl">
                    <img src="https://github.com/KamilooArtmand.png" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button className="px-5 py-2 rounded-full border border-black dark:border-white text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer">
                    Edit Profile
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                      Kamiloo Artmand
                    </h2>
                    <CheckCircle className="w-5 h-5 text-blue-500 fill-current" />
                  </div>
                  <span className="font-mono text-sm text-neutral-400">@kamilooartmand</span>
                  <p className="text-sm font-serif text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl leading-relaxed">
                    Lead Architect & Creator of Liiist — cataloging the entire cosmos through rigorous monochromatic taxonomy.
                  </p>
                </div>

                {/* Profile Tabs */}
                <div className="mt-6 border-b border-neutral-200 dark:border-neutral-900">
                  <ProfileTabs />
                </div>

                {/* Activity Feed Timeline (| and o identity) */}
                <div className="py-6">
                  <ActivityFeed activities={mockActivities} />
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. SETTINGS & DANGER ZONE (iOS NATIVE FEEL) */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto px-4 sm:px-8 py-10 w-full flex flex-col gap-8"
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  Native Grouped Interface (iOS & macOS Design Language)
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
                  System Settings
                </h2>
              </div>

              {/* Appearance */}
              <SettingsGroup title="Display & Theme">
                <SettingsRow 
                  label="Dark Mode" 
                  value={isDarkMode ? 'Monochrome Black' : 'Pure White'}
                  onClick={onToggleDarkMode}
                  hasBorder={false}
                />
              </SettingsGroup>

              {/* Security & Sessions */}
              <SettingsGroup title="Security & Authentication">
                <SettingsRow 
                  label="Two-Factor Authentication (2FA)" 
                  value="Enabled via WebAuthn"
                  icon={Shield}
                />
                <SettingsRow 
                  label="Active Sessions" 
                  value="1 Current Device"
                  icon={Smartphone}
                />
                <SettingsRow 
                  label="Blocked Users" 
                  value="0 Users"
                  icon={UserX}
                  hasBorder={false}
                />
              </SettingsGroup>

              {/* Danger Zone */}
              <div>
                <DangerZone />
              </div>
            </motion.div>
          )}

          {/* 5. SSO AUTHENTICATION (GOOGLE, FACEBOOK & QA ADMIN) */}
          {activeTab === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto px-4 py-16 w-full flex flex-col items-center justify-center"
            >
              <AuthUI
                strings={{
                  title: 'Authenticate',
                  google: 'Continue with Google',
                  facebook: 'Continue with Facebook',
                  devLogin: 'DEV: Login as Admin (admin/admin)'
                }}
                onGoogleLogin={async () => alert('Google OAuth initiated!')}
                onFacebookLogin={async () => alert('Facebook OAuth initiated!')}
                onDevAdminLogin={async () => {
                  alert('Authenticated immediately as QA Admin bypass!');
                  setActiveTab('profile');
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Command Bar ⌘K (Framer Spring Physics) */}
      <CommandBar />

      {/* OS-Aware Smart PWA Install Widget (Flat Architecture) */}
      <InstallWidget />

    </div>
  );
};
