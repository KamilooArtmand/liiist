'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'lists', label: 'Lists' },
  { id: 'saves', label: 'Saves' },
  { id: 'comments', label: 'Comments' },
  { id: 'likes', label: 'Likes' },
];

export const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full border-b border-[var(--color-border-subtle)] mt-12 px-4 md:px-8">
      <div className="flex gap-8 relative max-w-5xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative pb-4 text-sm font-bold uppercase tracking-widest transition-colors
              ${activeTab === tab.id 
                ? 'text-[var(--color-text-primary)]' 
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]'}
            `}
          >
            {tab.label}
            
            {/* Framer Motion Fluid Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--color-text-primary)]"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  mass: 1
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
