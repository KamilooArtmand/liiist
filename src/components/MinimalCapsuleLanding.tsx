import React from 'react';
import { Globe2, Layers, Building2, ChevronRight, ExternalLink, Library, Film } from 'lucide-react';
import { Country } from '../types/country';
import { StateInfo, CityInfo } from '../types/hierarchy';
import { COUNTRIES_DATA } from '../data/countriesData';
import { ALL_50_US_STATES } from '../data/usStatesData';
import { ALL_NEW_YORK_CITIES } from '../data/newYorkCitiesData';
import { CountryFlag } from './CountryFlag';
import { WORLD_LANGUAGES } from '../data/worldLanguagesData';
import { MOVIES_100 } from '../data/moviesData';
import { WorldLanguage } from '../types/worldLanguage';
import { USStateFlag } from './USStateFlag';

interface LandingListColumnProps<T> {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  count: number;
  lastUpdated: string;
  handle: string;
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  onViewAll: () => void;
  viewAllLabel?: string;
}

function LandingListColumn<T>({
  title,
  subtitle,
  icon,
  count,
  lastUpdated,
  handle,
  items,
  renderItem,
  onViewAll,
  viewAllLabel = 'View All'
}: LandingListColumnProps<T>) {
  return (
    <div className="flex-1 w-full min-w-[240px] max-w-md rounded-[20px] p-3.5 sm:p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-2.5 group hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300">
      {/* Top Header Card */}
      <div className="space-y-2 pb-2.5 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-center text-neutral-950 dark:text-white shrink-0 group-hover:scale-105 transition-transform">
              {icon}
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-neutral-950 dark:text-white tracking-tight leading-tight">
                {title}
              </h2>
              <span className="font-mono text-[9px] text-neutral-400 block mt-0.5">
                {handle}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold font-mono text-neutral-950 dark:text-white tabular-nums block leading-none">
              {count}
            </span>
            <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-400 block mt-1">
              Cataloged
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-1">
          <span>{subtitle}</span>
          <span className="opacity-70">Updated {lastUpdated}</span>
        </div>
      </div>

      {/* 10 Items List */}
      <div className="space-y-1.5 flex-1">
        {items.slice(0, 10).map((item, idx) => (
          <div key={idx}>
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Footer: View All link */}
      <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400">
          Showing top 10 items
        </span>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-mono font-medium text-neutral-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
        >
          <span>{viewAllLabel}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface MinimalCapsuleLandingProps {
  onSelectLanguage: (lang: WorldLanguage) => void;
  onOpenCultureLanguages: () => void;
  onOpenWorldCountries: () => void;
  onOpenWorldOverview: () => void;
  onSelectCountry: (country: Country) => void;
  onOpenCountryDetail: (country: Country) => void;
  onOpenStatesDirectory: () => void;
  onSelectState: (state: StateInfo) => void;
  onSelectCity?: (cityName: string) => void;
  onOpenMoviesTimeline?: () => void;
}

export const MinimalCapsuleLanding: React.FC<MinimalCapsuleLandingProps> = ({
  onSelectLanguage,
  onOpenCultureLanguages,
  onOpenWorldCountries,
  onOpenWorldOverview,
  onSelectCountry,
  onOpenCountryDetail,
  onOpenStatesDirectory,
  onSelectState,
  onSelectCity,
  onOpenMoviesTimeline
}) => {
  const top10Countries = COUNTRIES_DATA.slice(0, 10);
  const top10States = ALL_50_US_STATES.slice(0, 10);
  const top10NYCities = ALL_NEW_YORK_CITIES.slice(0, 10);
  const top10Languages = WORLD_LANGUAGES.slice(0, 10);
  const top10Movies = MOVIES_100.slice(0, 10);

  const newYorkState = ALL_50_US_STATES.find(s => s.code === 'NY') || ALL_50_US_STATES[0];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6 relative min-h-[82vh] space-y-6">
                  {/* 4 Prominent 10-Item Directory Columns */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
        {/* Column 1: Countries of the World */}
        <LandingListColumn<Country>
          title="Countries of the World"
          subtitle="Sovereign Planet Directory"
          icon={<Globe2 className="w-3.5 h-3.5" />}
          count={COUNTRIES_DATA.length}
          lastUpdated="Sep 29, 2026"
          handle="@countries"
          items={top10Countries}
          viewAllLabel="All 195 Nations"
          onViewAll={onOpenWorldCountries}
          renderItem={(c, idx) => (
            <div
              onClick={() => {
                onSelectCountry(c);
                onOpenCountryDetail(c);
              }}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group/row"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] text-neutral-400 w-4 text-right">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <CountryFlag code={c.code} className="w-5 h-3.5 rounded-xs shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                  {c.name}
                </span>
              </div>
              <span className="font-mono text-[9px] text-neutral-400 shrink-0">
                {c.capital}
              </span>
            </div>
          )}
        />

        {/* Column 2: States of the United States */}
        <LandingListColumn<StateInfo>
          title="States of the United States"
          subtitle="50 Sovereign Federated States"
          icon={<Layers className="w-3.5 h-3.5" />}
          count={ALL_50_US_STATES.length}
          lastUpdated="Sep 29, 2026"
          handle="@us-states"
          items={top10States}
          viewAllLabel="All 50 States"
          onViewAll={onOpenStatesDirectory}
          renderItem={(s, idx) => (
            <div
              onClick={() => onSelectState(s)}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group/row"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] text-neutral-400 w-4 text-right">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <USStateFlag code={s.code} name={s.name} className="w-5 h-3.5 rounded-xs shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                  {s.name}
                </span>
              </div>
              <span className="font-mono text-[9px] text-neutral-400 shrink-0">
                {s.code} • {s.capital}
              </span>
            </div>
          )}
        />

        {/* Column 3: Cities of New York State */}
        <LandingListColumn<CityInfo>
          title="Cities of New York State"
          subtitle="Incorporated Municipalities"
          icon={<Building2 className="w-3.5 h-3.5" />}
          count={ALL_NEW_YORK_CITIES.length}
          lastUpdated="Sep 29, 2026"
          handle="@ny-cities"
          items={top10NYCities}
          viewAllLabel="Explore NY State"
          onViewAll={() => onSelectState(newYorkState)}
          renderItem={(city, idx) => (
            <div
              onClick={() => {
                onSelectState(newYorkState);
                onSelectCity?.(city.name);
              }}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group/row"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] text-neutral-400 w-4 text-right">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                  {city.name}
                </span>
                {city.isCapital && (
                  <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase">
                    Cap
                  </span>
                )}
              </div>
              <span className="font-mono text-[9px] text-neutral-400 tabular-nums shrink-0">
                {city.population.toLocaleString()}
              </span>
            </div>
          )}
        />

        {/* Column 4: World Languages */}
        <LandingListColumn<WorldLanguage>
          title="World Languages"
          subtitle="Top Spoken Tongues"
          icon={<Library className="w-3.5 h-3.5" />}
          count={WORLD_LANGUAGES.length}
          lastUpdated="Today"
          handle="@languages"
          items={top10Languages}
          viewAllLabel="All Languages"
          onViewAll={onOpenCultureLanguages}
          renderItem={(l, idx) => (
            <div
              onClick={() => onSelectLanguage(l)}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer group/row"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-[10px] text-neutral-400 w-4 text-right shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-sm font-black font-serif text-neutral-300 dark:text-neutral-700 select-none shrink-0 w-4 text-center">
                  {l.nativeName.charAt(0)}
                </span>
                <span className="text-[11px] font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                  {l.name}
                </span>
              </div>
              <div className="text-right shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
