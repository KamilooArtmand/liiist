import React, { useState } from 'react';
import { StateInfo } from '../types/hierarchy';
import { WikipediaIndexPanel } from './WikipediaIndexPanel';
import { USStateFlag } from './USStateFlag';
import { US_STATE_COVERS } from '../data/usStateCovers';
import { ALL_NEW_YORK_COUNTIES } from '../data/newYorkCountiesData';
import {
  Building2,
  Users,
  Maximize2,
  Calendar,
  Coins,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  Compass,
  Factory,
  Check,
  ChevronRight,
  TrendingUp,
  Landmark,
  Fingerprint,
  AtSign,
  Search,
  Image as ImageIcon,
  Scale,
  FileText,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

interface StateDetailPageProps {
  state: StateInfo;
  countryName?: string;
  onBackToCountry: () => void;
  onBackToWorldOverview: () => void;
  onGoHome: () => void;
  onSelectCity?: (cityName: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const StateDetailPage: React.FC<StateDetailPageProps> = ({
  state,
  countryName = 'United States',
  onBackToCountry,
  onBackToWorldOverview,
  onGoHome,
  onSelectCity,
  isBookmarked,
  onToggleBookmark
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState('');
  const [countyFilter, setCountyFilter] = useState('');

  const dnaHandle = `@${state.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const dnaId = `DNA-STATE-${state.code}`;
  const coverUrl = state.coverUrl || US_STATE_COVERS[state.code];
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(state.name.replace(/\s+/g, '_'))}`;

  const isNewYork = state.code === 'NY';

  const filteredCities = state.cities.filter(c =>
    c.name.toLowerCase().includes(cityFilter.toLowerCase()) ||
    (c.nickname && c.nickname.toLowerCase().includes(cityFilter.toLowerCase()))
  );

  const filteredCounties = ALL_NEW_YORK_COUNTIES.filter(c =>
    c.name.toLowerCase().includes(countyFilter.toLowerCase()) ||
    c.countySeat.toLowerCase().includes(countyFilter.toLowerCase()) ||
    (c.boroughEquivalent && c.boroughEquivalent.toLowerCase().includes(countyFilter.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Main Layout: Left side is Dynamic Hover-Pill Wikipedia Index Panel, Right is State Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Pure English Wikipedia-style Interactive Hover-Pill INDEX Column */}
        <WikipediaIndexPanel
          entityType="state"
          className="hidden lg:flex"
        />

        {/* Right Side: Bento Cards for the State, Counties & Cities */}
        <div className="flex-1 w-full space-y-6">
          {/* Representative Visual Cover Banner */}
          {coverUrl && (
            <div className="relative w-full h-48 sm:h-72 rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800  group">
              <img
                src={coverUrl}
                alt={`Panoramic view of ${state.name}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/70 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    Representative State Landmark & Biome
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-">
                    {state.landmarks[0] || state.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <USStateFlag
                    code={state.code}
                    name={state.name}
                    className="w-14 h-9 sm:w-16 sm:h-10 rounded-lg  border border-white/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hero State Identity Card */}
          <div id="overview" className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                {/* Official Vector US State Flag */}
                <USStateFlag
                  code={state.code}
                  name={state.name}
                  className="w-20 h-13 sm:w-24 sm:h-16 rounded-xl  border border-neutral-200/80 dark:border-neutral-700/80 shrink-0"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold flex items-center gap-1">
                      <AtSign className="w-3 h-3" />
                      {dnaHandle.slice(1)}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center gap-1">
                      <Fingerprint className="w-3 h-3" />
                      {dnaId}
                    </span>
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold">
                      STATE: {state.code}
                    </span>
                    <span className="font-mono text-xs text-neutral-400">
                      Admitted {state.admissionYear}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white mt-2">
                    {state.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                    "{state.nickname}" • Motto: {state.motto}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right sm:border-l sm:border-neutral-200/60 sm:dark:border-neutral-800/60 sm:pl-6 shrink-0 space-y-1">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  CAPITAL CITY
                </span>
                <span className="text-lg font-bold text-neutral-950 dark:text-white">
                  {state.capital}
                </span>
                <span className="text-xs font-mono text-neutral-500 block">
                  Governor: {state.governor}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 block">
                  Timezone: {state.timezone}
                </span>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div id="demographics" className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-[10px] text-neutral-400 block mb-1">POPULATION</span>
                <span className="font-bold text-neutral-950 dark:text-white tabular-nums text-sm">
                  {state.population.toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-[10px] text-neutral-400 block mb-1">AREA (SQ KM)</span>
                <span className="font-bold text-neutral-950 dark:text-white tabular-nums text-sm">
                  {state.areaKm2.toLocaleString()} km²
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-[10px] text-neutral-400 block mb-1">STATE GDP</span>
                <span className="font-bold text-neutral-950 dark:text-white tabular-nums text-sm">
                  ${state.gdpBillion} Billion
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40">
                <span className="text-[10px] text-neutral-400 block mb-1">SUBDIVISIONS</span>
                <span className="font-bold text-neutral-950 dark:text-white tabular-nums text-sm">
                  {state.subdivisionsCount || 62} Counties
                </span>
              </div>
            </div>
          </div>

          {/* DEDICATED COUNTIES SECTION (Detailed County Hierarchy explanation + 62 Counties of NY) */}
          <div id="counties" className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Primary Administrative Subdivision • Level 3.5 Node
                </span>
                <h3 className="text-xl font-bold text-neutral-950 dark:text-white mt-1">
                  What is a "County" in United States & New York?
                </h3>
              </div>

              {isNewYork && (
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={countyFilter}
                    onChange={(e) => setCountyFilter(e.target.value)}
                    placeholder="Search 62 New York counties..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              )}
            </div>

            {/* Clear Educational Explanatory Card */}
            <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 space-y-2 text-xs sm:text-sm font-sans leading-relaxed text-neutral-700 dark:text-neutral-300">
              <p>
                در ساختار فدرال ایالات متحده آمریکا، هر ایالت به بخش‌های اداری و قضایی به نام <strong>شهرستان (County)</strong> تقسیم می‌شود. ایالت نیویورک دارای <strong>۶۲ شهرستان رسمی</strong> است.
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                <strong>نکته کلیدی شهر نیویورک (NYC):</strong> ۵ محله معروف شهر نیویورک (Boroughs) هرکدام دقیقاً معادل یک شهرستان رسمی هستند: منهتن = New York County، بروکلین = Kings County، کوئینز = Queens County، برانکس = Bronx County، و استیتن آیلند = Richmond County.
              </p>
            </div>

            {/* Complete Directory of New York Counties */}
            {isNewYork && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Showing {filteredCounties.length} of 62 Official Counties</span>
                  <span>Established 1683 – 1914</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto no-scrollbar pr-1">
                  {filteredCounties.map((c) => (
                    <div
                      key={c.fipsCode}
                      className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-800/40 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="font-bold text-xs text-neutral-950 dark:text-white block">
                            {c.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            Seat: {c.countySeat}
                          </span>
                        </div>
                        {c.boroughEquivalent ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shrink-0">
                            {c.boroughEquivalent}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                            Est. {c.establishedYear}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-neutral-200/30 dark:border-neutral-800/30 text-neutral-500">
                        <span>Pop: {c.population.toLocaleString()}</span>
                        <span>{c.areaKm2} km²</span>
                      </div>

                      {c.description && (
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans line-clamp-1">
                          {c.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bento Card: ALL CITIES of the State (Universal Municipalities Directory) */}
          <div id="cities" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Incorporated Municipalities • Level 4 Hierarchy
                </span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mt-0.5">
                  Cities & Metropolitan Areas of {state.name} ({state.cities.length})
                </h3>
              </div>

              {/* City quick filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder={`Search ${state.cities.length} cities...`}
                  className="w-full pl-8 pr-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCities.map((city, idx) => {
                const citySlug = city.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                return (
                  <div
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city.name);
                      onSelectCity?.(city.name);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-2.5 ${
                      selectedCity === city.name
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-transparent '
                        : 'bg-neutral-100 dark:bg-neutral-950 border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-xs opacity-50">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-bold text-sm truncate">
                            {city.name}
                          </span>
                          {city.isCapital && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold uppercase shrink-0">
                              Capital
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] opacity-60 shrink-0">
                          @{citySlug}
                        </span>
                      </div>

                      {city.nickname && (
                        <p className="text-[11px] opacity-70 font-mono mt-1 truncate">
                          "{city.nickname}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-2 opacity-80 border-t border-neutral-200/40 dark:border-neutral-800/40">
                      <span>Pop: {city.population.toLocaleString()}</span>
                      {city.areaKm2 ? <span>{city.areaKm2} km²</span> : <span className="opacity-50">City</span>}
                    </div>

                    {city.notableAttractions && city.notableAttractions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {city.notableAttractions.slice(0, 2).map((att, aIdx) => (
                          <span
                            key={aIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-neutral-200 dark:bg-neutral-800 font-mono truncate max-w-[140px]"
                          >
                            {att}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Grid: History, Culture, Economy & Enterprises */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* History Card */}
            <div id="history" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                History & Statehood
              </span>
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-mono">
                {state.history}
              </p>
            </div>

            {/* Culture Card */}
            <div id="culture" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cultural Heritage & Ethos
              </span>
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-mono">
                {state.culture}
              </p>
            </div>

            {/* Economy & Brands Card */}
            <div id="economy" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5" />
                Economy & Key Enterprises
              </span>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                {state.economy}
              </p>
              <div id="brands" className="pt-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Prominent State Brands
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {state.brands.map((brand, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-900 dark:text-neutral-100 border border-neutral-200/50 dark:border-neutral-700/50"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Luminaries & Landmarks Card */}
            <div id="luminaries" className="liquid-glass-card p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Distinguished Figures & Landmarks
              </span>
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Historical & Modern Luminaries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {state.luminaries.map((person, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-[11px] text-neutral-800 dark:text-neutral-200 font-mono"
                    >
                      {person}
                    </span>
                  ))}
                </div>
              </div>
              <div id="landmarks" className="pt-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Iconic Landmarks & Reserves
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {state.landmarks.map((mark, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/40 dark:border-neutral-700/40 text-[11px] text-neutral-700 dark:text-neutral-300 font-mono"
                    >
                      {mark}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Encyclopedia Text & Verifiable Wikipedia Source Card */}
          <div className="liquid-glass-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  State Encyclopedia Record
                </span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mt-1">
                  Comprehensive Overview of {state.name}
                </h3>
              </div>

              <a
                href={wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 transition-all flex items-center gap-2 text-xs font-mono text-neutral-800 dark:text-neutral-200 group shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Source: Wikipedia ({state.name})</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              </a>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-sans leading-relaxed text-neutral-700 dark:text-neutral-300">
              <p>
                <strong>{state.name}</strong> (officially known by its nickname <em>"{state.nickname}"</em>) was admitted to the United States union in <strong>{state.admissionYear}</strong>. Governing from its capital in <strong>{state.capital}</strong> under Governor {state.governor}, {state.name} encompasses a territory of <strong>{state.areaKm2.toLocaleString()} km²</strong> and supports a documented population of <strong>{state.population.toLocaleString()}</strong> residents across {state.subdivisionsCount || 62} counties.
              </p>
              <p>
                As a pillar of the American confederation, the state generates an annual Gross Domestic Product exceeding <strong>${state.gdpBillion} Billion</strong>, driven by foundational sectors in financial banking, advanced technology, logistics, agriculture, and world-class universities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
