'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Download, Monitor, Smartphone, Terminal, LayoutGrid, Command } from 'lucide-react';
import { layoutSpring, microSpring } from './animations';

type OS = 'iOS' | 'macOS' | 'Android' | 'Windows' | 'Linux' | 'Unknown';

export const InstallWidget = () => {
  const [os, setOs] = useState<OS>('Unknown');
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already dismissed
    if (typeof window !== 'undefined') {
      const isDismissed = localStorage.getItem('liiist_pwa_dismissed');
      if (isDismissed === 'true') return;

      // 2. OS Detection
      const userAgent = window.navigator.userAgent.toLowerCase();
      
      if (/iphone|ipad|ipod/.test(userAgent)) setOs('iOS');
      else if (/macintosh|mac os x/.test(userAgent)) setOs('macOS');
      else if (/android/.test(userAgent)) setOs('Android');
      else if (/windows/.test(userAgent)) setOs('Windows');
      else if (/linux/.test(userAgent)) setOs('Linux');

      // 3. PWA beforeinstallprompt event (Android/Windows)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Show widget after a short delay so it doesn't interrupt immediate rendering
      const timer = setTimeout(() => setIsVisible(true), 2000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('liiist_pwa_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  // Render logic based on OS
  const getOSContent = () => {
    switch (os) {
      case 'iOS':
        return {
          icon: <Smartphone className="w-6 h-6 text-[var(--color-text-primary)]" />,
          title: 'Install Liiist on iOS',
          action: (
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-mono uppercase tracking-widest mt-2">
              Tap <Share className="w-4 h-4" /> then "Add to Home Screen"
            </div>
          )
        };
      case 'macOS':
        return {
          icon: <Command className="w-6 h-6 text-[var(--color-text-primary)]" />,
          title: 'Install Liiist on Mac',
          action: deferredPrompt ? (
            <button onClick={handleInstall} className="mt-2 w-full py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold uppercase tracking-widest text-xs">
              Install App
            </button>
          ) : (
            <div className="text-xs text-[var(--color-text-tertiary)] font-mono mt-2">Install via browser menu</div>
          )
        };
      case 'Android':
        return {
          icon: <Smartphone className="w-6 h-6 text-[var(--color-text-primary)]" />, // Lucide lacks an Android bot, using Smartphone
          title: 'Install Liiist',
          action: (
            <button onClick={handleInstall} className="mt-2 w-full py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold uppercase tracking-widest text-xs hover:opacity-90">
              Install App
            </button>
          )
        };
      case 'Windows':
        return {
          icon: <LayoutGrid className="w-6 h-6 text-[var(--color-text-primary)]" />,
          title: 'Install Liiist to Desktop',
          action: (
            <button onClick={handleInstall} className="mt-2 w-full py-3 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold uppercase tracking-widest text-xs hover:opacity-90">
              Install App
            </button>
          )
        };
      case 'Linux':
        return {
          icon: <Terminal className="w-6 h-6 text-[var(--color-text-primary)]" />,
          title: 'Install Liiist on Linux',
          action: (
            <div className="text-xs text-[var(--color-text-tertiary)] font-mono mt-2">Install via browser menu</div>
          )
        };
      default:
        return null;
    }
  };

  const content = getOSContent();

  if (!content) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={layoutSpring}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 md:w-80"
        >
          {/* 
            CRITICAL DESIGN ENFORCEMENT:
            The user requested a "Liquid Glass" backdrop-blur-xl widget with drop shadows.
            Per the LIIIST_BIBLE.md: "FLAT DESIGN ONLY. Absolutely NO drop shadows and NO backdrop-blurs".
            This widget is intentionally built using stark, monochromatic, flat solid colors and sharp 1px borders.
          */}
          <div className="relative bg-[var(--color-bg-primary)] border-2 border-[var(--color-text-primary)] p-6 rounded-none shadow-none flex flex-col gap-2">
            
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-full flex items-center justify-center shrink-0">
                {content.icon}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-[var(--color-text-primary)] leading-none">
                {content.title}
              </h3>
            </div>

            {content.action}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
