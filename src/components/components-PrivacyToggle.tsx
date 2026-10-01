'use client';

import React, { useState } from 'react';
import { Globe, Users, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export type VisibilityType = 'public' | 'friends' | 'private';

interface PrivacyToggleProps {
  visibility: VisibilityType;
  setVisibility: (val: VisibilityType) => void;
  allowFriends: boolean;
  setAllowFriends: (val: boolean) => void;
}

export const PrivacyToggle: React.FC<PrivacyToggleProps> = ({
  visibility,
  setVisibility,
  allowFriends,
  setAllowFriends
}) => {
  return (
    <div className="w-full flex flex-col gap-8 bg-[var(--color-bg-secondary)] p-6 rounded-2xl border border-[var(--color-border-subtle)]">
      
      {/* Visibility Radio Group */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-tertiary)] mb-2">
          List Visibility
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Public Option */}
          <button 
            onClick={() => setVisibility('public')}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors
              ${visibility === 'public' 
                ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-primary)]' 
                : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]'}
            `}
          >
            <Globe className={`w-6 h-6 ${visibility === 'public' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`} />
            <div>
              <span className={`block text-sm font-bold ${visibility === 'public' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Public</span>
              <span className="block text-[10px] text-[var(--color-text-tertiary)] mt-1">Visible to everyone</span>
            </div>
          </button>

          {/* Friends Option */}
          <button 
            onClick={() => setVisibility('friends')}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors
              ${visibility === 'friends' 
                ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-primary)]' 
                : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]'}
            `}
          >
            <Users className={`w-6 h-6 ${visibility === 'friends' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`} />
            <div>
              <span className={`block text-sm font-bold ${visibility === 'friends' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Friends</span>
              <span className="block text-[10px] text-[var(--color-text-tertiary)] mt-1">Mutuals only</span>
            </div>
          </button>

          {/* Private (Only Me) Option */}
          <button 
            onClick={() => setVisibility('private')}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors
              ${visibility === 'private' 
                ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-primary)]' 
                : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)]'}
            `}
          >
            <Lock className={`w-6 h-6 ${visibility === 'private' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-tertiary)]'}`} />
            <div>
              <span className={`block text-sm font-bold ${visibility === 'private' ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>Only Me</span>
              <span className="block text-[10px] text-[var(--color-text-tertiary)] mt-1">Zero data leakage</span>
            </div>
          </button>

        </div>
      </div>

      {/* Collaboration Settings (Only applicable if not Private) */}
      <motion.div 
        animate={{ opacity: visibility === 'private' ? 0.3 : 1 }}
        style={{ pointerEvents: visibility === 'private' ? 'none' : 'auto' }}
        className="flex items-center justify-between pt-6 border-t border-[var(--color-border-subtle)]"
      >
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-sm font-bold text-[var(--color-text-primary)]">
            Allow Friends to Add Items
          </span>
          <span className="text-xs font-serif text-[var(--color-text-secondary)]">
            Collaborative lists allow mutual friends to contribute to this taxonomy.
          </span>
        </div>

        {/* iOS-Style Toggle Switch */}
        <button
          onClick={() => setAllowFriends(!allowFriends)}
          className={`
            relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out shrink-0
            ${allowFriends ? 'bg-[var(--color-text-primary)]' : 'bg-[var(--color-border-strong)]'}
          `}
        >
          <motion.div
            layout
            initial={false}
            animate={{
              x: allowFriends ? 22 : 2,
            }}
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className={`
              absolute top-0.5 w-6 h-6 rounded-full shadow-sm
              ${allowFriends ? 'bg-[var(--color-bg-primary)]' : 'bg-[var(--color-bg-primary)]'}
            `}
          />
        </button>
      </motion.div>

    </div>
  );
};
