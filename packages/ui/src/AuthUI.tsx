'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { microSpring } from './animations';

// Icons placeholder since Lucide doesn't have brand icons
const GoogleIcon = () => <div className="w-5 h-5 rounded-full bg-red-500" />;
const FacebookIcon = () => <div className="w-5 h-5 rounded-sm bg-blue-600" />;
const ShieldIcon = () => <div className="w-5 h-5 rounded-sm bg-neutral-800" />;

export interface AuthUIProps {
  strings: {
    title: string;
    google: string;
    facebook: string;
    devLogin: string;
  };
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  onDevAdminLogin: () => Promise<void>;
}

export const AuthUI: React.FC<AuthUIProps> = ({ strings, onGoogleLogin, onFacebookLogin, onDevAdminLogin }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (provider: string, action: () => Promise<void>) => {
    setLoading(provider);
    try {
      await action();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-[var(--color-bg-primary)] border-2 border-[var(--color-text-primary)] rounded-none shadow-none flex flex-col gap-6">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--color-text-primary)] text-center">
        {strings.title}
      </h2>

      <div className="flex flex-col gap-4">
        {/* Google SSO */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={microSpring}
          onClick={() => handleAction('google', onGoogleLogin)}
          disabled={!!loading}
          className="w-full relative flex items-center justify-center gap-3 py-3 border border-[var(--color-border-strong)] hover:border-[var(--color-text-primary)] transition-colors rounded-none disabled:opacity-50"
        >
          <GoogleIcon />
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
            {loading === 'google' ? '...' : strings.google}
          </span>
        </motion.button>

        {/* Facebook SSO */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={microSpring}
          onClick={() => handleAction('facebook', onFacebookLogin)}
          disabled={!!loading}
          className="w-full relative flex items-center justify-center gap-3 py-3 border border-[var(--color-border-strong)] hover:border-[var(--color-text-primary)] transition-colors rounded-none disabled:opacity-50"
        >
          <FacebookIcon />
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
            {loading === 'facebook' ? '...' : strings.facebook}
          </span>
        </motion.button>

        {/* DEV ONLY ADMIN BYPASS */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-dashed border-red-500/50"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={microSpring}
              onClick={() => handleAction('admin', onDevAdminLogin)}
              disabled={!!loading}
              className="w-full relative flex items-center justify-center gap-3 py-3 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity rounded-none disabled:opacity-50"
            >
              <ShieldIcon />
              <span className="text-xs font-black uppercase tracking-widest">
                {loading === 'admin' ? '...' : strings.devLogin}
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
