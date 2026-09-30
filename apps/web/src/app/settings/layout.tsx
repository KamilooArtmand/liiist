import React from 'react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col md:flex-row w-full max-w-7xl mx-auto">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 md:shrink-0 p-6 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-[var(--color-border-subtle)]">
        <h2 className="text-xl font-black uppercase tracking-widest text-[var(--color-text-primary)] mb-6">
          Settings
        </h2>
        
        <ul className="flex flex-col gap-1">
          <li>
            <a href="/settings/account" className="block px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] font-bold text-sm">
              Account & Profile
            </a>
          </li>
          <li>
            <a href="/settings/appearance" className="block px-4 py-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-bold text-sm transition-colors">
              Appearance
            </a>
          </li>
          <li>
            <a href="/settings/security" className="block px-4 py-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] font-bold text-sm transition-colors">
              Security & Privacy
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
