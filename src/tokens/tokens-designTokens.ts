// Design Tokens Source of Truth — Monochromatic Palette: Pure White, Grays, Pure Black
export const DESIGN_TOKENS = {
  colors: {
    black: '#000000',
    obsidian: '#0a0a0a',
    charcoal: '#121212',
    graphite: '#1c1c1c',
    grayDark: '#262626',
    grayMedium: '#525252',
    grayMuted: '#737373',
    grayLight: '#a3a3a3',
    graySubtle: '#e5e5e5',
    offWhite: '#f5f5f5',
    white: '#ffffff',
  },
  typography: {
    fontSans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontMono: "'Inter', monospace",
  },
  radius: {
    capsule: '9999px',
    curvedXl: '2.25rem', // 36px
    curvedLg: '1.75rem', // 28px
    curvedMd: '1.25rem', // 20px
    curvedSm: '0.875rem', // 14px
  },
  glass: {
    dark: {
      background: 'rgba(10, 10, 10, 0.8)',
      border: 'rgba(255, 255, 255, 0.1)',
      hoverBorder: 'rgba(255, 255, 255, 0.25)',
      backdropBlur: 'blur(28px)',
      specular: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
    },
    light: {
      background: 'rgba(255, 255, 255, 0.85)',
      border: 'rgba(0, 0, 0, 0.08)',
      hoverBorder: 'rgba(0, 0, 0, 0.22)',
      backdropBlur: 'blur(28px)',
      specular: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 100%)',
    }
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
