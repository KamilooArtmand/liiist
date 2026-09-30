import React from 'react';
import { Inter, Vazirmatn } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { InstallWidget } from '@liiist/ui';
import { getMessages } from 'next-intl/server';
import '../../../../src/index.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-primary', display: 'swap' });
const vazirmatn = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-primary', display: 'swap' });

function getLocaleSettings(locale: string) {
  if (['fa', 'ar', 'ku'].includes(locale)) {
    return { dir: 'rtl', fontClass: vazirmatn.variable };
  }
  return { dir: 'ltr', fontClass: inter.variable };
}

export const metadata = {
  title: 'Liiist | 1 World 1 List',
  description: 'The infinite taxonomy engine.',
};

export default async function RootLayout({ 
  children,
  params: { locale } 
}: { 
  children: React.ReactNode,
  params: { locale: string }
}) {
  const { dir, fontClass } = getLocaleSettings(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={`${fontClass} antialiased subpixel-antialiased`}>
      <body className="w-full min-h-screen font-sans">
        <NextIntlClientProvider messages={messages}>
          {children}
          <InstallWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

