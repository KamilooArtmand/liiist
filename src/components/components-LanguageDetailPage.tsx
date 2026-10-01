import React from 'react';
import { WorldLanguage } from '../types/types-worldLanguage';
import { Users, Library, Activity, BookOpen, Mic2, Map, Shield } from 'lucide-react';
import { WikipediaIndexPanel } from './components-WikipediaIndexPanel';

interface LanguageDetailPageProps {
  language: WorldLanguage;
}

export const LanguageDetailPage: React.FC<LanguageDetailPageProps> = ({ language }) => {
  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Interactive INDEX Column + Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Dynamic Wikipedia Panel for Language */}
        <WikipediaIndexPanel
          entityType="language"
          customSections={[
            { id: 'overview', title: 'Overview', iconName: 'BookOpen' },
            { id: 'classification', title: 'Classification', iconName: 'Layers' },
            { id: 'geography', title: 'Geographic Distribution', iconName: 'Map' },
            { id: 'phonology', title: 'Phonology & Accents', iconName: 'Mic2' },
            { id: 'writing', title: 'Writing System', iconName: 'Palette' },
            { id: 'history', title: 'History & Evolution', iconName: 'Compass' }
          ]}
          className="hidden lg:block sticky top-20"
        />

        <div className="flex-1 w-full space-y-6">
          {/* Main Hero Card */}
          <div id="overview" className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 relative overflow-hidden">
            
            {/* Background Watermark */}
            <div className="absolute right-0 bottom-0 text-[200px] font-black text-neutral-50 dark:text-neutral-800/20 opacity-40 select-none pointer-events-none transform translate-x-1/4 translate-y-1/4 leading-none">
              {language.nativeName.charAt(0)}
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold tracking-wider uppercase">
                  <Library className="w-3.5 h-3.5" />
                  Spoken Language
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                  {language.name}
                </h1>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-neutral-500 dark:text-neutral-400 mt-2">
                  {language.nativeName}
                </p>
              </div>

              {/* Badges/ISO Code */}
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-mono text-sm font-bold flex items-center gap-2">
                  <span>ISO 639</span>
                  <span className="w-px h-3 bg-white/30 dark:bg-black/30" />
                  <span className="uppercase">{language.code}</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl leading-relaxed relative z-10">
              {language.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                  <Users className="w-3.5 h-3.5" /> Speakers
                </div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                  ~{language.speakers} Million
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                  <Activity className="w-3.5 h-3.5" /> Status
                </div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white">
                  Active
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" /> Family
                </div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white truncate" title={language.family}>
                  {language.family}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs uppercase font-bold tracking-wider">
                  <Shield className="w-3.5 h-3.5" /> Branch
                </div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white truncate" title={language.branch}>
                  {language.branch}
                </div>
              </div>
            </div>
          </div>

          {/* Dummy Content Blocks matching the INDEX */}
          <div id="classification" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Classification</h2>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 font-mono text-sm space-y-2 text-neutral-700 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Family:</span>
                <span className="font-bold">{language.family}</span>
              </div>
              <div className="flex items-center gap-2 pl-4">
                <span className="text-neutral-400">↳ Branch:</span>
                <span className="font-bold">{language.branch}</span>
              </div>
              <div className="flex items-center gap-2 pl-8">
                <span className="text-neutral-400">↳ Language:</span>
                <span className="font-bold text-black dark:text-white">{language.name}</span>
              </div>
            </div>
          </div>

          <div id="geography" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Geographic Distribution</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {language.name} is spoken across numerous regions, acting as a critical pillar of cultural identity. It serves as an official or widely recognized language in multiple territories, facilitating administration, media, and daily communication.
            </p>
          </div>

          <div id="phonology" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Phonology & Accents</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The language features a rich tapestry of dialects and accents, each reflecting the historical migrations and socio-cultural interactions of its speakers. Dialectal variations often include distinct phonetic inventories, intonation patterns, and localized vocabulary.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium">
              <Mic2 className="w-4 h-4" />
              Accent exploration features coming soon to this namespace.
            </div>
          </div>
          
          <div id="writing" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Writing System</h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Historically and presently, {language.name} relies on established orthographic traditions. 
              The most prominent native script rendering is beautifully represented as <span className="font-serif text-black dark:text-white font-bold text-lg">"{language.nativeName}"</span>.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
