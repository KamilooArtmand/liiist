import React from 'react';
import { Inter, Vazirmatn } from 'next/font/google';
import { headers } from 'next/headers';
import '../../../../src/index.css'; // Adjust path depending on where index.css actually lives

// 1. STRICT TYPOGRAPHY ENGINE (Variable Fonts Only)
// English/Latin fallback strictly restricted to Inter Variable
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
  axes: ['slnt'], // Optionally include weight/slant axes if needed
});

// RTL (Arabic, Persian, Kurdish) strictly restricted to Vazirmatn Variable
const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'], // Vazirmatn includes latin fallback but prioritized for arabic
  variable: '--font-primary',
  display: 'swap',
});

// Utility to parse the locale from headers
function getLocaleSettings(acceptLanguage: string | null) {
  // Default to English LTR
  if (!acceptLanguage) return { lang: 'en', dir: 'ltr', fontClass: inter.variable };

  const lowerLang = acceptLanguage.toLowerCase();
  
  // Detect RTL languages
  if (lowerLang.includes('fa') || lowerLang.includes('ar') || lowerLang.includes('ku')) {
    // For Persian (fa), Arabic (ar), and Kurdish Sorani (ku)
    return { lang: lowerLang.split('-')[0], dir: 'rtl', fontClass: vazirmatn.variable };
  }

  // Default Latin
  return { lang: 'en', dir: 'ltr', fontClass: inter.variable };
}

export const metadata = {
  title: 'Liiist | Absolute Typography',
  description: 'The infinite taxonomy engine.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  
  const { lang, dir, fontClass } = getLocaleSettings(acceptLanguage);

  return (
    // 2. INJECTING TYPOGRAPHY AND DIRECTION
    // - dir: strictly set to RTL or LTR
    // - fontClass: injects --font-primary variable (Inter or Vazirmatn)
    // - antialiased: hardware accelerated rendering
    <html lang={lang} dir={dir} className={`${fontClass} antialiased subpixel-antialiased`}>
      <body className="w-full min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
