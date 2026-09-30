'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { SettingsRow } from './SettingsComponents';
import { Moon, Sun, Monitor } from 'lucide-react';

export const ThemeToggleRow = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SettingsRow label="Theme Preference" value="Loading..." icon={Moon} hasBorder={false} />;
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('system');
  };

  const getThemeDisplay = () => {
    if (theme === 'dark') return { label: 'Deep Dark (Monochrome)', icon: Moon };
    if (theme === 'light') return { label: 'Pure Light', icon: Sun };
    return { label: 'System Default', icon: Monitor };
  };

  const display = getThemeDisplay();

  return (
    <SettingsRow 
      label="Theme Preference" 
      value={display.label}
      icon={display.icon}
      onClick={cycleTheme}
      hasBorder={false}
    />
  );
};
