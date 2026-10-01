import React from 'react';
import { Country } from '../types/country';
import { getCountryByCode } from '../data/countriesData';
import { COUNTRY_DEEP_PROFILES } from '../data/countryDeepProfiles';
import { CountryFlag } from './CountryFlag';
import { CapsuleBreadcrumb, BreadcrumbSegment } from './CapsuleBreadcrumb';
import { WikipediaIndexPanel } from './WikipediaIndexPanel';
import {
  Building2,
  Users,
  Maximize2,
  Calendar,
  Coins,
  Languages,
  ExternalLink,
  Layers,
  BookOpen,
  Scale,
  Award,
  Compass,
  Factory,
  Trophy,
  Palette,
  Flag,
  Fingerprint,
  AtSign,
  ChevronRight
} from 'lucide-react';

interface CountryDetailPageProps {
  country: Country;
  onBackToCountryList: () => void;
  onBackToWorldOverview: () => void;
  onSelectNeighborCountry: (country: Country) => void;
  onOpenSublist?: (sublistTitle: string) => void;
  onOpenStatesDirectory?: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const CountryDetailPage: React.FC<CountryDetailPageProps> = ({
  country,
  onBackToCountryList,
  onBackToWorldOverview,
  onSelectNeighborCountry,
  onOpenSublist,
  onOpenStatesDirectory,
  isBookmarked,
  onToggleBookmark
}) => {
  // Merge static base country data with deep profile if present
  const deepProfile = COUNTRY_DEEP_PROFILES[country.code] || {};
  const mergedCountry: Country = {
    ...country,
    ...deepProfile
  };

  const isUnitedStates = country.code === 'US' || country.name.toLowerCase().includes('united states');

  // Hierarchical Breadcrumb with 3 Tones:
  // Ancestors (Medium) -> Current Country (Bold High-contrast) -> Subdivisions: States / County / City / Town / Village (Faded)
  const breadcrumbSegments: BreadcrumbSegment[] = [
    { label: 'liii.st', onClick: onBackToCountryList, hierarchyTone: 'ancestor' },
    { label: 'World', onClick: onBackToWorldOverview, hierarchyTone: 'ancestor' },
    { label: 'Country', onClick: onBackToCountryList, hierarchyTone: 'ancestor' },
    { label: country.name, isCurrent: true, hierarchyTone: 'current' },
    {
      label: 'States',
      onClick: onOpenStatesDirectory,
      hierarchyTone: 'subdivision'
    },
    { label: 'County', hierarchyTone: 'subdivision' },
    { label: 'City', hierarchyTone: 'subdivision' },
    { label: 'Town', hierarchyTone: 'subdivision' },
    { label: 'Village', hierarchyTone: 'subdivision' }
  ];

  const dnaHandle = `@${country.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const dnaId = `DNA-COUNTRY-${country.code}`;
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.replace(/\s+/g, '_'))}`;

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Main Responsive Layout: Left Wikipedia INDEX Panel (LTR) + Right Content Container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Pure English Wikipedia-style Interactive INDEX Column with Collapse Toggle */}
        <WikipediaIndexPanel
          entityType="country"
          className="hidden lg:block"
        />

        {/* Main Bento Cards Container */}
        <div className="flex-1 w-full space-y-6">
          {/* Bento Card 1: Hero Identity Card (Full Width) */}
          <div id="overview" className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* High-fidelity Vector SVG Flag */}
              <CountryFlag
                code={country.code}
                className="w-24 h-16 sm:w-28 sm:h-18 rounded-lg  shrink-0"
                title={country.name}
              />

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {/* WORLD DATA DNA Universal Handle & Cryptographic ID Badge */}
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold flex items-center gap-1">
                    <AtSign className="w-3 h-3" />
                    {dnaHandle.slice(1)}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3" />
                    {dnaId}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    ISO {country.code}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-white pt-1">
                  {country.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                  {country.officialName}
                </p>
              </div>
            </div>

            {/* Quick Tag Badges with Direct Access Badge to States */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/40">
                {country.continent}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/40">
                Capital: {country.capital}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/40 dark:border-neutral-800/40">
                Currency: {country.currency.code} ({country.currency.symbol})
              </span>

              {/* Direct Access Pill to States / Subdivisions (Clean & Minimal) */}
              {onOpenStatesDirectory && (
                <button
                  type="button"
                  onClick={onOpenStatesDirectory}
                  className="px-3 py-1 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer "
                  title="Explore States and Subdivisions directory"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Explore States ({isUnitedStates ? '50 States' : 'Subdivisions'})</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Bento Grid: Statistics & Specs */}
          <div id="demographics" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
              Population, Landmass & Demographics
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>POPULATION</span>
                </div>
                <span className="font-bold tabular-nums text-neutral-900 dark:text-white text-sm">
                  {country.population.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] mb-1">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>AREA (SQ KM)</span>
                </div>
                <span className="font-bold tabular-nums text-neutral-900 dark:text-white text-sm">
                  {country.areaKm2.toLocaleString()} km²
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>CAPITAL</span>
                </div>
                <span className="font-bold text-neutral-900 dark:text-white truncate block text-sm">
                  {country.capital}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>FOUNDED</span>
                </div>
                <span className="font-bold tabular-nums text-neutral-900 dark:text-white text-sm">
                  {country.independenceYear > 0
                    ? country.independenceYear
                    : `${Math.abs(country.independenceYear)} BCE`}
                </span>
              </div>
            </div>
          </div>

          {/* Bento 2 Columns: History & Culture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* History & Genesis */}
            <div id="history" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                History & Genesis
              </span>

              <div className="space-y-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Historical Emergence & Origin
                  </span>
                  <p className="font-mono text-xs">
                    {mergedCountry.historyOrigin ||
                      `${country.name} was established through historic sovereign milestones, rooted in distinct ancestral culture, regional treaties, and constitutional formalization.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                    Revolutions & Transformations
                  </span>
                  <p className="font-mono text-xs">
                    {mergedCountry.revolutions ||
                      `Pivotal constitutional and political transitions that led to the recognized statehood in ${country.independenceYear > 0 ? country.independenceYear : Math.abs(country.independenceYear) + ' BCE'}.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Culture & Heritage */}
            <div id="culture" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Culture, Arts & Heritage
              </span>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono leading-relaxed text-neutral-700 dark:text-neutral-300">
                <p>
                  {mergedCountry.cultureHeritage ||
                    `${country.name} possesses rich cultural heritage, vibrant linguistic traditions, indigenous folklore, world-acclaimed culinary art, and celebrated literature.`}
                </p>
              </div>

              {/* Language Section */}
              <div id="language" className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] mb-1">
                  <Languages className="w-3.5 h-3.5" />
                  <span>OFFICIAL LANGUAGES</span>
                </div>
                <div className="font-bold text-neutral-900 dark:text-white">
                  {country.languages.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Bento 2 Columns: Politics/Government & Luminaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Government, Politics & Parties */}
            <div id="government" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Government & Leadership
              </span>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono space-y-1">
                <div className="font-bold text-neutral-900 dark:text-white">
                  {mergedCountry.politics?.system || 'Constitutional Republic & Democratic Framework'}
                </div>
                {mergedCountry.politics?.headOfState && (
                  <div className="text-[11px] text-neutral-500">
                    Head of State: {mergedCountry.politics.headOfState}
                  </div>
                )}
              </div>

              <div id="parties" className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Flag className="w-3 h-3 text-neutral-400" />
                  Political Spectrum & Parliaments
                </span>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Multilateral political representation, legislative assemblies, and judicial constitutional court.
                </p>
              </div>
            </div>

            {/* Luminaries */}
            <div id="luminaries" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Celebrated Figures & Luminaries
              </span>

              <div className="flex flex-wrap gap-2">
                {(mergedCountry.luminaries && mergedCountry.luminaries.length > 0
                  ? mergedCountry.luminaries
                  : [country.capital + ' Founders', 'National Laureates', 'Pioneering Scholars']
                ).map((person: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 border border-neutral-200/50 dark:border-neutral-700/50 font-mono"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bento 2 Columns: Economy/Brands & Sports/Tourism */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Economy & Brands */}
            <div id="economy" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                Economy & Currency
              </span>

              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono space-y-1">
                <div className="font-bold text-neutral-900 dark:text-white">
                  Currency: {country.currency.name} ({country.currency.code} - {country.currency.symbol})
                </div>
                <div className="text-[11px] text-neutral-500">
                  Calling Code: {country.callingCode} • TLD: {country.tld}
                </div>
              </div>

              <div id="brands" className="pt-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Factory className="w-3 h-3 text-neutral-400" />
                  Key Global Enterprises & Brands
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(mergedCountry.brands && mergedCountry.brands.length > 0
                    ? mergedCountry.brands
                    : ['Domestic Production', 'National Energy', 'Telecommunications']
                  ).map((brand: string, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 border border-neutral-200/50 dark:border-neutral-700/50 font-mono"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sports & Tourism */}
            <div id="tourism" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Tourism, Landmarks & Sports
              </span>

              <div className="flex flex-wrap gap-1.5">
                {(mergedCountry.tourism && mergedCountry.tourism.length > 0
                  ? mergedCountry.tourism
                  : ['Historic Capital Center', 'National Museums', 'Natural Reserves']
                ).map((spot: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50 font-mono"
                  >
                    {spot}
                  </span>
                ))}
              </div>

              <div id="sports" className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 text-xs font-mono">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-neutral-400" />
                  Athletics & Sports Culture
                </span>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  National sporting leagues, Olympic committee delegations, and popular recreational traditions.
                </p>
              </div>
            </div>
          </div>

          {/* Full Encyclopedia Text & Verifiable Wikipedia Source Widget */}
          <div id="wikipedia-article" className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Universal Encyclopedia Record
                </span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mt-1">
                  Comprehensive Overview of {country.name}
                </h3>
              </div>

              {/* Verified Source Small Widget linking to Wikipedia */}
              <a
                href={wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 transition-all flex items-center gap-2 text-xs font-mono text-neutral-800 dark:text-neutral-200 group shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Source: Wikipedia ({country.name})</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Authoritative Encyclopedia Content */}
            <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-neutral-700 dark:text-neutral-300">
              <p>
                The <strong>{country.officialName}</strong> (commonly known as <strong>{country.name}</strong>) is a sovereign nation situated in {country.continent}, with its capital established at <strong>{country.capital}</strong>. Encompassing a geographic landmass of approximately <strong>{country.areaKm2.toLocaleString()} km²</strong> and supporting a documented population exceeding <strong>{country.population.toLocaleString()}</strong> inhabitants, {country.name} stands as an integral constituent within the geopolitical and economic topology of the planet.
              </p>

              <p>
                Historically formalized with sovereign status in <strong>{country.independenceYear > 0 ? country.independenceYear : Math.abs(country.independenceYear) + ' BCE'}</strong>, the state maintains a governance framework under a constitutional mandate. Sovereign economic transactions are denominated in the national currency, the <strong>{country.currency.name} ({country.currency.code})</strong>, while primary state and civil communications are conducted in its recognized languages: <em>{country.languages.join(', ')}</em>.
              </p>

              <p>
                Culturally and industrially, the nation participates extensively in multilateral international institutions, contributing globally across technological invention, arts, scientific laureates, and trade corridors. Its sovereign domain coordinates municipal subdivisions, urban centers, and preserved reserves registered in world heritage conservation indices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
