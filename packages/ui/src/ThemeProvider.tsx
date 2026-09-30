'use client';

import React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * ==============================================================================
 * MONOCHROMATIC THEME PROVIDER
 * ==============================================================================
 * Strictly enforces Light/Dark tokens defined in index.css without FOUC.
 * The NextThemesProvider injects the "dark" class into the HTML element.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};
